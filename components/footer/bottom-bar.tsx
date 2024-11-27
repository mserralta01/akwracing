import { Copyright } from "./copyright";
import { LegalLinks } from "./legal-links";

export function BottomBar() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-gray-400 text-sm">
      <Copyright />
      <LegalLinks />
    </div>
  );
}