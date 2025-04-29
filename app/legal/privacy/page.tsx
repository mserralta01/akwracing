import { Metadata } from 'next';
import { legalService } from '@/lib/services/legal-service';

export const metadata: Metadata = {
  title: 'Privacy Policy | AKW Racing Academy',
  description: 'Privacy Policy for AKW Racing Academy',
};

export default async function PrivacyPage() {
  const content = await legalService.getPrivacyPolicy();

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      {content ? (
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      ) : (
        <p className="text-muted-foreground">
          Privacy Policy has not been set up yet. Please check back later.
        </p>
      )}
    </div>
  );
} 