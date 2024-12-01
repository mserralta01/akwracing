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
  QueryConstraint,
  Timestamp,
  increment,
  setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
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

type CourseError = {
  code: 'UNAUTHORIZED' | 'IMAGE_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  details?: string;
};

// Helper function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  return html?.replace(/<[^>]*>/g, '') ?? '';
};

// Helper function to handle image upload
const handleImageUpload = async (imageFile: File, userId: string): Promise<string> => {
  if (imageFile.size > 5 * 1024 * 1024) {
    throw new Error('Image file is too large. Maximum file size is 5MB');
  }

  if (!imageFile.type.startsWith('image/')) {
    throw new Error('Invalid file type. Only image files are allowed');
  }

  const cleanFileName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const timestamp = Date.now();
  const imageRef = ref(storage, `courses/${timestamp}_${cleanFileName}`);

  const metadata = {
    contentType: imageFile.type,
    customMetadata: {
      uploadedBy: userId,
      uploadedAt: new Date().toISOString()
    }
  };

  const uploadResult = await uploadBytes(imageRef, imageFile, metadata);
  return getDownloadURL(uploadResult.ref);
};

export const courseService = {
  async createCourse(courseData: CourseFormData, imageFile: File | null = null): Promise<{ success: boolean; error?: CourseError }> {
    try {
      if (!auth.currentUser) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to create a course',
          },
        };
      }

      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      
      if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Only administrators can create courses',
          },
        };
      }

      const courseRef = doc(collection(db, COURSES_COLLECTION));
      const createData = {
        ...courseData,
        id: courseRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        startDate: courseData.startDate ? Timestamp.fromDate(new Date(courseData.startDate)) : null,
        endDate: courseData.endDate ? Timestamp.fromDate(new Date(courseData.endDate)) : null,
        availableSpots: Number(courseData.availableSpots),
        price: Number(courseData.price),
        duration: Number(courseData.duration),
        featured: Boolean(courseData.featured),
      };

      if (imageFile) {
        try {
          createData.imageUrl = await handleImageUpload(imageFile, auth.currentUser.uid);
        } catch (uploadError) {
          return {
            success: false,
            error: {
              code: 'IMAGE_ERROR',
              message: 'Failed to upload image',
              details: uploadError instanceof Error ? uploadError.message : 'Unknown error occurred while uploading',
            },
          };
        }
      }

      await setDoc(courseRef, createData);
      return { success: true };

    } catch (error) {
      console.error('Error creating course:', error);
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to create course',
          details: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  },

  async updateCourse(courseId: string, courseData: Partial<CourseFormData>, newImageFile?: File): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('Unauthorized: You must be logged in to update a course');
    }

    try {
      const courseRef = doc(db, COURSES_COLLECTION, courseId);
      const updateData = { ...courseData, updatedAt: Timestamp.now() };

      if (newImageFile) {
        const oldCourse = await getDoc(courseRef);
        if (oldCourse.exists() && oldCourse.data().imageUrl) {
          const oldImageRef = ref(storage, oldCourse.data().imageUrl);
          await deleteObject(oldImageRef).catch(console.error);
        }

        updateData.imageUrl = await handleImageUpload(newImageFile, auth.currentUser.uid);
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
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryConstraints.push(where(key, '==', value));
        }
      });

      if (orderByField) {
        queryConstraints.push(orderBy(orderByField));
      }

      if (limit) {
        queryConstraints.push(firestoreLimit(limit));
      }

      const q = query(collection(db, COURSES_COLLECTION), ...queryConstraints);
      const snapshot = await getDocs(q);
      
      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        shortDescription: doc.data().shortDescription ? stripHtmlTags(doc.data().shortDescription) : '',
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
