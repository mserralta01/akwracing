"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Course, CourseFormData, CourseLevel } from '@/types/course';
import { courseService } from '@/lib/services/course-service';
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import dynamic from 'next/dynamic';
import { ImageUpload } from '@/components/image-upload';
import { Editor } from "@/components/ui/editor";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { differenceInDays, differenceInWeeks, differenceInMonths } from "date-fns";
import { Switch } from "@/components/ui/switch";

const Tiptap = dynamic(() => import('@/components/tiptap'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
}) as React.ComponentType<{ content: string; onChange: (content: string) => void }>;

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  location: z.string().min(1, "Location is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  availableSpots: z.number().min(1, "Must have at least 1 available spot"),
  price: z.number().min(0, "Price must be 0 or greater"),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  initialData?: Course;
  isEditing?: boolean;
}

export function CourseForm({ initialData, isEditing = false }: CourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      shortDescription: initialData?.shortDescription || "",
      longDescription: initialData?.longDescription || "",
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
      duration: initialData?.duration || 1,
      location: initialData?.location || "",
      level: (initialData?.level as CourseLevel) || "Beginner",
      availableSpots: initialData?.availableSpots || 1,
      price: initialData?.price || 0,
      featured: initialData?.featured ?? false,
    },
  });

  const calculateDuration = (from: Date, to: Date) => {
    const days = differenceInDays(to, from) + 1; // +1 to include both start and end dates
    if (days <= 15) {
      return `${days} day${days === 1 ? '' : 's'}`;
    } else if (days <= 30) {
      const weeks = Math.ceil(days / 7);
      return `${weeks} week${weeks === 1 ? '' : 's'}`;
    } else {
      const months = Math.ceil(differenceInMonths(to, from));
      return `${months} month${months === 1 ? '' : 's'}`;
    }
  };

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const days = differenceInDays(dateRange.to, dateRange.from) + 1;
      form.setValue("startDate", dateRange.from);
      form.setValue("endDate", dateRange.to);
      form.setValue("duration", days);
    }
  }, [dateRange, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const courseData: CourseFormData = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        imageUrl: initialData?.imageUrl || '',
        featured: values.featured,
      };

      if (isEditing && initialData) {
        await courseService.updateCourse(initialData.id, courseData, imageFile || undefined);
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        if (!imageFile) {
          toast({
            title: "Error",
            description: "Please upload a course image",
            variant: "destructive",
          });
          return;
        }
        const newCourseId = await courseService.createCourse(courseData, imageFile);
        setCreatedCourseId(newCourseId);
        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }
      router.push('/admin/course-management');
      router.refresh();
    } catch (error) {
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
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Course' : 'Create Course'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-8">
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
                      <FormDescription>
                        A brief summary of the course (appears in course listings)
                      </FormDescription>
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
                        <Editor
                          content={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Detailed course description (appears on course details page)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Course Dates</FormLabel>
                      <DateRangePicker
                        dateRange={dateRange}
                        onDateRangeChange={(range: DateRange | undefined) => {
                          if (range) {
                            setDateRange(range);
                          }
                        }}
                      />
                      <FormDescription>
                        Select the course start and end dates. Duration will be calculated automatically.
                      </FormDescription>
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
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Course Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={initialData?.imageUrl}
                      onChange={(file: File | null) => setImageFile(file)}
                    />
                  </FormControl>
                  <FormDescription>
                    {isEditing ? "Upload a new image to change the current one" : "Upload a course image"}
                  </FormDescription>
                </FormItem>

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Featured on Home Page
                        </FormLabel>
                        <FormDescription>
                          Display this course in the Training Programs section of the home page
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
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/course-management')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
              </Button>
            </div>
            {createdCourseId && (
              <Button
                className="mt-4"
                onClick={() => router.push(`/admin/course-management/${createdCourseId}/edit`)}
              >
                Edit Course
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
