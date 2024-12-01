"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Course, CourseFormData } from "@/types/course";
import { courseService } from "@/lib/services/course-service";
import { auth } from "@/lib/firebase";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Editor } from "@/components/ui/editor";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/image-upload";
import { Instructor } from "@/types/instructor";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  DollarSign,
  GraduationCap,
  Clock
} from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  location: z.string().min(1, "Location is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  availableSpots: z.number().min(1, "Must have at least 1 available spot"),
  price: z.number().min(0, "Price must be 0 or greater"),
  featured: z.boolean().default(false),
  imageUrl: z.string().nullable(),
  instructorId: z.string().min(1, "Instructor is required"),
});

type FormValues = z.infer<typeof formSchema>;

type CourseFormProps = {
  initialData?: Course;
  isEditing?: boolean;
  instructors: Instructor[];
};

export function CourseForm({ initialData, isEditing = false, instructors }: CourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialData?.imageUrl || undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      shortDescription: initialData?.shortDescription || "",
      longDescription: initialData?.longDescription || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      duration: initialData?.duration || 1,
      location: initialData?.location || "",
      level: initialData?.level || "Beginner",
      availableSpots: initialData?.availableSpots || 1,
      price: initialData?.price || 0,
      featured: initialData?.featured || false,
      imageUrl: initialData?.imageUrl || null,
      instructorId: initialData?.instructorId || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      if (!auth.currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        return;
      }

      const formData: Omit<CourseFormData, 'id' | 'createdAt' | 'updatedAt'> = {
        title: values.title,
        shortDescription: values.shortDescription,
        longDescription: values.longDescription,
        startDate: values.startDate,
        endDate: values.endDate,
        duration: Number(values.duration),
        location: values.location,
        level: values.level,
        availableSpots: Number(values.availableSpots),
        price: Number(values.price),
        featured: Boolean(values.featured),
        imageUrl: values.imageUrl || null,
        instructorId: values.instructorId,
      };

      if (isNaN(formData.duration) || isNaN(formData.availableSpots) || isNaN(formData.price)) {
        toast({
          title: "Error",
          description: "Please enter valid numbers for duration, available spots, and price",
          variant: "destructive",
        });
        return;
      }

      if (isEditing && initialData?.id) {
        await courseService.updateCourse(initialData.id, formData, imageFile || undefined);
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        const result = await courseService.createCourse(formData, imageFile || null);
        
        if (!result.success) {
          toast({
            title: "Error",
            description: result.error?.message || "Failed to create course",
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }
      
      router.push("/admin/academy/course-management");
      router.refresh();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Error: ${error.message}` 
          : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Course Information */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-racing-red" />
                  <h2 className="text-xl font-semibold">Course Details</h2>
                </div>
                <Separator />
                
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Advanced Racing Techniques" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      name="instructorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  </div>

                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief overview of the course"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Image */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-racing-red" />
                  <h2 className="text-xl font-semibold">Course Image</h2>
                </div>
                <Separator />
                <div className="aspect-video relative rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800">
                  <ImageUpload
                    value={previewUrl}
                    onChange={(file) => {
                      setImageFile(file);
                      if (file) {
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Schedule & Logistics */}
          <Card className="lg:col-span-3 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-racing-red" />
                  <h2 className="text-xl font-semibold">Schedule & Logistics</h2>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (days)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
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
                          <Input 
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Description */}
          <Card className="lg:col-span-3 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-racing-red" />
                  <h2 className="text-xl font-semibold">Detailed Description</h2>
                </div>
                <Separator />

                <FormField
                  control={form.control}
                  name="longDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Editor
                          content={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Toggle & Actions */}
        <Card className="lg:col-span-3 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-4">
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

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/academy/course-management")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-racing-red hover:bg-racing-red/90"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </div>
                  ) : isEditing ? (
                    "Update Course"
                  ) : (
                    "Create Course"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
