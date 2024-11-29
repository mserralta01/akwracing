"use client";

import { CourseForm } from "@/components/admin/course-form";
import { instructorService } from "lib/services/instructor-service";

export default async function NewCoursePage() {
  const { instructors } = await instructorService.getInstructors();
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground">Add a new course to your catalog</p>
      </div>
      <CourseForm instructors={instructors} />
    </div>
  );
} 