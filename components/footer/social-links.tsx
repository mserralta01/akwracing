"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function SocialLinks() {
  return (
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
  );
}