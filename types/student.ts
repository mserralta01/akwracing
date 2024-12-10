import { Timestamp } from 'firebase/firestore';
import { Course } from './course';

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  racingExperience?: string;
  medicalConditions?: string;
  parentGuardianName?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  paymentDetails: {
    amount: number;
    currency: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
  };
  payment?: Payment;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  student?: StudentProfile;
  courseDetails?: Course;
}

export interface EnrollmentWithRelations extends Enrollment {
  student: StudentProfile;
  courseDetails: Course;
}

export interface BaseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  paymentDetails: {
    amount: number;
    currency: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
  };
  payment?: Payment;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  student?: StudentProfile;
  courseDetails?: Course;
}

export type EnrollmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Payment {
  id: string;
  enrollmentId: string;
  amount: number;
  currency: string;
  paymentMethod: {
    type: string;
    last4: string;
  };
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    courseId?: string;
    courseName?: string;
  };
}

export interface PaymentToken {
  id: string;
  object: string;
  card: {
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
  };
  client_ip: string;
  created: number;
  livemode: boolean;
  type: string;
  used: boolean;
} 