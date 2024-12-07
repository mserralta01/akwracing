import { EquipmentRequirement } from "./equipment";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type PreloadedFile = {
  preview: string;
  name: string;
  size: number;
  type: string;
};

export type CourseFormData = {
  title: string;
  shortDescription: string;
  longDescription: string;
  level: CourseLevel;
  price: number;
  duration: number;
  startDate: string;
  endDate: string;
  maxStudents: number;
  availableSpots: number;
  imageUrl: string | null;
  instructorId?: string;
  location: string;
  featured: boolean;
  equipmentRequirements?: EquipmentRequirement[];
};

export type Course = CourseFormData & {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

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
  to: Date | undefined;
};
