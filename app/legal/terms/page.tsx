import { Metadata } from 'next';
import { legalService } from '@/lib/services/legal-service';

export const metadata: Metadata = {
  title: 'Terms and Conditions | AKW Racing Academy',
  description: 'Terms and Conditions for AKW Racing Academy',
};

export default async function TermsPage() {
  const content = await legalService.getTermsAndConditions();

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      
      {content ? (
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      ) : (
        <p className="text-muted-foreground">
          Terms and Conditions have not been set up yet. Please check back later.
        </p>
      )}
    </div>
  );
} 