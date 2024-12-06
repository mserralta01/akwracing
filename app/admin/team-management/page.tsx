"use client";

import TeamManagement from "@/components/admin/team-management";
import { AdminGuard } from "@/components/auth/admin-guard";

export default function TeamManagementPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage your racing team members</p>
        </div>
        <TeamManagement />
      </div>
    </AdminGuard>
  );
} 