"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from 'react';
import { settingsService, WebsiteContent } from '@/lib/services/settings-service';

export function ContactSection() {
  const [contactContent, setContactContent] = useState<WebsiteContent['contact'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const content = await settingsService.getWebsiteContent();
        setContactContent(content.contact);
      } catch (error) {
        console.error('Error loading contact content:', error);
        // Use default content on error
        setContactContent(settingsService.getDefaultWebsiteContent().contact);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  const displayAddress = contactContent?.address?.replace(/\n/g, '<br />');

  // Use loaded content or fall back to defaults
  const title = contactContent?.title || 'Contact Us';
  const description = contactContent?.description || 'Get in touch with us to start your racing journey or learn more about our programs.';
  const phone = contactContent?.phone || '(555) 123-4567';
  const email = contactContent?.email || 'info@akwracing.com';

  return (
    <section className="relative py-20 bg-gradient-to-b from-navy-800 to-navy-900">
      {/* Racing-inspired background pattern - Lowered z-index */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.1) 0px,
            rgba(255,255,255,0.1) 1px,
            transparent 1px,
            transparent 10px
          )`
        }} />
      </div>

      {/* Content - Ensure positive z-index */}
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {isLoading ? "Loading..." : title}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {isLoading ? "Loading description..." : description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              <Input type="email" placeholder="Email" />
              <Input type="tel" placeholder="Phone" />
              <Textarea placeholder="Message" className="h-32" />
              <Button className="w-full bg-racing-red hover:bg-red-700">
                Send Message
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-racing-red shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Location</h3>
                    {isLoading ? (
                      <p className="text-gray-500">Loading address...</p>
                    ) : displayAddress ? (
                      <p className="text-gray-500" dangerouslySetInnerHTML={{ __html: displayAddress }} />
                    ) : (
                    <p className="text-gray-500">
                      Piquet Race Park<br />
                      Wellington, FL 33414
                    </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-racing-red shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Phone</h3>
                    <p className="text-gray-500">{isLoading ? "Loading..." : phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-racing-red shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-gray-500">{isLoading ? "Loading..." : email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}