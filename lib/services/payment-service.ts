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
      const nmiApiKey = process.env.NEXT_PUBLIC_NMI_API_KEY;
      const nmiUsername = process.env.NEXT_PUBLIC_NMI_USERNAME;
      const nmiPassword = process.env.NEXT_PUBLIC_NMI_PASSWORD;

      if (!nmiApiKey || !nmiUsername || !nmiPassword) {
        throw new Error('NMI credentials not configured');
      }

      // Construct the NMI API request
      const requestData: Record<string, string> = {
        security_key: nmiApiKey,
        type: 'sale',
        ccnumber: paymentDetails.cardNumber,
        ccexp: `${paymentDetails.expiryMonth}${paymentDetails.expiryYear}`,
        cvv: paymentDetails.cvv,
        amount: course.price.toString(),
        currency: 'USD',
        first_name: paymentDetails.firstName,
        last_name: paymentDetails.lastName,
        address1: paymentDetails.address.street,
        city: paymentDetails.address.city,
        state: paymentDetails.address.state,
        zip: paymentDetails.address.zipCode,
        country: paymentDetails.address.country,
        orderid: enrollment.id,
        customer_receipt: 'true',
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

      if (result.response === '1') { // Successful transaction
        return {
          success: true,
          transactionId: result.transactionid,
        };
      } else {
        return {
          success: false,
          error: result.responsetext,
        };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
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