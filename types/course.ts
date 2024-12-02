export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CourseFormData = {
  title: string;
  shortDescription: string;
  longDescription: string;
  location: string;
  price: number;
  duration: number;
  level: CourseLevel;
  startDate: string;
  endDate: string;
  availableSpots: number;
  featured: boolean;
  imageUrl?: string | null;
  instructorId: string;
};

export type Course = CourseFormData & {
  id: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
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
