import { NextResponse } from "next/server";
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

const parseNMIResponse = (responseText: string): NMIResponse => {
  const params = new URLSearchParams(responseText);
  return {
    response: params.get('response') || '',
    responsetext: params.get('responsetext') || '',
    authcode: params.get('authcode') || '',
    transactionid: params.get('transactionid') || '',
    avsresponse: params.get('avsresponse') || '',
    cvvresponse: params.get('cvvresponse') || '',
    orderid: params.get('orderid') || '',
    type: params.get('type') || '',
    response_code: params.get('response_code') || '',
  };
};

export async function POST(request: Request) {
  try {
    const { enrollment, course, paymentDetails } = await request.json() as {
      enrollment: Enrollment;
      course: Course;
      paymentDetails: PaymentDetails;
    };

    const nmiApiKey = process.env.NMI_API_KEY;
    const nmiApiUrl = process.env.NMI_API_URL;
    const nmiUsername = process.env.NMI_USERNAME;
    const nmiPassword = process.env.NMI_PASSWORD;

    if (!nmiApiKey || !nmiApiUrl || !nmiUsername || !nmiPassword) {
      return NextResponse.json(
        { success: false, error: "Payment gateway configuration missing" },
        { status: 500 }
      );
    }

    // Construct the payment request data
    const requestData: Record<string, string> = {
      security_key: nmiApiKey,
      type: "sale",
      amount: course.price.toString(),
      ccnumber: paymentDetails.cardNumber,
      ccexp: `${paymentDetails.expiryMonth}${paymentDetails.expiryYear}`,
      cvv: paymentDetails.cvv,
      first_name: paymentDetails.firstName,
      last_name: paymentDetails.lastName,
      address1: paymentDetails.address.street,
      city: paymentDetails.address.city,
      state: paymentDetails.address.state,
      zip: paymentDetails.address.zipCode,
      orderid: enrollment.id,
      customer_receipt: "true",
    };

    // Make the API request to NMI
    const response = await fetch(nmiApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${nmiUsername}:${nmiPassword}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams(requestData).toString(),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Payment gateway error" },
        { status: 500 }
      );
    }

    const responseText = await response.text();
    const result = parseNMIResponse(responseText);

    if (result.response === "1") {
      // Payment successful
      return NextResponse.json({
        success: true,
        transactionId: result.transactionid,
        authCode: result.authcode,
      });
    } else {
      // Payment failed
      return NextResponse.json(
        {
          success: false,
          error: result.responsetext,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Payment processing failed",
      },
      { status: 500 }
    );
  }
} 