import { useState, useEffect, useContext } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '@/contexts/auth-context';
import { UserSettings } from '@/types/user';

export interface User extends FirebaseUser {
  settings?: UserSettings;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const { user, loading, error, signInWithGoogle, signOut } = context;

  const [authUser, setAuthUser] = useState<User | null>(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const settings = userDoc.exists() ? (userDoc.data().settings as UserSettings) : undefined;
        const userWithSettings: User = {
          ...firebaseUser,
          settings,
        };
        setAuthUser(userWithSettings);
      } else {
        setAuthUser(null);
      }
    });

    return () => unsubscribe();
  }, [user, loading, error, signInWithGoogle, signOut]);

  return {
    user: authUser,
    loading,
    error,
    signInWithGoogle,
    signOut,
  };
} 