"use client";

import InstructorManagement from "@/components/admin/instructor-management";

export default function InstructorManagementPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Instructor Management</h1>
        <p className="text-muted-foreground">Manage your racing instructors</p>
      </div>
      <InstructorManagement />
    </div>
  );
} 