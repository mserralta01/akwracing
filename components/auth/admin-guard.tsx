"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAdminUser } from "@/lib/auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!loading && user) {
        const isAdmin = await isAdminUser(user);
        if (!isAdmin) {
          router.push("/");
        }
      } else if (!loading && !user) {
        router.push("/");
      }
    };

    checkAdmin();
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return <>{children}</>;
} 