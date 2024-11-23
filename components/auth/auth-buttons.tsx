"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function AuthButtons() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user.displayName}</span>
          <Button
            variant="outline"
            onClick={signOut}
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <Button
          variant="default"
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </Button>
      )}
    </>
  );
} 