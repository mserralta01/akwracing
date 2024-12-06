import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "firebase/auth";

export type UserRole = "admin" | "instructor" | "parent" | "student";

export type UserDocument = {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
};

export const userService = {
  async createUserDocument(user: User, role: UserRole = "parent"): Promise<UserDocument> {
    const userRef = doc(db, "users", user.uid);
    const now = new Date().toISOString();
    
    const userData: UserDocument = {
      id: user.uid,
      email: user.email!,
      role,
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(userRef, userData);
    return userData;
  },

  async getUserDocument(userId: string): Promise<UserDocument | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return null;
      }

      return {
        id: userSnap.id,
        ...userSnap.data(),
      } as UserDocument;
    } catch (error) {
      console.error("Error fetching user document:", error);
      return null;
    }
  },

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        role,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  },

  async isAdmin(userId: string): Promise<boolean> {
    try {
      const userDoc = await this.getUserDocument(userId);
      return userDoc?.role === "admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  },
}; 