export type EnrollmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  parentId: string;
  allergies?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

export interface ParentProfile {
  id: string;
  userId: string;
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
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetails {
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
  tokenId?: string;
}

export interface PaymentToken {
  id: string;
  customerId: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  tokenType: 'recurring' | 'one-time';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  enrollmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: {
    type: 'card' | 'bank';
    last4: string;
    tokenId?: string;
  };
  transactionId?: string;
  error?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  parentId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentDetails: {
    amount: number;
    currency: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
  };
  payment?: Payment;
  student?: Partial<StudentProfile>;
  notes: string[];
  communicationHistory: {
    type: string;
    message: string;
    timestamp: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
} 