export type StudentProfile = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  // Additional student-specific fields
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInformation?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    notes: string;
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
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  // Billing information will be handled by NMI
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