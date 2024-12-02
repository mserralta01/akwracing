"use client";

import { Suspense } from "react";
import { ParentList } from "@/components/admin/parent-list";
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

export default function ParentsPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Parents</h1>
          <p className="text-muted-foreground">
            Manage parent profiles and their students
          </p>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <ParentList />
        </Suspense>
      </div>
    </AdminGuard>
  );
} 