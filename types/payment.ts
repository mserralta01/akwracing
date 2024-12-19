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

export interface PaymentToken {
  id: string;
  customerId: string;
  object: string;
  card: {
    last4: string;
    exp_month: string;
    exp_year: string;
    brand?: string;
  };
  client_ip: string;
  created: number;
  livemode: boolean;
  type: string;
  used: boolean;
}

export interface PaymentDetails {
  // Card payment fields
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
  
  // Payment fields (optional during tokenization, required during payment processing)
  amount?: number;
  currency?: string;
  paymentStatus?: PaymentStatus;
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
