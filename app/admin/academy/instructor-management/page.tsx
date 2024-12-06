"use client";

import InstructorManagement from "@/components/admin/instructor-management";

export default async function InstructorManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Team Management</h1>
        <p className="text-muted-foreground">Manage your racing team members</p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <InstructorManagement />
        </div>
      </div>
    </div>
  );
} 