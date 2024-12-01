import DepartmentManagement from "@/components/admin/department-management";

export default function DepartmentsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Department Management</h1>
        <p className="text-muted-foreground">
          Manage team departments and roles
        </p>
      </div>
      <DepartmentManagement />
    </div>
  );
} 