"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { settingsService, WebsiteContent } from '@/lib/services/settings-service';

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2024);
  const [contactInfo, setContactInfo] = useState<WebsiteContent['contact'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const content = await settingsService.getWebsiteContent();
        setContactInfo(content.contact);
      } catch (error) {
        console.error('Error loading contact info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  const displayAddress = contactInfo?.address?.replace(/\n/g, '<br />');

  return (
    <footer className="bg-racing-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-racing-red" />
              <span className="font-bold text-xl">AKW Racing</span>
            </Link>
            <p className="text-gray-400">
              Premier karting academy providing professional race training for all skill levels.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-racing-red transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="hover:text-racing-red transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="hover:text-racing-red transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://youtube.com" className="hover:text-racing-red transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { text: "Facilities", href: "/facilities" },
                { text: "Instructors", href: "/instructors" },
                { text: "Schedule", href: "/schedule" },
                { text: "About Us", href: "/about" },
                { text: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-racing-red transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
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
                  <span className="text-gray-400">
                    American Kart Works, LLC<br />
                    Training & Service Center<br />
                    3101 Fairlane Farms Road<br />
                    Wellington, FL 33414
                  </span>
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

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-racing-gray border-racing-gray text-white placeholder:text-gray-400"
              />
              <Button type="submit" className="w-full bg-racing-red hover:bg-red-700">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="bg-racing-gray my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-gray-400 text-sm">
          <div>
            © {currentYear} AKW Racing Academy. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/legal/privacy" className="hover:text-racing-red transition-colors">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-racing-red transition-colors">
              Terms and Conditions
            </Link>
            <Link href="/sitemap" className="hover:text-racing-red transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}