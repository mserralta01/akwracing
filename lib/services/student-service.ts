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
  orderBy,
  Timestamp,
  DocumentData,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { StudentProfile, ParentProfile } from '@/types/student';
import { BaseEnrollment, EnrollmentStatus } from '@/types/enrollment';
import { auth } from '../firebase';
import { Course } from '@/types/course';

const STUDENTS_COLLECTION = 'students';
const PARENTS_COLLECTION = 'parents';
const ENROLLMENTS_COLLECTION = 'enrollments';
const COURSES_COLLECTION = 'courses';

const convertTimestampsToDates = (data: DocumentData) => {
  const result = { ...data };
  if (result.createdAt && typeof result.createdAt.toDate === 'function') {
    result.createdAt = result.createdAt.toDate().toISOString();
  }
  if (result.updatedAt && typeof result.updatedAt.toDate === 'function') {
    result.updatedAt = result.updatedAt.toDate().toISOString();
  }
  if (result.startDate && typeof result.startDate.toDate === 'function') {
    result.startDate = result.startDate.toDate().toISOString();
  }
  if (result.endDate && typeof result.endDate.toDate === 'function') {
    result.endDate = result.endDate.toDate().toISOString();
  }
  return result;
};

export const deleteStudent = async (studentId: string): Promise<void> => {
  try {
    const studentRef = doc(db, 'students', studentId);
    await deleteDoc(studentRef);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

export const deleteParent = async (parentId: string): Promise<void> => {
  try {
    const parentRef = doc(db, PARENTS_COLLECTION, parentId);
    await deleteDoc(parentRef);
  } catch (error) {
    console.error('Error deleting parent:', error);
    throw error;
  }
};

export const studentService = {
  // Student Profile Operations
  async createStudent(data: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudentProfile> {
    try {
      const studentData = {
        ...data,
        phone: data.phone || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), studentData);
      
      // Only update parent's students array if parentId exists
      if (data.parentId) {
        const parentRef = doc(db, PARENTS_COLLECTION, data.parentId);
        const parentProfile = await this.getParentProfile(data.parentId);
        if (parentProfile) {
          await updateDoc(parentRef, {
            students: [...(parentProfile.students || []), docRef.id],
          });
        }
      }

      return {
        id: docRef.id,
        ...convertTimestampsToDates(studentData),
      } as StudentProfile;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  async getStudent(id: string): Promise<StudentProfile | null> {
    try {
      const studentRef = doc(db, STUDENTS_COLLECTION, id);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        return null;
      }

      return {
        id: studentSnap.id,
        ...convertTimestampsToDates(studentSnap.data()),
      } as StudentProfile;
    } catch (error) {
      console.error('Error fetching student:', error);
      return null;
    }
  },

  async updateStudent(id: string, data: Partial<Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    try {
      const studentRef = doc(db, STUDENTS_COLLECTION, id);
      await updateDoc(studentRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  // Parent Profile Operations
  async createParentProfile(data: Omit<ParentProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ParentProfile> {
    try {
      const parentData = {
        ...data,
        students: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, PARENTS_COLLECTION), parentData);
      return {
        id: docRef.id,
        ...convertTimestampsToDates(parentData),
      } as ParentProfile;
    } catch (error) {
      console.error('Error creating parent profile:', error);
      throw error;
    }
  },

  async getParentProfile(id: string): Promise<ParentProfile | null> {
    try {
      const parentRef = doc(db, PARENTS_COLLECTION, id);
      const parentSnap = await getDoc(parentRef);

      if (!parentSnap.exists()) {
        return null;
      }

      return {
        id: parentSnap.id,
        ...convertTimestampsToDates(parentSnap.data()),
      } as ParentProfile;
    } catch (error) {
      console.error('Error fetching parent profile:', error);
      return null;
    }
  },

  async getParentByUserId(userId: string): Promise<ParentProfile | null> {
    try {
      const q = query(collection(db, PARENTS_COLLECTION), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...convertTimestampsToDates(doc.data()),
      } as ParentProfile;
    } catch (error) {
      console.error('Error fetching parent by userId:', error);
      return null;
    }
  },

  async updateParentProfile(
    id: string,
    data: Partial<Omit<ParentProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ParentProfile> {
    try {
      const parentRef = doc(db, PARENTS_COLLECTION, id);
      const parentDoc = await getDoc(parentRef);
      
      const now = Timestamp.now();
      const updatedData = {
        ...data,
        updatedAt: now,
      };

      if (!parentDoc.exists()) {
        // If parent document doesn't exist, create it
        await setDoc(parentRef, {
          id,
          ...updatedData,
          createdAt: now,
        });
      } else {
        // If it exists, update it
        await updateDoc(parentRef, updatedData);
      }

      const updatedDoc = await getDoc(parentRef);
      const docData = updatedDoc.data();
      if (!docData) {
        throw new Error('Failed to get updated parent profile data');
      }
      return {
        id: updatedDoc.id,
        ...convertTimestampsToDates(docData),
      } as ParentProfile;
    } catch (error) {
      console.error('Error updating parent profile:', error);
      throw error;
    }
  },

  // Enrollment Operations
  async createEnrollment(data: Omit<BaseEnrollment, 'id' | 'createdAt' | 'updatedAt'>): Promise<BaseEnrollment> {
    try {
      const enrollmentData = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, ENROLLMENTS_COLLECTION), enrollmentData);
      return {
        id: docRef.id,
        ...convertTimestampsToDates(enrollmentData),
      } as BaseEnrollment;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  },

  async getEnrollment(id: string): Promise<BaseEnrollment | null> {
    try {
      const enrollmentRef = doc(db, ENROLLMENTS_COLLECTION, id);
      const enrollmentSnap = await getDoc(enrollmentRef);

      if (!enrollmentSnap.exists()) {
        return null;
      }

      return {
        id: enrollmentSnap.id,
        ...convertTimestampsToDates(enrollmentSnap.data()),
      } as BaseEnrollment;
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      return null;
    }
  },

  async updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<void> {
    try {
      const enrollmentRef = doc(db, ENROLLMENTS_COLLECTION, id);
      await updateDoc(enrollmentRef, {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      throw error;
    }
  },

  async getEnrollmentsByCourse(courseId: string): Promise<BaseEnrollment[]> {
    try {
      const q = query(
        collection(db, ENROLLMENTS_COLLECTION),
        where('courseId', '==', courseId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data()),
      })) as BaseEnrollment[];
    } catch (error) {
      console.error('Error fetching course enrollments:', error);
      return [];
    }
  },

  async getEnrollmentsByParent(parentId: string): Promise<BaseEnrollment[]> {
    try {
      const q = query(
        collection(db, ENROLLMENTS_COLLECTION),
        where('parentId', '==', parentId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data()),
      })) as BaseEnrollment[];
    } catch (error) {
      console.error('Error fetching parent enrollments:', error);
      return [];
    }
  },

  async getEnrollmentsByStudent(studentId: string): Promise<BaseEnrollment[]> {
    try {
      const q = query(
        collection(db, ENROLLMENTS_COLLECTION),
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data()),
      })) as BaseEnrollment[];
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
      return [];
    }
  },

  async addEnrollmentNote(enrollmentId: string, note: string): Promise<void> {
    try {
      const enrollmentRef = doc(db, ENROLLMENTS_COLLECTION, enrollmentId);
      const enrollment = await getDoc(enrollmentRef);
      
      if (!enrollment.exists()) {
        throw new Error('Enrollment not found');
      }

      const currentNotes = enrollment.data().notes || [];
      await updateDoc(enrollmentRef, {
        notes: [...currentNotes, note],
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding enrollment note:', error);
      throw error;
    }
  },

  async addCommunicationRecord(
    enrollmentId: string,
    communication: Omit<NonNullable<BaseEnrollment['communicationHistory']>[0], 'id' | 'timestamp'>
  ): Promise<void> {
    try {
      const enrollmentRef = doc(db, ENROLLMENTS_COLLECTION, enrollmentId);
      const enrollment = await getDoc(enrollmentRef);
      
      if (!enrollment.exists()) {
        throw new Error('Enrollment not found');
      }

      const currentHistory = enrollment.data().communicationHistory || [];
      const newRecord = {
        ...communication,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };

      await updateDoc(enrollmentRef, {
        communicationHistory: [...currentHistory, newRecord],
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding communication record:', error);
      throw error;
    }
  },

  async getAllStudents(): Promise<StudentProfile[]> {
    try {
      const q = query(
        collection(db, STUDENTS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data()),
      })) as StudentProfile[];
    } catch (error) {
      console.error('Error fetching all students:', error);
      return [];
    }
  },

  async getAllParents(): Promise<ParentProfile[]> {
    try {
      const q = query(
        collection(db, PARENTS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data()),
      })) as ParentProfile[];
    } catch (error) {
      console.error('Error fetching all parents:', error);
      return [];
    }
  },

  async getAllEnrollments(): Promise<BaseEnrollment[]> {
    try {
      const q = query(
        collection(db, ENROLLMENTS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data()),
      })) as BaseEnrollment[];
    } catch (error) {
      console.error('Error fetching all enrollments:', error);
      return [];
    }
  },

  async updateEnrollment(
    enrollmentId: string,
    data: Partial<Omit<BaseEnrollment, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const enrollmentRef = doc(db, ENROLLMENTS_COLLECTION, enrollmentId);
      await updateDoc(enrollmentRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating enrollment:', error);
      throw error;
    }
  },

  async createParent(
    data: Omit<ParentProfile, "id" | "createdAt" | "updatedAt" | "userId"> & { userId?: string }
  ): Promise<ParentProfile> {
    try {
      const userId = data.userId || auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User must be authenticated to create a parent profile');
      }

      const parentRef = doc(collection(db, PARENTS_COLLECTION));
      const now = Timestamp.now();
      const parentData: ParentProfile = {
        id: parentRef.id,
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        students: data.students || [],
        createdAt: now.toDate().toISOString(),
        updatedAt: now.toDate().toISOString(),
      };

      await setDoc(parentRef, parentData);
      return parentData;
    } catch (error) {
      console.error('Error creating parent:', error);
      throw error;
    }
  },

  async getParent(parentId: string): Promise<ParentProfile> {
    try {
      const parentRef = doc(db, PARENTS_COLLECTION, parentId);
      const parentDoc = await getDoc(parentRef);
      
      if (!parentDoc.exists()) {
        throw new Error('Parent not found');
      }

      return {
        id: parentDoc.id,
        ...convertTimestampsToDates(parentDoc.data()),
      } as ParentProfile;
    } catch (error) {
      console.error('Error fetching parent:', error);
      throw error;
    }
  },

  async getCourse(courseId: string): Promise<Course | null> {
    try {
      const courseRef = doc(db, COURSES_COLLECTION, courseId);
      const courseSnap = await getDoc(courseRef);
      
      if (!courseSnap.exists()) {
        return null;
      }

      return {
        id: courseSnap.id,
        ...convertTimestampsToDates(courseSnap.data()),
      } as Course;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  },

  deleteStudent,
  deleteParent,

  async getStudentById(studentId: string): Promise<StudentProfile | null> {
    try {
      const studentDoc = await getDoc(doc(db, 'students', studentId));
      if (!studentDoc.exists()) {
        return null;
      }
      return { id: studentDoc.id, ...studentDoc.data() } as StudentProfile;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  async getStudentsByIds(studentIds: string[]): Promise<Record<string, StudentProfile>> {
    try {
      const students: Record<string, StudentProfile> = {};
      const chunks = [];
      
      // Firebase has a limit of 10 items in 'in' queries, so we chunk the requests
      for (let i = 0; i < studentIds.length; i += 10) {
        chunks.push(studentIds.slice(i, i + 10));
      }

      for (const chunk of chunks) {
        const q = query(
          collection(db, 'students'),
          where('__name__', 'in', chunk)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          students[doc.id] = { id: doc.id, ...doc.data() } as StudentProfile;
        });
      }

      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }
};
