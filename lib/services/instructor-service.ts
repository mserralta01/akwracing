import { 
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  QueryConstraint,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Instructor } from '@/types/instructor';

const INSTRUCTORS_COLLECTION = 'instructors';

const convertTimestampsToDates = (data: any) => {
  const converted = { ...data };
  if (converted.createdAt instanceof Timestamp) {
    converted.createdAt = converted.createdAt.toDate().toISOString();
  }
  if (converted.updatedAt instanceof Timestamp) {
    converted.updatedAt = converted.updatedAt.toDate().toISOString();
  }
  return converted;
};

export const instructorService = {
  async getInstructors() {
    try {
      const queryConstraints: QueryConstraint[] = [];
      const q = query(collection(db, INSTRUCTORS_COLLECTION), ...queryConstraints);
      const snapshot = await getDocs(q);
      
      const instructors = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data())
      })) as Instructor[];

      return { instructors };
    } catch (error) {
      console.error('Error fetching instructors:', error);
      return { instructors: [] };
    }
  },

  async getInstructor(id: string): Promise<Instructor | null> {
    try {
      const instructorRef = doc(db, INSTRUCTORS_COLLECTION, id);
      const instructorSnap = await getDoc(instructorRef);

      if (!instructorSnap.exists()) {
        return null;
      }

      return {
        id: instructorSnap.id,
        ...convertTimestampsToDates(instructorSnap.data())
      } as Instructor;
    } catch (error) {
      console.error('Error fetching instructor:', error);
      return null;
    }
  },

  async createInstructor(data: Omit<Instructor, 'id' | 'createdAt' | 'updatedAt'>, imageFile: File | null = null): Promise<Instructor> {
    try {
      let imageUrl = '';
      if (imageFile) {
        const storageRef = ref(storage, `instructors/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const instructorData = {
        ...data,
        imageUrl,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, INSTRUCTORS_COLLECTION), instructorData);
      return {
        id: docRef.id,
        ...convertTimestampsToDates(instructorData)
      } as Instructor;
    } catch (error) {
      console.error('Error creating instructor:', error);
      throw error;
    }
  },

  async updateInstructor(id: string, data: Partial<Omit<Instructor, 'id' | 'createdAt' | 'updatedAt'>>, imageFile: File | null = null): Promise<void> {
    try {
      const instructorRef = doc(db, INSTRUCTORS_COLLECTION, id);
      const instructorSnap = await getDoc(instructorRef);

      if (!instructorSnap.exists()) {
        throw new Error('Instructor not found');
      }

      let imageUrl = data.imageUrl;
      if (imageFile) {
        // Delete old image if it exists
        if (instructorSnap.data().imageUrl) {
          const oldImageRef = ref(storage, instructorSnap.data().imageUrl);
          await deleteObject(oldImageRef).catch(console.error);
        }

        // Upload new image
        const storageRef = ref(storage, `instructors/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const updateData = {
        ...data,
        imageUrl,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(instructorRef, updateData);
    } catch (error) {
      console.error('Error updating instructor:', error);
      throw error;
    }
  },

  async deleteInstructor(id: string): Promise<void> {
    try {
      const instructorRef = doc(db, INSTRUCTORS_COLLECTION, id);
      const instructorSnap = await getDoc(instructorRef);

      if (instructorSnap.exists() && instructorSnap.data().imageUrl) {
        const imageRef = ref(storage, instructorSnap.data().imageUrl);
        await deleteObject(imageRef).catch(console.error);
      }

      await deleteDoc(instructorRef);
    } catch (error) {
      console.error('Error deleting instructor:', error);
      throw error;
    }
  }
}; 