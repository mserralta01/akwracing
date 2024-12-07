"use client";

import { Suspense } from "react";
import EnrollmentManagement from "@/components/admin/enrollment-management";
import { AdminGuard } from "@/components/auth/admin-guard";

function LoadingFallback() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <Suspense fallback={<LoadingFallback />}>
        <EnrollmentManagement />
      </Suspense>
    </AdminGuard>
  );
} 