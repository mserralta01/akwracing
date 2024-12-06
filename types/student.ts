export type StudentProfile = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  experience?: {
    yearsOfExperience: number;
    previousCourses: string[];
    skillLevel: "Beginner" | "Intermediate" | "Advanced";
  };
};

export type ParentProfile = {
  id: string;
  userId: string; // Firebase Auth User ID
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
  updatedAt: string;
  students: string[]; // Array of student IDs
};

export type EnrollmentStatus = 
  | "pending_registration" 
  | "pending_payment" 
  | "payment_failed"
  | "confirmed"
  | "cancelled"
  | "completed";

export type PaymentStatus = 
  | "pending" 
  | "completed" 
  | "failed" 
  | "refunded";

export type PaymentDetails = {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

export type Enrollment = {
  id: string;
  courseId: string;
  studentId: string;
  parentId: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
  paymentDetails: {
    amount: number;
    currency: string;
    paymentId?: string;
    paymentStatus: PaymentStatus;
    paymentMethod?: string;
    transactionId?: string;
    errorMessage?: string;
  };
  // For CRM tracking
  leadSource?: string;
  notes?: string[];
  communicationHistory?: {
    id: string;
    type: "email" | "phone" | "sms" | "other";
    timestamp: string;
    content: string;
    direction: "inbound" | "outbound";
  }[];
}; 