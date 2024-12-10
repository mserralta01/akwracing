export type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "processing"
  | "refunded";

export type PaymentMethodType = 'card' | 'bank' | 'unknown';

export interface PaymentMethod {
  type: PaymentMethodType;
  last4?: string;
  tokenId?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethodType | {
    type: string;
    last4: string;
  };
  metadata?: {
    courseId: string;
    courseName: string;
  };
  transactionId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetails {
  // Card payment fields (optional for enrollment)
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  firstName?: string;
  lastName?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  tokenId?: string;
  
  // Enrollment payment fields
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
}

export interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  successRate: number;
}

export interface EnrollmentPayment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
} 