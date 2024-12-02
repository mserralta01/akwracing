import { Enrollment, StudentProfile, ParentProfile } from './student';
import { Course } from './course';

export type EmailTemplate = 
  | 'enrollment_confirmation'
  | 'payment_confirmation'
  | 'payment_failed'
  | 'course_reminder'
  | 'welcome_email'
  | 'lead_nurture';

export interface EmailData {
  enrollment?: Enrollment;
  course?: Course;
  student?: StudentProfile;
  parent?: ParentProfile;
  customData?: Record<string, any>;
  supportEmail?: string;
  websiteUrl?: string;
}

export interface EmailRequestBody {
  to: string;
  template: EmailTemplate;
  data: EmailData;
} 