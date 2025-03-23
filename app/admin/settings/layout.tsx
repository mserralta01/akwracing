import { ReactNode } from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <Link href="/admin/settings/general">
          <span className="text-blue-500 hover:underline">General</span>
        </Link>
        <Link href="/admin/settings/features">
          <span className="text-blue-500 hover:underline">Features</span>
        </Link>
        <Link href="/admin/settings/website">
          <span className="text-blue-500 hover:underline">Website</span>
        </Link>
        {/* Add more settings links here */}
      </div>
      {children}
    </div>
  );
} 