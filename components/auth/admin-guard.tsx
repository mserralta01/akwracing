"use client";

import { useAuth } from "@/contexts/auth-context";
import { isAdminUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdminUser(user)) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !isAdminUser(user)) {
    return null;
  }

  return <>{children}</>;
} 