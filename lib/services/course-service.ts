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
  limit as firestoreLimit,
  startAfter,
  QueryConstraint,
  Timestamp,
  increment,
  setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Course, CourseFormData, CourseLevel } from '@/types/course';

const COURSES_COLLECTION = 'courses';
const REGISTRATIONS_COLLECTION = 'registrations';

interface CourseFilters {
  level?: CourseLevel;
  location?: string;
  startDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

export const courseService = {
  async createCourse(courseData: CourseFormData, imageFile: File | null = null): Promise<void> {
    try {
      const courseRef = doc(collection(db, COURSES_COLLECTION));
      const createData: any = {
        ...courseData,
        id: courseRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (imageFile) {
        const imageRef = ref(storage, `courses/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        createData.imageUrl = await getDownloadURL(uploadResult.ref);
      }

      await setDoc(courseRef, createData);
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  async updateCourse(courseId: string, courseData: Partial<CourseFormData>, newImageFile?: File): Promise<void> {
    try {
      const courseRef = doc(db, COURSES_COLLECTION, courseId);
      const updateData: any = { ...courseData, updatedAt: Timestamp.now() };

      if (newImageFile) {
        // Delete old image if exists
        const oldCourse = await getDoc(courseRef);
        if (oldCourse.exists() && oldCourse.data().imageUrl) {
          const oldImageRef = ref(storage, oldCourse.data().imageUrl);
          await deleteObject(oldImageRef).catch(console.error);
        }

        // Upload new image
        const imageRef = ref(storage, `courses/${Date.now()}_${newImageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, newImageFile);
        updateData.imageUrl = await getDownloadURL(uploadResult.ref);
      }

      await updateDoc(courseRef, updateData);
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    try {
      const courseRef = doc(db, COURSES_COLLECTION, courseId);
      const course = await getDoc(courseRef);

      if (course.exists() && course.data().imageUrl) {
        const imageRef = ref(storage, course.data().imageUrl);
        await deleteObject(imageRef).catch(console.error);
      }

      await deleteDoc(courseRef);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  async getCourse(courseId: string): Promise<Course | null> {
    try {
      const courseRef = doc(db, COURSES_COLLECTION, courseId);
      const courseSnap = await getDoc(courseRef);

      if (!courseSnap.exists()) return null;

      return {
        id: courseSnap.id,
        ...courseSnap.data(),
      } as Course;
    } catch (error) {
      console.error('Error getting course:', error);
      throw error;
    }
  },

  async getCourses(filters: CourseFilters = {}, orderByField?: string, limit?: number) {
    try {
      const queryConstraints: QueryConstraint[] = [];
      
      // Add filters
      if (filters.featured !== undefined) {
        queryConstraints.push(where('featured', '==', filters.featured));
      }
      // ... other filters

      // Add ordering if specified
      if (orderByField) {
        queryConstraints.push(orderBy(orderByField));
      }

      // Add limit if specified
      if (limit) {
        queryConstraints.push(firestoreLimit(limit));
      }

      const q = query(collection(db, COURSES_COLLECTION), ...queryConstraints);
      const snapshot = await getDocs(q);
      
      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];

      return { courses };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  async registerForCourse(courseId: string, userId: string, userDetails: { name: string; email: string; phone?: string; }): Promise<string> {
    try {
      const registrationRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), {
        courseId,
        userId,
        userDetails,
        status: 'pending',
        paymentStatus: 'pending',
        registrationDate: Timestamp.now(),
      });

      // Update available spots
      const courseRef = doc(db, COURSES_COLLECTION, courseId);
      await updateDoc(courseRef, {
        availableSpots: increment(-1),
      });

      return registrationRef.id;
    } catch (error) {
      console.error('Error registering for course:', error);
      throw error;
    }
  },
};
