import { Mail, Phone, MapPin } from "lucide-react";

export function ContactInfo() {
  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Contact Us</h3>
      <ul className="space-y-4">
        <li className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-racing-red" />
          <span className="text-gray-400">Piquet Race Park, Wellington, FL</span>
        </li>
        <li className="flex items-center space-x-3">
          <Phone className="h-5 w-5 text-racing-red" />
          <span className="text-gray-400">(555) 123-4567</span>
        </li>
        <li className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-racing-red" />
          <span className="text-gray-400">info@akwracing.com</span>
        </li>
      </ul>
    </div>
  );
}