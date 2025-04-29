import { NextResponse } from 'next/server';
import { legalService } from '@/lib/services/legal-service';

/**
 * GET route to retrieve terms and conditions
 */
export async function GET() {
  try {
    const content = await legalService.getTermsAndConditions();
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Failed to fetch terms and conditions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch terms and conditions' },
      { status: 500 }
    );
  }
} 