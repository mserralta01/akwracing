"use client";

import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from 'react';
import { auth, googleAuthProvider, db } from '@/lib/firebase';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserSettings } from '@/types/user';

export interface User extends FirebaseUser {
  settings?: UserSettings;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const settings = userDoc.exists()
          ? (userDoc.data().settings as UserSettings)
          : undefined;
        const userWithSettings: User = {
          ...firebaseUser,
          settings,
        };
        setUser(userWithSettings);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      const { user: createdUser } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", createdUser.uid), {
        email: createdUser.email,
        role: "user",
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const value = { user, loading, error, signInWithGoogle, signOut, signIn, signUp };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
