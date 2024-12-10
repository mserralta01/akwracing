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
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { Enrollment as StudentEnrollment } from '@/types/student'

interface StudentData {
  name: string;
  email: string;
  phone: string;
}

interface CourseData {
  title: string;
  [key: string]: any;
}

export type Enrollment = StudentEnrollment

export class EnrollmentService {
  private collectionName = 'enrollments'

  private async fetchStudentData(studentId: string, enrollmentData?: any): Promise<StudentData> {
    const defaultStudent: StudentData = { 
      name: 'Unknown Student', 
      email: '', 
      phone: '' 
    }

    try {
      if (!studentId) {
        console.warn('No studentId provided');
        return defaultStudent;
      }

      // Try fetching directly from students collection first
      const studentRef = doc(db, 'students', studentId);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        const data = studentSnap.data();
        console.log('Found student data:', data);
        
        // Handle the actual data structure from Firestore
        return {
          name: data.firstName && data.lastName 
            ? `${data.firstName} ${data.lastName}`.trim()
            : defaultStudent.name,
          email: data.email || defaultStudent.email,
          phone: data.phone || defaultStudent.phone,
        };
      }

      // If not found in students collection, check embedded data
      if (enrollmentData?.student) {
        const studentInfo = enrollmentData.student;
        console.log('Using embedded student data:', studentInfo);
        return {
          name: studentInfo.name || defaultStudent.name,
          email: studentInfo.email || defaultStudent.email,
          phone: studentInfo.phone || defaultStudent.phone,
        };
      }

      // Finally try users collection as last resort
      const userRef = doc(db, 'users', studentId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        console.log('Found user data:', data);
        return {
          name: data.displayName || 
                (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}`.trim() : defaultStudent.name),
          email: data.email || defaultStudent.email,
          phone: data.phone || data.phoneNumber || defaultStudent.phone,
        };
      }

      console.warn('Student not found:', { studentId });
      return defaultStudent;

    } catch (error) {
      console.error('Error fetching student data:', error);
      return defaultStudent;
    }
  }

  private async fetchCourseData(courseId: string): Promise<CourseData | null> {
    if (!courseId) return null;

    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (!courseSnap.exists()) return null;

    return courseSnap.data() as CourseData;
  }

  async getAllEnrollments(): Promise<Enrollment[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      
      const enrollments = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          console.log('Processing enrollment:', doc.id, data);
          
          const studentData = await this.fetchStudentData(data.studentId, data);
          const courseData = await this.fetchCourseData(data.courseId);

          return {
            id: doc.id,
            studentId: data.studentId,
            parentId: data.parentId,
            courseId: data.courseId,
            status: data.status,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            paymentDetails: data.paymentDetails,
            notes: data.notes || [],
            communicationHistory: data.communicationHistory || [],
            student: studentData,
            course: courseData || { title: 'Unknown Course' },
            payment: data.payment,
          } as Enrollment;
        })
      );

      return enrollments;
    } catch (error) {
      console.error('Error in getAllEnrollments:', error);
      throw error;
    }
  }

  async getEnrollmentById(id: string): Promise<Enrollment | null> {
    const docRef = doc(db, this.collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return null
    }
    
    const data = docSnap.data()
    const studentData = await this.fetchStudentData(data.studentId)
    const courseData = await this.fetchCourseData(data.courseId)

    return {
      id: docSnap.id,
      studentId: data.studentId,
      parentId: data.parentId,
      courseId: data.courseId,
      status: data.status,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      paymentDetails: data.paymentDetails,
      notes: data.notes || [],
      communicationHistory: data.communicationHistory || [],
      student: studentData,
      course: courseData || { title: 'Unknown Course' },
      payment: data.payment,
    } as Enrollment
  }

  async getEnrollmentsByUserId(userId: string): Promise<Enrollment[]> {
    const q = query(
      collection(db, this.collectionName),
      where('studentId', '==', userId)
    )
    const querySnapshot = await getDocs(q)
    const enrollments = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data()
        const studentData = await this.fetchStudentData(data.studentId)
        const courseData = await this.fetchCourseData(data.courseId)

        return {
          id: doc.id,
          studentId: data.studentId,
          parentId: data.parentId,
          courseId: data.courseId,
          status: data.status,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          paymentDetails: data.paymentDetails,
          notes: data.notes || [],
          communicationHistory: data.communicationHistory || [],
          student: studentData,
          course: courseData || { title: 'Unknown Course' },
          payment: data.payment,
        } as Enrollment
      })
    )
    return enrollments
  }

  async createEnrollment(enrollment: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now()
    const enrollmentData = {
      ...enrollment,
      createdAt: now,
      updatedAt: now,
    }
    const docRef = await addDoc(collection(db, this.collectionName), enrollmentData)
    return docRef.id
  }

  async updateEnrollment(id: string, data: Partial<Omit<Enrollment, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    } as DocumentData)
  }

  async deleteEnrollment(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }

  async processRefund(enrollmentId: string): Promise<void> {
    try {
      const enrollmentRef = doc(db, "enrollments", enrollmentId);
      const enrollmentDoc = await getDoc(enrollmentRef);

      if (!enrollmentDoc.exists()) {
        throw new Error("Enrollment not found");
      }

      const enrollmentData = enrollmentDoc.data();
      
      if (enrollmentData.payment?.status !== "completed") {
        throw new Error("Only completed payments can be refunded");
      }

      // Update the payment status and add refund information
      await updateDoc(enrollmentRef, {
        "payment.status": "refunded",
        "payment.refundedAt": serverTimestamp(),
        "payment.refundId": `ref_${Date.now()}`, // You might want to generate this differently
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error processing refund:", error);
      throw error;
    }
  }
}

export const enrollmentService = new EnrollmentService() 