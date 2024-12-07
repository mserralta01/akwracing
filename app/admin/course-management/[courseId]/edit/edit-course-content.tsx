"use client";

import { useEffect, useState } from "react";
import CourseForm from "@/components/admin/course-form";
import { Course } from "@/types/course";
import { courseService } from "@/lib/services/course-service";
import { useToast } from "@/components/ui/use-toast";

interface EditCourseContentProps {
  courseId: string;
}

export function EditCourseContent({ courseId }: EditCourseContentProps) {
  const [course, setCourse] = useState<Course | undefined>();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        const courseData = await courseService.getCourse(courseId);
        setCourse(courseData || undefined);
      } catch (error) {
        console.error("Error loading course:", error);
        toast({
          title: "Error",
          description: "Failed to load course",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Course Not Found</h1>
          <p className="text-muted-foreground">
            The course you are trying to edit does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground">
          Make changes to the course details below
        </p>
      </div>
      <CourseForm initialData={course} />
    </div>
  );
} 