import { db } from '@/lib/firebase/config'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentData,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore'
import { Enrollment } from '@/types/user'

export type GetEnrollmentsResult = {
  success: boolean;
  enrollments?: Enrollment[];
  error?: string;
};

export type AddNoteResult = {
  success: boolean;
  error?: string;
};

export class EnrollmentService {
  private collectionName = 'enrollments'

  async getAllEnrollments(): Promise<Enrollment[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Enrollment[]
  }

  async getEnrollmentById(id: string): Promise<Enrollment | null> {
    const docRef = doc(db, this.collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return null
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Enrollment
  }

  async getEnrollmentsByUserId(userId: string): Promise<Enrollment[]> {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Enrollment[]
  }

  async getEnrollmentsForCourse(courseId: string): Promise<GetEnrollmentsResult> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('courseId', '==', courseId)
      )
      const querySnapshot = await getDocs(q)
      const enrollments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Enrollment[]
      return { success: true, enrollments }
    } catch (error) {
      console.error('Error getting enrollments for course:', error)
      return { success: false, error: 'Failed to fetch enrollments' }
    }
  }

  async addNoteToEnrollment(enrollmentId: string, note: string): Promise<AddNoteResult> {
    try {
      const docRef = doc(db, this.collectionName, enrollmentId)
      await updateDoc(docRef, {
        notes: arrayUnion({
          content: note,
          createdAt: Timestamp.now(),
        }),
      })
      return { success: true }
    } catch (error) {
      console.error('Error adding note to enrollment:', error)
      return { success: false, error: 'Failed to add note' }
    }
  }

  async createEnrollment(enrollment: Omit<Enrollment, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), enrollment)
    return docRef.id
  }

  async updateEnrollment(id: string, data: Partial<Enrollment>): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await updateDoc(docRef, data as DocumentData)
  }

  async deleteEnrollment(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }
}

export const enrollmentService = new EnrollmentService() 