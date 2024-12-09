import { Enrollment, PaymentDetails } from "@/types/student";
import { Course } from "@/types/course";

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
  details?: string;
}

export const paymentService = {
  async processPayment(
    enrollment: Enrollment,
    course: Course,
    paymentDetails: PaymentDetails
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollment: {
            ...enrollment,
            student: {
              name: enrollment.student?.name || 'Unknown Student',
              email: enrollment.student?.email || '',
              phone: enrollment.student?.phone || '',
            },
          },
          course,
          paymentDetails,
        }),
      });

      const contentType = response.headers.get('content-type');
      let result: PaymentResponse;

      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else {
        const errorText = await response.text();
        console.error('Non-JSON response from payment API:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          body: errorText
        });
        throw new Error('Invalid response from payment system');
      }

      if (!response.ok) {
        console.error('Payment API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: result.error,
          details: result.details
        });

        return {
          success: false,
          error: result.error || `Payment failed with status ${response.status}`,
          details: result.details || 'Please try again or contact support'
        };
      }

      return result;
    } catch (error) {
      console.error('Payment processing error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
        details: 'An unexpected error occurred. Please try again or contact support.'
      };
    }
  },

  async refundPayment(
    transactionId: string,
    amount: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/payment/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          amount,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Refund API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        return {
          success: false,
          error: `Refund failed: ${response.statusText}`
        };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Refund processing error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed'
      };
    }
  }
}; 