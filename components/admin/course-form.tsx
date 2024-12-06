"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course, CourseLevel } from "@/types/course";
import { Equipment } from "@/types/equipment";
import { courseService } from "@/lib/services/course-service";
import { equipmentService } from "@/lib/services/equipment-service";
import { useToast } from "@/components/ui/use-toast";
import { parseISO, format, isValid, differenceInDays, addDays } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFeatures } from "@/contexts/features-context";
import { Instructor } from "@/types/instructor";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  price: z.number().min(0, "Price must be positive"),
  duration: z.number().min(1, "Duration must be at least 1"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  maxStudents: z.number().min(1, "Maximum students must be at least 1"),
  availableSpots: z.number().min(0, "Available spots cannot be negative"),
  imageUrl: z.string().optional(),
  instructorId: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  featured: z.boolean().default(false),
  equipmentRequirements: z.object({
    provided: z.array(z.string()).default([]),
    required: z.array(z.string()).default([])
  })
});

type FormData = z.infer<typeof formSchema>;

interface CourseFormProps {
  initialData?: Course;
  instructors?: Instructor[];
}

const CourseForm = ({ initialData, instructors }: CourseFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const { features } = useFeatures();

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const equipmentData = await equipmentService.getEquipment();
        setEquipment(Array.isArray(equipmentData) ? equipmentData : [equipmentData]);
      } catch (error) {
        console.error('Failed to load equipment:', error);
        toast({
          title: "Error",
          description: "Failed to load equipment data",
          variant: "destructive",
        });
      }
    };

    loadEquipment();
  }, [toast]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      shortDescription: "",
      longDescription: "",
      level: "Beginner",
      price: 0,
      duration: 1,
      startDate: "",
      endDate: "",
      maxStudents: 1,
      availableSpots: 0,
      location: "",
      featured: false,
      equipmentRequirements: {
        provided: [],
        required: []
      }
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      if (initialData) {
        await courseService.updateCourse(initialData.id, data);
        toast({ title: "Success", description: "Course updated successfully" });
      } else {
        await courseService.createCourse(data);
        toast({ title: "Success", description: "Course created successfully" });
      }
      
      router.push("/admin/academy/course-management");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description</FormLabel>
                  <FormControl>
                    <RichTextEditor 
                      content={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value}
                      onChange={async (file) => {
                        if (file) {
                          try {
                            // Here you would typically upload the file to your storage service
                            // and get back a URL. For now, we'll use a placeholder URL
                            const uploadedUrl = await uploadImageToStorage(file);
                            field.onChange(uploadedUrl);
                          } catch (error) {
                            console.error('Failed to upload image:', error);
                            toast({
                              title: "Error",
                              description: "Failed to upload image",
                              variant: "destructive",
                            });
                          }
                        } else {
                          field.onChange("");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Students</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableSpots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Spots</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {instructors && (
                <FormField
                  control={form.control}
                  name="instructorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select instructor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {instructors.map((instructor) => (
                            <SelectItem key={instructor.id} value={instructor.id}>
                              {instructor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Course</FormLabel>
                      <FormDescription>
                        This course will be displayed in featured sections
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <FormField
              control={form.control}
              name="equipmentRequirements.provided"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provided Equipment</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {equipment.map((item) => (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), item.id]
                                : field.value?.filter((value) => value !== item.id) || [];
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipmentRequirements.required"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Equipment</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {equipment.map((item) => (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), item.id]
                                : field.value?.filter((value) => value !== item.id) || [];
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Course" : "Create Course"}
        </Button>
      </form>
    </Form>
  );
};

// Helper function to upload image to storage
async function uploadImageToStorage(file: File): Promise<string> {
  // TODO: Implement actual file upload logic
  // For now, return a placeholder URL
  return URL.createObjectURL(file);
}

export { CourseForm };
