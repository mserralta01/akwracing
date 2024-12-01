"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Course, CourseFormData } from "@/types/course";
import { courseService } from "@/lib/services/course-service";
import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  instructors: Instructor[];
  mode?: 'create' | 'edit';
};

export function CourseForm({ initialData, instructors, mode = 'create' }: CourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      shortDescription: initialData?.shortDescription || '',
      longDescription: initialData?.longDescription || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
      duration: initialData?.duration || 1,
      location: initialData?.location || '',
      level: initialData?.level || 'Beginner',
      availableSpots: initialData?.availableSpots || 1,
      price: initialData?.price || 0,
      featured: initialData?.featured || false,
      imageUrl: initialData?.imageUrl || null,
      instructorId: initialData?.instructorId || '',
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `courses/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      let imageUrl = data.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const courseData = {
        ...data,
        imageUrl,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      if (initialData) {
        const result = await courseService.updateCourse(initialData.slug, courseData);
        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to update course');
        }
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        const result = await courseService.createCourse(courseData);
        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to create course');
        }
        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }

      router.push('/admin/academy/course-management');
      router.refresh();
    } catch (error) {
      console.error('Error submitting course:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add useEffect for automatic duration calculation
  useEffect(() => {
    const startDate = form.watch('startDate');
    const endDate = form.watch('endDate');

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      form.setValue('duration', diffDays);
    }
  }, [form.watch('startDate'), form.watch('endDate')]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          <Input 
                            type="date" 
                            {...field}
                            value={field.value || ''}
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
                            value={field.value || ''}
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
                            onFocus={(e) => {
                              if (e.target.value === '0') {
                                e.target.value = '';
                              }
                              e.target.select();
                            }}
                            min="0"
                            step="1"
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
                  disabled={isSubmitting}
                  className="bg-racing-red hover:bg-racing-red/90"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {mode === 'edit' ? "Updating..." : "Creating..."}
                    </div>
                  ) : mode === 'edit' ? (
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
