"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signInWithGoogle } from "@/lib/auth";
import { userService, UserDocument } from "@/lib/services/user-service";

interface AuthContextType {
  user: User | null;
  userDoc: UserDocument | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userDoc: null,
  isAdmin: false,
  loading: true,
  signIn: async () => { throw new Error("Not implemented"); },
  signUp: async () => { throw new Error("Not implemented"); },
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Get or create user document
        let doc = await userService.getUserDocument(user.uid);
        if (!doc) {
          doc = await userService.createUserDocument(user);
        }
        setUserDoc(doc);
        setIsAdmin(doc.role === "admin");
      } else {
        setUserDoc(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (user) {
      // Get or create user document
      let doc = await userService.getUserDocument(user.uid);
      if (!doc) {
        doc = await userService.createUserDocument(user);
      }
      setUserDoc(doc);
      setIsAdmin(doc.role === "admin");
    }
    return user;
  };

  const handleSignUp = async (email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (user) {
      // Create user document
      const doc = await userService.createUserDocument(user);
      setUserDoc(doc);
      setIsAdmin(doc.role === "admin");
    }
    return user;
  };

  const handleSignInWithGoogle = async () => {
    try {
      const user = await signInWithGoogle(auth);
      if (user) {
        // Get or create user document
        let doc = await userService.getUserDocument(user.uid);
        if (!doc) {
          doc = await userService.createUserDocument(user);
        }
        setUserDoc(doc);
        setIsAdmin(doc.role === "admin");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserDoc(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userDoc,
        isAdmin,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signInWithGoogle: handleSignInWithGoogle,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
