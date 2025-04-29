import Link from "next/link";

const links = [
  { text: "Facilities", href: "/facilities" },
  { text: "Instructors", href: "/instructors" },
  { text: "Schedule", href: "/schedule" },
  { text: "About Us", href: "/about" },
  { text: "Contact", href: "/contact" },
];

export function QuickLinks() {
  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Quick Links</h3>
      <ul className="space-y-2">
        {links.map((link) => (
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
  );
}