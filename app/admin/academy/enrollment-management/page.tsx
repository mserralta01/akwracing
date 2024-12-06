"use client";

import { Suspense } from "react";
import { EnrollmentManagement } from "@/components/admin/enrollment-management";
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

export default function EnrollmentManagementPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Enrollment Management</h1>
          <p className="text-muted-foreground">
            Manage course enrollments and student registrations
          </p>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <EnrollmentManagement />
        </Suspense>
      </div>
    </AdminGuard>
  );
} 