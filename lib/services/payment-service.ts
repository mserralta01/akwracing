import { Enrollment } from "@/types/student";
import { Course } from "@/types/course";

interface PaymentDetails {
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
    country: string;
  };
}

interface NMIResponse {
  response: string;
  responsetext: string;
  authcode: string;
  transactionid: string;
  avsresponse: string;
  cvvresponse: string;
  orderid: string;
  type: string;
  response_code: string;
}

export const paymentService = {
  async processPayment(
    enrollment: Enrollment,
    course: Course,
    paymentDetails: PaymentDetails
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollment,
          course,
          paymentDetails,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        return {
          success: false,
          error: `Payment API error: ${response.status} ${response.statusText}`
        };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Payment processing error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  },

  async refundPayment(
    transactionId: string,
    amount: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const nmiApiKey = process.env.NEXT_PUBLIC_NMI_API_KEY;
      const nmiUsername = process.env.NEXT_PUBLIC_NMI_USERNAME;
      const nmiPassword = process.env.NEXT_PUBLIC_NMI_PASSWORD;

      if (!nmiApiKey || !nmiUsername || !nmiPassword) {
        throw new Error('NMI credentials not configured');
      }

      // Construct the refund request
      const requestData: Record<string, string> = {
        security_key: nmiApiKey,
        type: 'refund',
        transactionid: transactionId,
        amount: amount.toString(),
      };

      // Make the API request to NMI
      const response = await fetch(process.env.NEXT_PUBLIC_NMI_API_URL || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${nmiUsername}:${nmiPassword}`).toString('base64')}`,
        },
        body: new URLSearchParams(requestData).toString(),
      });

      if (!response.ok) {
        throw new Error('Payment gateway error');
      }

      const result = await response.json() as NMIResponse;

      if (result.response === '1') {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.responsetext,
        };
      }
    } catch (error) {
      console.error('Refund processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed',
      };
    }
  },

  async getTransactionStatus(
    transactionId: string
  ): Promise<{ success: boolean; status?: string; error?: string }> {
    try {
      const nmiApiKey = process.env.NEXT_PUBLIC_NMI_API_KEY;
      const nmiUsername = process.env.NEXT_PUBLIC_NMI_USERNAME;
      const nmiPassword = process.env.NEXT_PUBLIC_NMI_PASSWORD;

      if (!nmiApiKey || !nmiUsername || !nmiPassword) {
        throw new Error('NMI credentials not configured');
      }

      // Construct the status query request
      const requestData: Record<string, string> = {
        security_key: nmiApiKey,
        type: 'query',
        transactionid: transactionId,
      };

      // Make the API request to NMI
      const response = await fetch(process.env.NEXT_PUBLIC_NMI_API_URL || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${nmiUsername}:${nmiPassword}`).toString('base64')}`,
        },
        body: new URLSearchParams(requestData).toString(),
      });

      if (!response.ok) {
        throw new Error('Payment gateway error');
      }

      const result = await response.json() as NMIResponse;

      if (result.response === '1') {
        return {
          success: true,
          status: result.type,
        };
      } else {
        return {
          success: false,
          error: result.responsetext,
        };
      }
    } catch (error) {
      console.error('Transaction status query error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Status query failed',
      };
    }
  },
}; 