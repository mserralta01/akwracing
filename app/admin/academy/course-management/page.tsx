"use client";

import { Suspense } from "react";
import CourseManagement from "@/components/admin/course-management";
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

export default function CourseManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Course Management</h1>
        <p className="text-muted-foreground">Manage your racing courses</p>
      </div>
      
      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <CourseManagement />
        </div>
      </div>
    </div>
  );
} 