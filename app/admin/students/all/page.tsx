"use client";

import { Suspense } from "react";
import { StudentList } from "@/components/admin/student-list";
import { AdminGuard } from "@/components/auth/admin-guard";

function LoadingFallback() {
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

export default function StudentsPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Manage student profiles and enrollments
          </p>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <StudentList />
        </Suspense>
      </div>
    </AdminGuard>
  );
} 