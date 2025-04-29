"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { settingsService, WebsiteContent } from '@/lib/services/settings-service';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
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
        // Use default content on error
        setContactInfo(settingsService.getDefaultWebsiteContent().contact);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  const displayAddress = contactInfo?.address?.replace(/\n/g, '<br />');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you soon!",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{contactInfo?.title || 'Contact Us'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Your email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Your message"
              rows={5}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Send Message
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Our Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              {isLoading ? (
                <span className="text-sm">Loading address...</span>
              ) : displayAddress ? (
                <span className="text-sm" dangerouslySetInnerHTML={{ __html: displayAddress }} />
              ) : (
                <span className="text-sm">Piquet Race Park, Wellington, FL 33414</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              {isLoading ? (
                <span className="text-sm">Loading phone...</span>
              ) : (
                <span className="text-sm">{contactInfo?.phone || '(555) 123-4567'}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              {isLoading ? (
                <span className="text-sm">Loading email...</span>
              ) : (
                <span className="text-sm">{contactInfo?.email || 'info@akwracing.com'}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 