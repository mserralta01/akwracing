"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth, googleProvider } from "lib/firebase";
import { useRouter } from "next/navigation";
import { isAdminUser } from "lib/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

const defaultContext: AuthContextType = {
  user: null,
  loading: true,
  signIn: async () => {},
  signInWithGoogle: async () => null,
  signOut: async () => {},
  signUp: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      try {
        const adminStatus = await isAdminUser(result.user);
        if (adminStatus) {
          router.push("/admin");
        }
        return result.user;
      } catch (error) {
        console.error("Error checking admin status:", error);
        return result.user;
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const adminStatus = await isAdminUser(result.user);
      if (adminStatus) {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signOut,
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
