import { NextResponse } from 'next/server';
import { z } from 'zod';

const tokenizeSchema = z.object({
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
  customerId: z.string(),
});

export async function POST(request: Request) {
  try {
    const { paymentDetails, customerId } = tokenizeSchema.parse(await request.json());

    // NMI API Configuration
    const nmiApiUrl = process.env.NMI_API_URL;
    if (!nmiApiUrl) {
      throw new Error('NMI configuration missing');
    }

    // Prepare NMI tokenization request
    const nmiRequestData = new URLSearchParams();
    nmiRequestData.append('security_key', process.env.NMI_API_KEY || '');
    nmiRequestData.append('type', 'tokenize');
    nmiRequestData.append('ccnumber', paymentDetails.cardNumber);
    nmiRequestData.append('ccexp', `${paymentDetails.expiryMonth}${paymentDetails.expiryYear}`);
    nmiRequestData.append('customer_vault', 'add_customer');
    nmiRequestData.append('customer_vault_id', customerId);

    // Add billing information
    nmiRequestData.append('first_name', paymentDetails.firstName);
    nmiRequestData.append('last_name', paymentDetails.lastName);
    nmiRequestData.append('address1', paymentDetails.address.street);
    nmiRequestData.append('city', paymentDetails.address.city);
    nmiRequestData.append('state', paymentDetails.address.state);
    nmiRequestData.append('zip', paymentDetails.address.zipCode);
    nmiRequestData.append('country', 'US');

    console.log("nmiRequestData:", nmiRequestData.toString());

    // Process tokenization through NMI
    const nmiResponse = await fetch(nmiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: nmiRequestData.toString(),
    });

    const responseText = await nmiResponse.text();
    console.log("Raw NMI Response:", responseText);

    const responseParams = new URLSearchParams(responseText);

    if (responseParams.get('response') === '1') {
      // Tokenization successful
      return NextResponse.json({
        success: true,
        tokenId: responseParams.get('token'),
        customerId: responseParams.get('customer_vault_id'),
      });
    } else {
      // Tokenization failed - handle NMI errors here
      const errorCode = responseParams.get('response_code');
      const errorText = responseParams.get('responsetext');
      console.error("NMI Tokenization Error:", errorCode, errorText);

      // Handle specific error codes if needed
      if (errorCode === '200') { // Example: Invalid card number
        return NextResponse.json({ success: false, error: "Invalid card number", code: errorCode }, { status: 400 });
      } else if (errorCode === '201') { // Example: Invalid expiry date
        return NextResponse.json({ success: false, error: "Invalid expiry date", code: errorCode }, { status: 400 });
      } else {
        return NextResponse.json({ success: false, error: errorText, code: errorCode }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('Tokenization error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid payment data',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Tokenization failed',
      details: 'An unexpected error occurred',
    }, { status: 500 });
  }
} 