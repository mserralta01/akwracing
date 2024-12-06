import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Course } from "@/types/course";
import { slugify } from "@/lib/utils";

const COLLECTION_NAME = "courses";

const convertTimestampsToDates = (data: DocumentData) => {
  const result = { ...data };
  const timestampFields = ['createdAt', 'updatedAt', 'startDate', 'endDate'];
  
  for (const field of timestampFields) {
    if (result[field]) {
      if (result[field] instanceof Timestamp) {
        result[field] = result[field].toDate().toISOString();
      } else if (typeof result[field].toDate === 'function') {
        result[field] = result[field].toDate().toISOString();
      } else if (result[field] instanceof Date) {
        result[field] = result[field].toISOString();
      } else if (typeof result[field] === 'string' && !isNaN(Date.parse(result[field]))) {
        result[field] = new Date(result[field]).toISOString();
      }
    }
  }
  return result;
};

export const courseService = {
  async getCourse(id: string): Promise<Course | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...convertTimestampsToDates(docSnap.data())
      } as Course;
    } catch (error) {
      console.error("Error fetching course:", error);
      return null;
    }
  },

  async getCourses(filters?: {
    level?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ courses: Course[] }> {
    let courseQuery = query(collection(db, COLLECTION_NAME));

    if (filters?.level) {
      courseQuery = query(courseQuery, where("level", "==", filters.level));
    }

    if (filters?.startDate) {
      courseQuery = query(
        courseQuery,
        where("startDate", ">=", filters.startDate.toISOString())
      );
    }

    if (filters?.endDate) {
      courseQuery = query(
        courseQuery,
        where("endDate", "<=", filters.endDate.toISOString())
      );
    }

    const snapshot = await getDocs(courseQuery);
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestampsToDates(doc.data()),
    })) as Course[];

    return { courses };
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    const courseQuery = query(
      collection(db, COLLECTION_NAME),
      where("slug", "==", slug)
    );
    const snapshot = await getDocs(courseQuery);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...convertTimestampsToDates(doc.data()),
    } as Course;
  },

  async createCourse(
    course: Omit<Course, "id" | "slug" | "createdAt" | "updatedAt">,
    imageFile?: File
  ): Promise<Course> {
    let imageUrl: string | undefined;

    if (imageFile) {
      const storageRef = ref(storage, `courses/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const slug = slugify(course.title);
    const now = serverTimestamp();
    const courseData = {
      ...course,
      slug,
      imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), courseData);
    const createdCourse = await getDoc(docRef);

    return {
      id: docRef.id,
      ...convertTimestampsToDates(createdCourse.data() || courseData),
    } as Course;
  },

  async updateCourse(
    id: string,
    course: Partial<Omit<Course, "id" | "slug" | "createdAt" | "updatedAt">>,
    imageFile?: File
  ): Promise<void> {
    let imageUrl: string | undefined;

    if (imageFile) {
      const storageRef = ref(storage, `courses/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...course,
      ...(imageUrl && { imageUrl }),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);
  },

  async deleteCourse(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
