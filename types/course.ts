import { EquipmentRequirement } from "./equipment";

export type PreloadedFile = {
  preview: string;
  name: string;
  size: number;
  type: string;
};

export type CourseFormData = {
  title: string;
  description: string;
  content: string;
  price: number;
  startDate: string;
  endDate: string;
};

export interface Course {
  id: string;
  title: string;
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
}

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
