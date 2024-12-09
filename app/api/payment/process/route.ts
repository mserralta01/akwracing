import { NextResponse } from 'next/server';
import { studentService } from '@/lib/services/student-service';
import { Enrollment, PaymentDetails } from '@/types/student';
import { Course } from '@/types/course';

interface PaymentRequestBody {
  enrollment: Enrollment;
  course: Course;
  paymentDetails: PaymentDetails;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as PaymentRequestBody;
    const { enrollment, course, paymentDetails } = body;

    // Validate required fields
    if (!enrollment?.id || !course?.id || !paymentDetails) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          details: 'Please provide all required payment information'
        },
        { status: 400 }
      );
    }

    // Validate payment details
    if (!paymentDetails.cardNumber || !paymentDetails.expiryMonth || 
        !paymentDetails.expiryYear || !paymentDetails.cvv) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payment details',
          details: 'Please provide valid card information'
        },
        { status: 400 }
      );
    }

    // Process payment with your payment provider here
    // This is a mock implementation
    const isPaymentSuccessful = true;
    const mockTransactionId = `TR${Date.now()}`;

    if (isPaymentSuccessful) {
      // Update enrollment with payment success
      await studentService.updateEnrollment(enrollment.id, {
        status: 'confirmed',
        paymentDetails: {
          amount: course.price,
          currency: 'USD',
          paymentStatus: 'completed'
        },
        payment: {
          amount: course.price,
          currency: 'USD',
          status: 'completed',
          transactionId: mockTransactionId
        },
        student: {
          name: enrollment.student?.name || 'Unknown Student',
          email: enrollment.student?.email || '',
          phone: enrollment.student?.phone || '',
        }
      });

      return NextResponse.json({
        success: true,
        transactionId: mockTransactionId
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment processing failed',
          details: 'The payment could not be processed. Please try again or use a different payment method.'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: 'An unexpected error occurred. Please try again later.'
      },
      { status: 500 }
    );
  }
} 