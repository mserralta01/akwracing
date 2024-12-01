"use client";

import RoleManagement from "@/components/admin/role-management";

export default function RolesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Role Management</h1>
        <p className="text-muted-foreground">
          Manage team roles and permissions
        </p>
      </div>
      <RoleManagement />
    </div>
  );
} 