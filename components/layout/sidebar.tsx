import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutGrid, 
  Box, 
  Settings,
  // ... other icons
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      label: "Equipment",
      icon: Box,
      href: "/admin/equipment",
      active: pathname?.startsWith("/admin/equipment"),
    },
    // ... other routes
  ]

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-all hover:bg-gray-100",
                route.active ? "bg-gray-100" : "text-gray-500"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 