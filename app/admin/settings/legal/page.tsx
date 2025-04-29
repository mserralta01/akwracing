'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { legalService } from '@/lib/services/legal-service';

export default function LegalPage() {
  const [termsContent, setTermsContent] = useState<string>('');
  const [privacyContent, setPrivacyContent] = useState<string>('');
  const [loading, setLoading] = useState({
    terms: false,
    privacy: false,
    initialLoad: true
  });

  useEffect(() => {
    const loadLegalContent = async () => {
      try {
        const [terms, privacy] = await Promise.all([
          legalService.getTermsAndConditions(),
          legalService.getPrivacyPolicy()
        ]);
        
        setTermsContent(terms);
        setPrivacyContent(privacy);
      } catch (error) {
        console.error("Error loading legal content:", error);
        toast.error("Failed to load legal content");
      } finally {
        setLoading(prev => ({ ...prev, initialLoad: false }));
      }
    };

    loadLegalContent();
  }, []);

  const handleSaveTerms = async () => {
    try {
      setLoading(prev => ({ ...prev, terms: true }));
      await legalService.saveTermsAndConditions(termsContent);
      toast.success("Terms and Conditions saved successfully");
    } catch (error) {
      console.error("Error saving Terms and Conditions:", error);
      toast.error("Failed to save Terms and Conditions");
    } finally {
      setLoading(prev => ({ ...prev, terms: false }));
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setLoading(prev => ({ ...prev, privacy: true }));
      await legalService.savePrivacyPolicy(privacyContent);
      toast.success("Privacy Policy saved successfully");
    } catch (error) {
      console.error("Error saving Privacy Policy:", error);
      toast.error("Failed to save Privacy Policy");
    } finally {
      setLoading(prev => ({ ...prev, privacy: false }));
    }
  };

  if (loading.initialLoad) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading legal documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Legal Documents</h1>
        <p className="text-muted-foreground">
          Manage your terms and conditions and privacy policy documents.
        </p>
      </div>

      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="terms">Terms and Conditions</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="terms" className="space-y-4">
          <div className="border rounded-md p-4 bg-muted/30">
            <h2 className="text-lg font-medium mb-2">Terms and Conditions</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This content will be displayed to users when they view your terms and conditions.
            </p>
            <RichTextEditor 
              content={termsContent} 
              onChange={setTermsContent}
              className="min-h-[300px]"
            />
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleSaveTerms} 
                disabled={loading.terms}
              >
                {loading.terms ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <div className="border rounded-md p-4 bg-muted/30">
            <h2 className="text-lg font-medium mb-2">Privacy Policy</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This content will be displayed to users when they view your privacy policy.
            </p>
            <RichTextEditor 
              content={privacyContent} 
              onChange={setPrivacyContent}
              className="min-h-[300px]"
            />
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleSavePrivacy} 
                disabled={loading.privacy}
              >
                {loading.privacy ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 