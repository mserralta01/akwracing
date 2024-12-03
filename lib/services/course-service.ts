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
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Course } from "@/types/course";
import { slugify } from "@/lib/utils";

const COLLECTION_NAME = "courses";

export const courseService = {
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
      ...doc.data(),
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
      ...doc.data(),
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
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...course,
      slug,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...course,
      slug,
      imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
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
    await updateDoc(docRef, {
      ...course,
      ...(imageUrl && { imageUrl }),
      updatedAt: serverTimestamp(),
    });
  },

  async deleteCourse(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
