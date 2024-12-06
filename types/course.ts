import { EquipmentRequirement } from "./equipment";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type Course = {
  id: string;
  slug: string;
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
  imageUrl?: string;
  instructorId?: string;
  location: string;
  featured: boolean;
  equipmentRequirements: {
    provided: string[];
    required: string[];
  };
  createdAt: Date;
  updatedAt: Date;
};

export type CourseFormData = Omit<Course, 'id' | 'slug' | 'createdAt' | 'updatedAt'>;

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
