import { StudentProfile } from "./student";
import { CourseFormData } from "./course";
import { Payment, PaymentStatus } from "./payment";

export type EnrollmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface EnrollmentPayment {
  amount: number;
  currency: string;
  status: string;
  transactionId?: string;
}

export interface BaseEnrollment {
  id: string;
  studentId: string;
  parentId: string;
  courseId: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
  student?: StudentProfile;
  courseDetails?: CourseFormData & {
    status: "draft" | "published" | "archived";
    instructorId: string;
    availableSpots: number;
    imageUrl: string;
    location: string;
    featured: boolean;
  };
  paymentDetails: {
    amount: number;
    currency: string;
    paymentStatus: PaymentStatus;
  };
  payment?: Payment | EnrollmentPayment;
  notes: string[];
  communicationHistory: any[];
}

export interface EnrollmentWithRelations extends Omit<BaseEnrollment, 'student'> {
  student?: StudentProfile & {
    id: string;
    name: string;
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    parentId: string;
    createdAt: string;
    updatedAt: string;
  };
  courseDetails?: CourseFormData & {
    id: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    startDate?: string;
    endDate?: string;
    prerequisites?: string[];
    objectives?: string[];
    status: "draft" | "published" | "archived";
    instructorId: string;
    availableSpots: number;
    imageUrl: string;
    location: string;
    featured: boolean;
  };
  paymentDetails: {
    amount: number;
    currency: string;
    paymentStatus: PaymentStatus;
  };
  payment?: Payment | EnrollmentPayment;
} 