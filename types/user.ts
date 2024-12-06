import { Course } from "./course";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

export type StudentProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  createdAt: string;
  updatedAt: string;
  user?: User;
};

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  course?: Course;
  user?: User;
}; 