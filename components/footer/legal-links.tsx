"use client";

import Link from "next/link";

export function LegalLinks() {
  return (
    <div className="flex space-x-6">
      <Link href="/privacy" className="hover:text-racing-red transition-colors">
        Privacy Policy
      </Link>
      <Link href="/terms" className="hover:text-racing-red transition-colors">
        Terms of Service
      </Link>
      <Link href="/sitemap" className="hover:text-racing-red transition-colors">
        Sitemap
      </Link>
    </div>
  );
}