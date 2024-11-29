"use client";

import { InstructorForm } from "@/components/admin/instructor-form";

export default function NewInstructorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Instructor</h1>
        <p className="text-muted-foreground">Add a new instructor to your team</p>
      </div>
      <InstructorForm />
    </div>
  );
} 