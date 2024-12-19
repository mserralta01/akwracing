import { EquipmentRequirement } from "./equipment";

export type PreloadedFile = {
  preview: string;
  name: string;
  size: number;
  type: string;
};

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  description: string;
  content: string;
  price: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published" | "archived";
  instructorId: string;
  availableSpots: number;
  imageUrl: string;
  location: string;
  featured: boolean;
  level: CourseLevel;
  duration: number;
  maxStudents: number;
  slug: string;
  equipmentRequirements: EquipmentRequirement[];
}

export type CourseFormData = Omit<Course, "id" | "slug" | "createdAt" | "updatedAt"> & {
  photo?: File;
  imageUrl?: string;
  providedEquipment?: string[];
  requiredEquipment?: string[];
};

export type CourseUpdateData = Partial<Omit<Course, "id" | "slug" | "createdAt" | "updatedAt">> & {
  imageUrl?: string;
};

export type NewCourse = CourseFormData;

export interface Registration {
  id: string;
  courseId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  registrationDate: string;
  userDetails: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface TipTapProps {
  content: string;
  onChange: (content: string) => void;
}

export interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
}

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};
