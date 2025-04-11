import { Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from 'react';
import { settingsService, WebsiteContent } from '@/lib/services/settings-service';

export function ContactInfo() {
  const [contactInfo, setContactInfo] = useState<WebsiteContent['contact'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const content = await settingsService.getWebsiteContent();
        setContactInfo(content.contact);
      } catch (error) {
        console.error('Error loading contact info:', error);
        // Keep default placeholders on error or set specific error state
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  const displayAddress = contactInfo?.address?.replace(/\n/g, '<br />');

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Contact Us</h3>
      <ul className="space-y-4">
        <li className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-racing-red" />
          {isLoading ? (
            <span className="text-gray-400">Loading address...</span>
          ) : displayAddress ? (
            <span className="text-gray-400" dangerouslySetInnerHTML={{ __html: displayAddress }} />
          ) : (
            <span className="text-gray-400">Piquet Race Park, Wellington, FL</span>
          )}
        </li>
        <li className="flex items-center space-x-3">
          <Phone className="h-5 w-5 text-racing-red" />
          {isLoading ? (
             <span className="text-gray-400">Loading phone...</span>
          ) : (
            <span className="text-gray-400">{contactInfo?.phone || '(555) 123-4567'}</span>
          )}
        </li>
        <li className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-racing-red" />
           {isLoading ? (
             <span className="text-gray-400">Loading email...</span>
           ) : (
            <span className="text-gray-400">{contactInfo?.email || 'info@akwracing.com'}</span>
           )}
        </li>
      </ul>
    </div>
  );
}