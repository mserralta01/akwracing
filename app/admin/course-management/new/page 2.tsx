"use client";

import { useState, useEffect } from "react";
import { CourseForm } from "@/components/admin/course-form";
import { instructorService } from "lib/services/instructor-service";
import { Instructor } from "@/types/instructor";

export default function NewCoursePage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await instructorService.getInstructors();
        setInstructors(data.instructors);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Course</h1>
        <p className="text-muted-foreground">Add a new course to your catalog</p>
      </div>
      <CourseForm instructors={instructors} />
    </div>
  );
}
