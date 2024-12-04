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
  providedEquipment: z.array(z.string()).optional().default([]),
  requiredEquipment: z.array(z.string()).optional().default([]),
});

type FormData = z.infer<typeof formSchema>;

interface CourseFormProps {
  initialData?: Course;
}

export default function CourseForm({ initialData }: CourseFormProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { features } = useFeatures();

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return "";
      return format(date, "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      shortDescription: initialData?.shortDescription || "",
      longDescription: initialData?.longDescription || "",
      level: initialData?.level || "Beginner",
      price: initialData?.price || 0,
      duration: initialData?.duration || 1,
      startDate: formatDateForInput(initialData?.startDate),
      endDate: formatDateForInput(initialData?.endDate),
      maxStudents: initialData?.maxStudents || 1,
      availableSpots: initialData?.availableSpots || initialData?.maxStudents || 1,
      imageUrl: initialData?.imageUrl || "",
      instructorId: initialData?.instructorId || "",
      location: initialData?.location || "",
      featured: initialData?.featured || false,
      providedEquipment: initialData?.equipmentRequirements 
        ? initialData.equipmentRequirements
            .filter((eq) => eq.isProvided)
            .map((eq) => eq.equipmentId)
        : [],
      requiredEquipment: initialData?.equipmentRequirements
        ? initialData.equipmentRequirements
            .filter((eq) => !eq.isProvided)
            .map((eq) => eq.equipmentId)
        : [],
    },
  });

  // Watch for changes in dates and max students
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const maxStudents = form.watch("maxStudents");

  // Update duration when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      if (isValid(start) && isValid(end)) {
        const duration = differenceInDays(end, start) + 1; // +1 to include both start and end days
        form.setValue("duration", duration);
      }
    }
  }, [startDate, endDate, form]);

  // Update available spots when max students changes (only for new courses)
  useEffect(() => {
    if (!initialData && maxStudents) {
      form.setValue("availableSpots", maxStudents);
    }
  }, [maxStudents, initialData, form]);

  useEffect(() => {
    const loadEquipment = async () => {
      if (!features.ecommerce) return;
      
      try {
        const data = await equipmentService.getEquipment();
        setEquipment(data);
      } catch (error) {
        console.error("Error loading equipment:", error);
        toast({
          title: "Error",
          description: "Failed to load equipment",
          variant: "destructive",
        });
      }
    };

    loadEquipment();
  }, [toast, features.ecommerce]);

  const onSubmit = async (data: FormData) => {
    try {
      const equipmentRequirements = features.ecommerce ? [
        ...data.providedEquipment.map((id) => ({
          equipmentId: id,
          isProvided: true,
        })),
        ...data.requiredEquipment.map((id) => ({
          equipmentId: id,
          isProvided: false,
        })),
      ] : [];

      const courseData = {
        ...data,
        equipmentRequirements,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      if (initialData) {
        await courseService.updateCourse(
          initialData.id,
          courseData,
          selectedImage || undefined
        );
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        await courseService.createCourse(
          courseData,
          selectedImage || undefined
        );
        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }

      router.push("/admin/academy/course-management");
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Course title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
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
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Course location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
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
                          <Input
                            type="number"
                            {...field}
                            disabled
                            className="bg-muted"
                          />
                        </FormControl>
                        <FormDescription>
                          Calculated from dates
                        </FormDescription>
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
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              field.onChange(value);
                              if (!initialData) {
                                form.setValue("availableSpots", value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (form.getValues("endDate")) {
                                const start = parseISO(e.target.value);
                                const end = parseISO(form.getValues("endDate"));
                                if (isValid(start) && isValid(end)) {
                                  const duration = differenceInDays(end, start) + 1;
                                  form.setValue("duration", duration);
                                }
                              }
                            }}
                          />
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
                          <Input 
                            type="date" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (form.getValues("startDate")) {
                                const start = parseISO(form.getValues("startDate"));
                                const end = parseISO(e.target.value);
                                if (isValid(start) && isValid(end)) {
                                  const duration = differenceInDays(end, start) + 1;
                                  form.setValue("duration", duration);
                                }
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>
                        A brief summary that appears in course listings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

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
                          className="min-h-[200px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Detailed description of the course content and objectives
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {features.ecommerce && (
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="provided" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="provided">Provided Equipment</TabsTrigger>
                      <TabsTrigger value="required">Required Equipment</TabsTrigger>
                    </TabsList>
                    <TabsContent value="provided" className="mt-4">
                      <FormField
                        control={form.control}
                        name="providedEquipment"
                        render={() => (
                          <FormItem>
                            <div className="grid grid-cols-2 gap-4">
                              {equipment.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="providedEquipment"
                                  render={({ field }) => (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, item.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel className="text-sm font-normal">
                                          {item.name}
                                        </FormLabel>
                                        <FormDescription>
                                          {item.description}
                                        </FormDescription>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="required" className="mt-4">
                      <FormField
                        control={form.control}
                        name="requiredEquipment"
                        render={() => (
                          <FormItem>
                            <div className="grid grid-cols-2 gap-4">
                              {equipment.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="requiredEquipment"
                                  render={({ field }) => (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, item.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel className="text-sm font-normal">
                                          {item.name}
                                        </FormLabel>
                                        <FormDescription>
                                          {item.description}
                                        </FormDescription>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Image</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={(file) => setSelectedImage(file)}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a cover image for the course
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Course</FormLabel>
                        <FormDescription>
                          Display this course on the homepage
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

                <FormField
                  control={form.control}
                  name="availableSpots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Spots</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of spots currently available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-racing-red hover:bg-racing-red/90"
            >
              {initialData ? "Update Course" : "Create Course"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
