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
  limit,
  startAfter,
  QueryConstraint,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Course, CourseFormData } from '@/types/course';

const COURSES_COLLECTION = 'courses';
const REGISTRATIONS_COLLECTION = 'registrations';

export const courseService = {
  async createCourse(courseData: CourseFormData, imageFile: File): Promise<string> {
    try {
      // Upload image first
      const imageRef = ref(storage, `courses/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // Create course document
      const courseRef = await addDoc(collection(db, COURSES_COLLECTION), {
        ...courseData,
        imageUrl,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return courseRef.id;
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

  async getCourses(filters?: {
    level?: string;
    startDate?: Date;
    endDate?: Date;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }, sortBy: string = 'startDate', pageSize: number = 10, lastDoc?: any): Promise<{ courses: Course[]; lastDoc: any }> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters) {
        if (filters.level) {
          constraints.push(where('level', '==', filters.level));
        }
        if (filters.location) {
          constraints.push(where('location', '==', filters.location));
        }
        if (filters.startDate) {
          constraints.push(where('startDate', '>=', filters.startDate));
        }
        if (filters.endDate) {
          constraints.push(where('endDate', '<=', filters.endDate));
        }
        if (filters.minPrice !== undefined) {
          constraints.push(where('price', '>=', filters.minPrice));
        }
        if (filters.maxPrice !== undefined) {
          constraints.push(where('price', '<=', filters.maxPrice));
        }
      }

      constraints.push(orderBy(sortBy));
      constraints.push(limit(pageSize));

      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const q = query(collection(db, COURSES_COLLECTION), ...constraints);
      const querySnapshot = await getDocs(q);

      const courses: Course[] = [];
      querySnapshot.forEach((doc) => {
        courses.push({
          id: doc.id,
          ...doc.data(),
        } as Course);
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        courses,
        lastDoc: lastVisible,
      };
    } catch (error) {
      console.error('Error getting courses:', error);
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
