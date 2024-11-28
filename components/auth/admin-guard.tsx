"use client";

import { useAuth } from "contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdminUser } from "lib/auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!loading) {
        if (!user) {
          router.push("/");
          return;
        }

        try {
          const adminStatus = await isAdminUser(user);
          setIsAdmin(adminStatus);
          if (!adminStatus) {
            router.push("/");
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          router.push("/");
        } finally {
          setIsChecking(false);
        }
      }
    };

    checkAdmin();
  }, [user, loading, router]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
