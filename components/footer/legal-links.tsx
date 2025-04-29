"use client";

import Link from "next/link";

export function LegalLinks() {
  return (
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
  );
}