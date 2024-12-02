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
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { Course, CourseFormData, CourseLevel } from '@/types/course';
import { generateCourseSlug } from '@/lib/utils/slug'

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

interface CourseData extends DocumentData {
  title: string;
  location: string;
  slug?: string;
  imageUrl?: string;
  shortDescription?: string;
  longDescription?: string;
  price: number;
  duration: number;
  level: CourseLevel;
  startDate: string;
  endDate: string;
  availableSpots: number;
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  instructorId: string;
}

// Add this helper function at the top with other helpers
const convertTimestampsToDates = (data: any) => {
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

      const slug = generateCourseSlug(courseData.title, courseData.location);
      
      // Check if slug exists
      const existingCourse = await this.getCourseBySlug(slug);
      
      // If exists, add unique identifier
      const finalSlug = existingCourse 
        ? generateCourseSlug(courseData.title, courseData.location, crypto.randomUUID())
        : slug;

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
        slug: finalSlug,
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

  async updateCourse(courseName: string, courseData: Partial<CourseFormData>, imageFile: File | null = null): Promise<{ success: boolean; error?: CourseError }> {
    try {
      const course = await this.getCourseBySlug(courseName);
      if (!course) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Course not found',
          },
        };
      }

      if (!auth.currentUser) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to update a course',
          },
        };
      }

      const courseRef = doc(db, COURSES_COLLECTION, course.id);
      const updateData = { ...courseData, updatedAt: Timestamp.now() };

      if (imageFile) {
        const oldCourse = await getDoc(courseRef);
        if (oldCourse.exists() && oldCourse.data().imageUrl) {
          const oldImageRef = ref(storage, oldCourse.data().imageUrl);
          await deleteObject(oldImageRef).catch(console.error);
        }

        updateData.imageUrl = await handleImageUpload(imageFile, auth.currentUser.uid);
      }

      await updateDoc(courseRef, updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating course:', error);
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to update course',
          details: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      };
    }
  },

  async deleteCourse(courseName: string): Promise<void> {
    try {
      const courseData = await this.getCourseBySlug(courseName);
      if (!courseData) return;
      
      const courseRef = doc(db, COURSES_COLLECTION, courseData.id);
      const courseDoc = await getDoc(courseRef);

      if (courseDoc.exists() && courseDoc.data().imageUrl) {
        const imageRef = ref(storage, courseDoc.data().imageUrl);
        await deleteObject(imageRef).catch(console.error);
      }

      await deleteDoc(courseRef);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  async getCourse(identifier: string): Promise<Course | null> {
    try {
      // First try to get by ID
      const courseRef = doc(db, COURSES_COLLECTION, identifier);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        const data = courseSnap.data() as CourseData;
        // Ensure slug exists
        if (!data.slug) {
          data.slug = generateCourseSlug(data.title, data.location, courseSnap.id);
        }
        return {
          id: courseSnap.id,
          ...convertTimestampsToDates(data)
        } as Course;
      }

      // If not found by ID, try to get by slug
      const q = query(collection(db, COURSES_COLLECTION), where('slug', '==', identifier));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data() as CourseData;
      // Ensure slug exists
      if (!data.slug) {
        data.slug = generateCourseSlug(data.title, data.location, docSnap.id);
      }
      return {
        id: docSnap.id,
        ...convertTimestampsToDates(data)
      } as Course;
    } catch (error) {
      console.error('Error getting course:', error);
      return null;
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
      
      const courses = snapshot.docs.map(doc => {
        const data = doc.data() as CourseData;
        // If slug doesn't exist, generate it
        if (!data.slug) {
          data.slug = generateCourseSlug(data.title, data.location, doc.id);
        }
        return {
          id: doc.id,
          ...convertTimestampsToDates(data),
          shortDescription: data.shortDescription ? stripHtmlTags(data.shortDescription) : '',
        } as Course;
      });

      return { courses };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  async registerForCourse(courseName: string, userId: string, userDetails: { name: string; email: string; phone?: string; }): Promise<string> {
    try {
      const course = await this.getCourseBySlug(courseName);
      if (!course) throw new Error('Course not found');

      const registrationData = {
        courseName,
        userId,
        userDetails,
        status: 'pending',
        paymentStatus: 'pending',
        registrationDate: Timestamp.now(),
      };
      
      const registrationRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), registrationData);

      // Update available spots
      const courseRef = doc(db, COURSES_COLLECTION, course.id);
      await updateDoc(courseRef, {
        availableSpots: increment(-1),
      });

      return registrationRef.id;
    } catch (error) {
      console.error('Error registering for course:', error);
      throw error;
    }
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    try {
      const q = query(collection(db, COURSES_COLLECTION), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Course;
    } catch (error) {
      console.error('Error getting course by slug:', error);
      return null;
    }
  },
};

export const { getCourseBySlug } = courseService;
