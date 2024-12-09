export type EnrollmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  parentId?: string;
  experience?: {
    skillLevel?: string;
    yearsRiding?: number;
    previousTraining?: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInformation?: {
    allergies?: string[];
    conditions?: string[];
    medications?: string[];
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type ParentProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  relationship?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  students: string[];
  createdAt: string;
  updatedAt: string;
};

export type Enrollment = {
  id: string;
  studentId: string;
  parentId: string;
  courseId: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
  paymentDetails: {
    amount: number;
    currency: string;
    paymentStatus: "pending" | "completed" | "failed";
  };
  notes: string[];
  communicationHistory: {
    date: string;
    type: "email" | "phone" | "sms";
    message: string;
  }[];
  student?: {
    name: string;
    email: string;
    phone: string;
  };
  course?: {
    title: string;
    startDate: string;
    endDate: string;
  };
  payment?: {
    amount: number;
    currency: string;
    status: string;
    transactionId?: string;
  };
};

export type PaymentDetails = {
  id?: string;
  status?: string;
  amount?: number;
  method?: string;
  cardNumber?: string;
  expiryMonth?: string | number;
  expiryYear?: string | number;
  cvv?: string;
  firstName?: string;
  lastName?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}; 