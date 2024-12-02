"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LeftMenu } from "@/components/admin/left-menu";
import { AdminGuard } from "@/components/auth/admin-guard";
import { useAuth } from "@/contexts/auth-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="flex h-screen">
        <LeftMenu />
        <main className="flex-1 overflow-y-auto transition-[margin] duration-300 ease-in-out">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
