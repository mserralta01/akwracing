export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  status: string;
  createdAt: number | string;
} 