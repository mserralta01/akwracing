import { NextRequest, NextResponse } from 'next/server';
import { EmailTemplate, EmailRequestBody } from '@/types/email';

const templates: Record<EmailTemplate, string> = {
  enrollment_confirmation: 'd-xxxxxxxxxxxxx',
  payment_confirmation: 'd-xxxxxxxxxxxxx',
  payment_failed: 'd-xxxxxxxxxxxxx',
  course_reminder: 'd-xxxxxxxxxxxxx',
  welcome_email: 'd-xxxxxxxxxxxxx',
  lead_nurture: 'd-xxxxxxxxxxxxx',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EmailRequestBody;
    const { to, template, data } = body;

    if (!to || !template || !templates[template]) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Dynamically import SendGrid only on the server
    const sgMail = (await import('@sendgrid/mail')).default;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

    const msg = {
      to,
      from: 'noreply@akwracing.com',
      templateId: templates[template],
      dynamicTemplateData: {
        ...data,
        supportEmail: 'support@akwracing.com',
        websiteUrl: 'https://akwracing.com',
      },
    };

    await sgMail.send(msg);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 