"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourseForm from "@/components/admin/course-form";
import { courseService } from "@/lib/services/course-service";
import type { Course } from "@/types/course";

export default function EditCoursePage() {
  const params = useParams();
  const identifier = params?.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!identifier) return;

      try {
        const courseData = await courseService.getCourseBySlug(identifier);
        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [identifier]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-[600px] bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">
            Course not found or has been removed.
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
          Make changes to your course information
        </p>
      </div>
      <CourseForm initialData={course} />
    </div>
  );
} 