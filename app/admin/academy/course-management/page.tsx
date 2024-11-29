"use client";

import CourseManagement from "@/components/admin/course-management";

export default function CourseManagementPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-muted-foreground">Manage your racing courses</p>
      </div>
      <CourseManagement />
    </div>
  );
} 