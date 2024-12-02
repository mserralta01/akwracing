import Link from "next/link"

const menuItems = [
  // ... other menu items
  {
    title: "Meet the Team",
    href: "/team",
  },
  // ... other menu items
]; 

export function TopMenu() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="mr-4">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Acme Admin
          </div>
        </Link>
        
        {/* Rest of the TopMenu component */}
      </div>
    </div>
  )
} 