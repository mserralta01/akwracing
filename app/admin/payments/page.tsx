'use client';

import { DataTable } from '@/components/ui/data-table';
import { courseService } from '@/lib/services/course-service';
import { studentService } from '@/lib/services/student-service';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Payment } from '@/types/payment';
import { StudentProfile } from '@/types/student';
import { Course } from '@/types/course';
import { useEffect, useState } from 'react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const paymentsQuery = query(
          collection(db, 'payments'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(paymentsQuery);
        const payments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Payment[];

        // Get unique IDs using Array.from to fix Set iteration
        const studentIds = Array.from(new Set(payments.map(p => p.studentId)));
        const courseIds = Array.from(new Set(payments.map(p => p.courseId)));

        // Fetch related data
        const [students, courses] = await Promise.all([
          studentService.getStudentsByIds(studentIds),
          courseService.getCoursesByIds(courseIds)
        ]);

        // Enhance payment data with related information
        const enhancedPayments = payments.map(payment => ({
          ...payment,
          student: getStudentFullName(students[payment.studentId]) || 'Deleted Student',
          course: courses[payment.courseId]?.title || 'Deleted Course',
          amount: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(payment.amount),
          date: new Date(payment.createdAt).toLocaleDateString()
        }));

        setPayments(enhancedPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }
    }

    fetchPayments();
  }, []);

  // Helper function to get student's full name
  function getStudentFullName(student: StudentProfile | undefined): string {
    if (!student) return '';
    return `${student.firstName} ${student.lastName}`;
  }

  const columns = [
    {
      accessorKey: 'student',
      header: 'Student'
    },
    {
      accessorKey: 'course',
      header: 'Course'
    },
    {
      accessorKey: 'amount',
      header: 'Amount'
    },
    {
      accessorKey: 'status',
      header: 'Status'
    },
    {
      accessorKey: 'date',
      header: 'Date'
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <DataTable columns={columns} data={payments} />
    </div>
  );
} 