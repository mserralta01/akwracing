import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

export type Role = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTION_NAME = "roles";

export const roleService = {
  async getRoles(): Promise<Role[]> {
    try {
      const rolesQuery = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(rolesQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Role[];
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw new Error("Failed to fetch roles");
    }
  },

  async createRole(name: string): Promise<void> {
    try {
      const now = new Date();
      const roleData = {
        name,
        createdAt: now,
        updatedAt: now,
      };
      
      await addDoc(collection(db, COLLECTION_NAME), roleData);
    } catch (error) {
      console.error("Error creating role:", error);
      throw new Error("Failed to create role");
    }
  },

  async updateRole(id: string, name: string): Promise<void> {
    try {
      const roleRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(roleRef, {
        name,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating role:", error);
      throw new Error("Failed to update role");
    }
  },

  async deleteRole(id: string): Promise<void> {
    try {
      const roleRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(roleRef);
    } catch (error) {
      console.error("Error deleting role:", error);
      throw new Error("Failed to delete role");
    }
  },
}; 