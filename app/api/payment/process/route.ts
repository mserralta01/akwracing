import { NextResponse } from 'next/server';
import { z } from 'zod';
import { headers } from 'next/headers';

const paymentSchema = z.object({
  enrollment: z.object({
    id: z.string(),
    courseId: z.string(),
    studentId: z.string(),
    parentId: z.string(),
    status: z.string(),
    paymentDetails: z.object({
      amount: z.number(),
      currency: z.string(),
      paymentStatus: z.string(),
    }),
  }),
  course: z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
  }),
  paymentDetails: z.object({
    cardNumber: z.string(),
    expiryMonth: z.string(),
    expiryYear: z.string(),
    cvv: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
    }),
  }),
  tokenId: z.string().optional(),
  paymentId: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = paymentSchema.parse(body);

    const {
      enrollment,
      course,
      paymentDetails,
      tokenId,
      paymentId,
    } = validatedData;

    // NMI API Configuration
    const nmiUsername = process.env.NMI_USERNAME;
    const nmiPassword = process.env.NMI_PASSWORD;
    const nmiApiUrl = process.env.NMI_API_URL;

    if (!nmiUsername || !nmiPassword || !nmiApiUrl) {
      throw new Error('NMI configuration missing');
    }

    // Prepare NMI API request
    const nmiRequestData = new URLSearchParams();
    nmiRequestData.append('security_key', process.env.NMI_API_KEY || '');
    nmiRequestData.append('type', 'sale');
    nmiRequestData.append('amount', course.price.toString());
    
    if (tokenId) {
      // Use tokenized payment method
      nmiRequestData.append('payment_token', tokenId);
      console.log("Using tokenized payment with tokenId:", tokenId);
    } else {
      // Use direct card details
      nmiRequestData.append('ccnumber', paymentDetails.cardNumber);
      nmiRequestData.append('ccexp', `${paymentDetails.expiryMonth.padStart(2, '0')}${paymentDetails.expiryYear.slice(-2)}`);
      nmiRequestData.append('cvv', paymentDetails.cvv);
      console.log("Using direct card details with expiry:", `${paymentDetails.expiryMonth.padStart(2, '0')}${paymentDetails.expiryYear.slice(-2)}`);
    }

    // Add billing information
    nmiRequestData.append('first_name', paymentDetails.firstName);
    nmiRequestData.append('last_name', paymentDetails.lastName);
    nmiRequestData.append('address1', paymentDetails.address.street);
    nmiRequestData.append('city', paymentDetails.address.city);
    nmiRequestData.append('state', paymentDetails.address.state);
    nmiRequestData.append('zip', paymentDetails.address.zipCode);
    nmiRequestData.append('country', 'US');

    // Add order details
    nmiRequestData.append('orderid', paymentId);
    nmiRequestData.append('order_description', `Course: ${course.title}`);

    // Process payment through NMI
    const nmiResponse = await fetch(nmiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: nmiRequestData.toString(),
    });

    const responseText = await nmiResponse.text();
    const responseParams = new URLSearchParams(responseText);

    // Log the raw response from NMI for debugging
    console.log('NMI Raw Response:', responseText);

    if (responseParams.get('response') === '1') {
      // Payment successful
      return NextResponse.json({
        success: true,
        transactionId: responseParams.get('transactionid'),
        authCode: responseParams.get('authcode'),
        avsResponse: responseParams.get('avsresponse'),
        cvvResponse: responseParams.get('cvvresponse'),
      });
    } else {
      // Payment failed
      return NextResponse.json({
        success: false,
        error: responseParams.get('responsetext'),
        details: `Error Code: ${responseParams.get('response_code')}`,
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid payment data',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed',
      details: 'An unexpected error occurred',
    }, { status: 500 });
  }
} 