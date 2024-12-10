import { NextResponse } from 'next/server';
import { enrollmentService } from '@/lib/services/enrollment-service';

interface RefundRequestBody {
  transactionId: string;
  amount: number;
}

export async function POST(request: Request) {
  try {
    console.log('Received refund request');
    
    let body: RefundRequestBody;
    try {
      const rawBody = await request.text();
      console.log('Raw request body:', rawBody);
      body = JSON.parse(rawBody);
      console.log('Parsed request body:', body);
    } catch (parseError) {
      console.error('Failed to parse request body:', {
        error: parseError,
        message: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: 'The request body could not be parsed as JSON'
        },
        { status: 400 }
      );
    }

    const { transactionId, amount } = body;
    console.log('Processing refund for:', { transactionId, amount });

    // Validate required fields
    if (!transactionId) {
      console.error('Missing transaction ID');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing transaction ID',
          details: 'Transaction ID is required for refund'
        },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      console.error('Invalid amount:', amount);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid amount',
          details: 'Refund amount must be greater than 0'
        },
        { status: 400 }
      );
    }

    // NMI API Configuration
    const nmiUsername = process.env.NMI_USERNAME;
    const nmiPassword = process.env.NMI_PASSWORD;

    if (!nmiUsername || !nmiPassword) {
      console.error('NMI credentials missing');
      return NextResponse.json(
        {
          success: false,
          error: 'Payment service configuration error',
          details: 'The payment service is not properly configured'
        },
        { status: 500 }
      );
    }

    // Prepare NMI API request
    const nmiEndpoint = 'https://secure.networkmerchants.com/api/transact.php';
    const formData = new URLSearchParams();
    formData.append('username', nmiUsername);
    formData.append('password', nmiPassword);
    formData.append('type', 'refund');
    formData.append('transactionid', transactionId);
    formData.append('amount', amount.toFixed(2));

    console.log('Sending request to NMI:', {
      endpoint: nmiEndpoint,
      transactionId,
      amount: amount.toFixed(2)
    });

    // Make request to NMI API
    let response;
    try {
      response = await fetch(nmiEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('NMI response status:', {
        status: response.status,
        statusText: response.statusText
      });
    } catch (fetchError) {
      console.error('Failed to connect to NMI:', {
        error: fetchError,
        message: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Payment service unavailable',
          details: 'Could not connect to the payment service'
        },
        { status: 503 }
      );
    }

    let responseText;
    try {
      responseText = await response.text();
      console.log('Raw NMI response:', responseText);
    } catch (textError) {
      console.error('Failed to read NMI response:', {
        error: textError,
        message: textError instanceof Error ? textError.message : 'Unknown text error'
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response from payment service',
          details: 'The payment service returned an invalid response'
        },
        { status: 502 }
      );
    }

    const responseData = new URLSearchParams(responseText);
    const responseObj = Object.fromEntries(responseData.entries());
    console.log('Parsed NMI response:', responseObj);

    // Check NMI response
    if (responseData.get('response') === '1') {
      // Refund successful
      const successResponse = {
        success: true,
        refundId: responseData.get('transactionid'),
      };
      console.log('Refund successful:', successResponse);
      return NextResponse.json(successResponse);
    } else {
      // Refund failed
      const errorText = responseData.get('responsetext');
      const errorCode = responseData.get('response_code');
      
      const errorResponse = {
        success: false,
        error: errorText || 'Refund failed',
        details: errorCode ? `Error code: ${errorCode}` : 'No error details available',
        nmiResponse: responseObj
      };
      
      console.error('NMI Refund Failed:', errorResponse);

      return NextResponse.json(errorResponse, { status: 400 });
    }
  } catch (error) {
    const errorDetails = {
      name: error instanceof Error ? error.name : 'Unknown Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
    console.error('Refund processing error:', errorDetails);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
} 