import { 
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  CollectionReference,
  Query,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Instructor, InstructorFormData } from '@/types/instructor';

const INSTRUCTORS_COLLECTION = 'instructors';

export const instructorService = {
  async createInstructor(instructorData: InstructorFormData, imageFile: File | null = null): Promise<void> {
    try {
      const instructorRef = doc(collection(db, INSTRUCTORS_COLLECTION));
      const createData: any = {
        ...instructorData,
        id: instructorRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (imageFile) {
        const imageRef = ref(storage, `instructors/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        createData.imageUrl = await getDownloadURL(uploadResult.ref);
      }

      await setDoc(instructorRef, createData);
    } catch (error) {
      console.error('Error creating instructor:', error);
      throw error;
    }
  },

  async getInstructors(filters: { featured?: boolean } = {}): Promise<{ instructors: Instructor[] }> {
    try {
      let q: Query<DocumentData> | CollectionReference<DocumentData> = collection(db, INSTRUCTORS_COLLECTION);
      
      const queryConstraints = [];
      
      if (filters.featured !== undefined) {
        queryConstraints.push(where('featured', '==', filters.featured));
      }
      
      if (queryConstraints.length > 0) {
        q = query(q, ...queryConstraints);
      }

      const snapshot = await getDocs(q);
      const instructors = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Instructor[];

      return { instructors };
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  },

  async getInstructor(id: string): Promise<Instructor> {
    try {
      const docRef = doc(db, INSTRUCTORS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Instructor not found');
      }

      return {
        ...docSnap.data(),
        id: docSnap.id,
      } as Instructor;
    } catch (error) {
      console.error('Error fetching instructor:', error);
      throw error;
    }
  },

  async updateInstructor(id: string, data: Partial<InstructorFormData>, imageFile: File | null = null): Promise<void> {
    try {
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      if (imageFile) {
        const imageRef = ref(storage, `instructors/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        updateData.imageUrl = await getDownloadURL(uploadResult.ref);

        // Delete old image if it exists
        const oldInstructor = await this.getInstructor(id);
        if (oldInstructor.imageUrl) {
          const oldImageRef = ref(storage, oldInstructor.imageUrl);
          await deleteObject(oldImageRef).catch(error => {
            console.warn('Error deleting old image:', error);
          });
        }
      }

      const docRef = doc(db, INSTRUCTORS_COLLECTION, id);
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating instructor:', error);
      throw error;
    }
  },

  async deleteInstructor(id: string): Promise<void> {
    try {
      const instructor = await this.getInstructor(id);
      
      // Delete image if it exists
      if (instructor.imageUrl) {
        const imageRef = ref(storage, instructor.imageUrl);
        await deleteObject(imageRef).catch(error => {
          console.warn('Error deleting image:', error);
        });
      }

      const docRef = doc(db, INSTRUCTORS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting instructor:', error);
      throw error;
    }
  },
}; 