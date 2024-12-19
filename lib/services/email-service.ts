import { StudentProfile, ParentProfile } from '@/types/student';
import { BaseEnrollment } from '@/types/enrollment';
import { Course } from '@/types/course';

type EmailTemplate = 
  | 'enrollment_confirmation'
  | 'payment_confirmation'
  | 'payment_failed'
  | 'course_reminder'
  | 'welcome_email'
  | 'lead_nurture';

interface EmailData {
  enrollment?: BaseEnrollment;
  course?: Course;
  student?: StudentProfile;
  parent?: ParentProfile;
  customData?: Record<string, any>;
}

const templates: Record<EmailTemplate, string> = {
  enrollment_confirmation: 'd-xxxxxxxxxxxxx',
  payment_confirmation: 'd-xxxxxxxxxxxxx',
  payment_failed: 'd-xxxxxxxxxxxxx',
  course_reminder: 'd-xxxxxxxxxxxxx',
  welcome_email: 'd-xxxxxxxxxxxxx',
  lead_nurture: 'd-xxxxxxxxxxxxx',
};

export const emailService = {
  async sendTemplateEmail(
    to: string,
    template: EmailTemplate,
    data: EmailData
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          template,
          data: {
            ...data,
            supportEmail: 'support@akwracing.com',
            websiteUrl: 'https://akwracing.com',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  },

  async sendEnrollmentConfirmation(
    enrollment: BaseEnrollment,
    course: Course,
    student: StudentProfile,
    parent: ParentProfile
  ): Promise<boolean> {
    return this.sendTemplateEmail(parent.email, 'enrollment_confirmation', {
      enrollment,
      course,
      student,
      parent,
    });
  },

  async sendPaymentConfirmation(
    enrollment: BaseEnrollment,
    course: Course,
    parent: ParentProfile
  ): Promise<boolean> {
    return this.sendTemplateEmail(parent.email, 'payment_confirmation', {
      enrollment,
      course,
      parent,
    });
  },

  async sendPaymentFailed(
    enrollment: BaseEnrollment,
    course: Course,
    parent: ParentProfile
  ): Promise<boolean> {
    return this.sendTemplateEmail(parent.email, 'payment_failed', {
      enrollment,
      course,
      parent,
    });
  },

  async sendCourseReminder(
    enrollment: BaseEnrollment,
    course: Course,
    student: StudentProfile,
    parent: ParentProfile
  ): Promise<boolean> {
    return this.sendTemplateEmail(parent.email, 'course_reminder', {
      enrollment,
      course,
      student,
      parent,
    });
  },

  async sendWelcomeEmail(parent: ParentProfile): Promise<boolean> {
    return this.sendTemplateEmail(parent.email, 'welcome_email', {
      parent,
    });
  },

  async sendLeadNurture(
    email: string,
    course: Course,
    customData?: Record<string, any>
  ): Promise<boolean> {
    return this.sendTemplateEmail(email, 'lead_nurture', {
      course,
      customData,
    });
  },

  async sendBulkEmails(
    recipients: { email: string; data: EmailData }[],
    template: EmailTemplate
  ): Promise<boolean> {
    try {
      const results = await Promise.all(
        recipients.map(({ email, data }) =>
          this.sendTemplateEmail(email, template, data)
        )
      );

      return results.every(Boolean);
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      return false;
    }
  },
};
