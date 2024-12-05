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
} from 'firebase/firestore'

export type Enrollment = {
  id?: string
  userId: string
  courseId: string
  status: 'active' | 'completed' | 'cancelled'
  enrollmentDate: Date
  completionDate?: Date
  progress?: number
  lastAccessedDate?: Date
}

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