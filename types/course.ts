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
}

export interface CourseFormData extends Omit<Course, 'id' | 'createdAt' | 'updatedAt'> {
  startDate: string;
  endDate: string;
  imageUrl?: string; // Optional for creation, required for updates
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
