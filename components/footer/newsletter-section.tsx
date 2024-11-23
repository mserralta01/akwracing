import { NewsletterForm } from "./newsletter-form";

export function NewsletterSection() {
  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Newsletter</h3>
      <p className="text-gray-400 mb-4">
        Subscribe to our newsletter for updates and exclusive offers.
      </p>
      <NewsletterForm />
    </div>
  );
}