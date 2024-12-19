import { BaseEnrollment } from "@/types/enrollment";
import { PaymentDetails, PaymentToken } from "@/types/payment";
import { Course } from "@/types/course";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, updateDoc, getDoc, getDocs, query, where } from "firebase/firestore";

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  tokenId?: string;
  error?: string;
  details?: string;
}

interface NMITokenizeResponse {
  success: boolean;
  tokenId?: string;
  error?: string;
}

interface ProcessPaymentOptions {
  shouldTokenize?: boolean;
  customerId?: string;
  savePaymentMethod?: boolean;
}

export const paymentService = {
  async tokenizePaymentMethod(
    paymentDetails: PaymentDetails,
    customerId: string
  ): Promise<NMITokenizeResponse> {
    console.log("customerId in tokenizePaymentMethod:", customerId);
    console.log("paymentDetails in tokenizePaymentMethod:", paymentDetails);

    console.log("paymentDetails before sending to API:", paymentDetails);

    // Format expiry date if necessary (example for MMYY format)
    const formattedExpiry = `${paymentDetails.expiryMonth?.padStart(2, '0')}${paymentDetails.expiryYear?.slice(-2)}`;
    console.log("Formatted expiry date:", formattedExpiry);

    try {
      const response = await fetch('/api/payment/tokenize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentDetails: {
            ...paymentDetails,
            expiryMonth: paymentDetails.expiryMonth?.padStart(2, '0'), // Ensure 2 digits
            expiryYear: paymentDetails.expiryYear?.slice(-2), // Ensure last 2 digits
          },
          customerId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `Tokenization failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.tokenId) {
        // Store token reference in Firestore
        const tokenDoc = {
          id: result.tokenId,
          customerId,
          last4: paymentDetails.cardNumber?.slice(-4),
          expiryMonth: paymentDetails.expiryMonth,
          expiryYear: paymentDetails.expiryYear,
          tokenType: 'recurring',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(
          doc(db, "paymentTokens", result.tokenId),
          tokenDoc
        );

        return {
          success: true,
          tokenId: result.tokenId,
        };
      }

      return {
        success: false,
        error: "Failed to tokenize payment method",
      };
    } catch (error) {
      console.error("Tokenization error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to tokenize payment method",
      };
    }
  },

  async processPayment(
    enrollment: BaseEnrollment,
    course: Course,
    paymentDetails: PaymentDetails,
    options: ProcessPaymentOptions = {}
  ): Promise<PaymentResponse> {
    try {
      let tokenId: string | undefined = paymentDetails.tokenId;

      // Tokenize card if requested and no tokenId exists
      if (options.shouldTokenize && options.customerId && !tokenId) {
        const tokenizeResult = await this.tokenizePaymentMethod(
          paymentDetails,
          options.customerId
        );

        if (!tokenizeResult.success) {
          return {
            success: false,
            error: tokenizeResult.error,
            details: "Failed to tokenize payment method",
          };
        }

        tokenId = tokenizeResult.tokenId;
      }

      // Create payment record
      const paymentId = crypto.randomUUID();
      const paymentRecord: any = {
        id: paymentId,
        enrollmentId: enrollment.id,
        amount: course.price,
        currency: "USD",
        status: "processing",
        metadata: {
          courseId: course.id,
          courseName: course.title,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add payment method details based on whether it's a token or card payment
      if (tokenId) {
        paymentRecord.paymentMethod = {
          type: "token",
          tokenId: tokenId,
        };
      } else {
        paymentRecord.paymentMethod = {
          type: "card",
          last4: paymentDetails.cardNumber?.slice(-4),
        };
      }

      await setDoc(
        doc(db, "payments", paymentId),
        paymentRecord
      );

      // Process payment
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollment,
          course,
          paymentDetails,
          tokenId,
          paymentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        
        // Update payment record with failure
        await updateDoc(doc(db, "payments", paymentId), {
          status: "failed",
          error: errorData.error || response.statusText,
          updatedAt: new Date().toISOString(),
        });

        throw new Error(errorData.error || `Payment failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.transactionId) {
        // Update payment record with success
        console.log("Payment successful, updating record with transactionId:", result.transactionId);
        await updateDoc(doc(db, "payments", paymentId), {
          status: "completed",
          transactionId: result.transactionId,
          updatedAt: new Date().toISOString(),
        });

        return {
          success: true,
          transactionId: result.transactionId,
          tokenId,
        };
      } else {
        // Update payment record with failure
        console.log("Payment failed, updating record with error:", result.error);
        await updateDoc(doc(db, "payments", paymentId), {
          status: "failed",
          error: result.error,
          updatedAt: new Date().toISOString(),
        });

        return {
          success: false,
          error: result.error,
          details: result.details,
        };
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment processing failed",
        details: "An unexpected error occurred. Please try again or contact support.",
      };
    }
  },

  async getStoredPaymentMethods(customerId: string): Promise<PaymentToken[]> {
    try {
      const tokensSnapshot = await getDocs(
        query(
          collection(db, "paymentTokens"),
          where("customerId", "==", customerId)
        )
      );

      return tokensSnapshot.docs.map(doc => doc.data() as PaymentToken);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return [];
    }
  },
};
