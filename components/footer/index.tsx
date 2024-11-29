import { Brand } from "./brand";
import { QuickLinks } from "./quick-links";
import { ContactInfo } from "./contact-info";
import { NewsletterSection } from "./newsletter-section";
import { BottomBar } from "./bottom-bar";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-racing-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Brand />
          <QuickLinks />
          <ContactInfo />
          <NewsletterSection />
        </div>
        <Separator className="bg-racing-gray my-8" />
        <BottomBar />
      </div>
    </footer>
  );
}