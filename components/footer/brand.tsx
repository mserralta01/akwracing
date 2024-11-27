import Link from "next/link";
import { Trophy } from "lucide-react";
import { SocialLinks } from "./social-links";

export function Brand() {
  return (
    <div className="space-y-4">
      <Link href="/" className="flex items-center space-x-2">
        <Trophy className="h-6 w-6 text-racing-red" />
        <span className="font-bold text-xl">AKW Racing</span>
      </Link>
      <p className="text-gray-400">
        Premier karting academy providing professional race training for all skill levels.
      </p>
      <SocialLinks />
    </div>
  );
}