import { NextResponse } from 'next/server';
import { legalService } from '@/lib/services/legal-service';

/**
 * GET route to retrieve privacy policy
 */
export async function GET() {
  try {
    const content = await legalService.getPrivacyPolicy();
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Failed to fetch privacy policy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch privacy policy' },
      { status: 500 }
    );
  }
} 