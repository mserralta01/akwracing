"use client";

import dynamic from "next/dynamic";

const CourseForm = dynamic(() => import("@/components/admin/course-form"), {
  ssr: false,
});

export default function NewCoursePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground">Add a new course to your catalog</p>
      </div>
      <CourseForm />
    </div>
  );
}
