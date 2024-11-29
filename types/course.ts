export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  startDate: string;
  endDate: string;
  duration: number; // in days
  location: string;
  level: CourseLevel;
  availableSpots: number;
  price: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}

export type CourseFormData = {
  title: string;
  shortDescription: string;
  longDescription: string;
  startDate: string;
  endDate: string;
  duration: number;
  location: string;
  level: CourseLevel;
  availableSpots: number;
  price: number;
  imageUrl: string | null;
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
  to: Date | undefined;
};
