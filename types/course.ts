export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type Course = {
  id: string;
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
  featured: boolean;
  imageUrl: string | null;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
};

export type CourseFormData = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>;

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
