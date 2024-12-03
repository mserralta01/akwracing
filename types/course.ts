import { EquipmentRequirement } from "./equipment";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type Course = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  description: string;
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
  equipmentRequirements: EquipmentRequirement[];
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
