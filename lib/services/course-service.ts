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

export const courseService = {
  async createCourse(courseData: CourseFormData, imageFile: File | null = null): Promise<void> {
    try {
      // Check authentication
      if (!auth.currentUser) {
        throw new Error('No authenticated user found');
      }

      // Log current user and authentication state
      console.log('Creating course with auth:', {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        isAuthenticated: !!auth.currentUser
      });

      // First check if user has admin rights through Firestore
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      
      // Log user document data
      console.log('User document:', {
        exists: userDoc.exists(),
        data: userDoc.data()
      });

      if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can create courses');
      }

      const courseRef = doc(collection(db, COURSES_COLLECTION));
      const createData: any = {
        ...courseData,
        id: courseRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (imageFile) {
        try {
          // Validate file size and type
          if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('Image file is too large. Maximum size is 5MB.');
          }

          if (!imageFile.type.startsWith('image/')) {
            throw new Error('Invalid file type. Only images are allowed.');
          }

          console.log('Uploading image:', {
            fileName: imageFile.name,
            fileSize: imageFile.size,
            fileType: imageFile.type
          });

          // Create a clean filename
          const cleanFileName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
          const timestamp = Date.now();
          const imageRef = ref(storage, `courses/${timestamp}_${cleanFileName}`);

          // Upload with metadata
          const metadata = {
            contentType: imageFile.type,
            customMetadata: {
              uploadedBy: auth.currentUser.uid,
              uploadedAt: new Date().toISOString()
            }
          };

          const uploadResult = await uploadBytes(imageRef, imageFile, metadata);
          createData.imageUrl = await getDownloadURL(uploadResult.ref);
          
          console.log('Image upload successful:', {
            downloadUrl: createData.imageUrl,
            path: uploadResult.ref.fullPath
          });
        } catch (uploadError) {
          console.error('Error uploading image:', {
            error: uploadError,
            fileName: imageFile.name,
            fileSize: imageFile.size,
            errorMessage: uploadError instanceof Error ? uploadError.message : 'Unknown error'
          });
          throw new Error(`Failed to upload image: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
      }

      await setDoc(courseRef, createData);
    } catch (error) {
      console.error('Error creating course:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
        userId: auth.currentUser?.uid,
        hasImageFile: !!imageFile
      });
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
