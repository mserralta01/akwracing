import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Settings,
  School,
  Calendar,
  CreditCard,
  BarChart3,
  Wrench,
  ShoppingCart,
} from "lucide-react"

export function getMenuItems(features: { ecommerce: boolean }) {
  return [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Academy",
      href: "/admin/academy",
      icon: School,
      submenu: [
        {
          title: "Courses",
          href: "/admin/academy/course-management",
          icon: GraduationCap,
        },
        {
          title: "Enrollments",
          href: "/admin/academy/enrollment-management",
          icon: Calendar,
        },
        {
          title: "Payments",
          href: "/admin/academy/payments",
          icon: CreditCard,
        },
      ],
    },
    ...(features.ecommerce ? [{
      title: "E-Commerce",
      href: "/admin/ecommerce",
      icon: ShoppingCart,
      submenu: [
        {
          title: "Equipment",
          href: "/admin/equipment",
          icon: Wrench,
        },
        {
          title: "Orders",
          href: "/admin/ecommerce/orders",
          icon: CreditCard,
        },
        {
          title: "Analytics",
          href: "/admin/ecommerce/analytics",
          icon: BarChart3,
        },
      ],
    }] : []),
    {
      title: "Team",
      href: "/admin/team-management",
      icon: Users,
    },
    {
      title: "Students",
      href: "/admin/students",
      icon: Users,
      submenu: [
        {
          title: "All Students",
          href: "/admin/students/all",
          icon: Users,
        },
        {
          title: "Parents",
          href: "/admin/students/parents",
          icon: Users,
        },
        {
          title: "Reports",
          href: "/admin/students/reports",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      submenu: [
        {
          title: "Features",
          href: "/admin/settings/features",
          icon: Settings,
        },
        {
          title: "General",
          href: "/admin/settings/general",
          icon: Settings,
        },
        {
          title: "Website",
          href: "/admin/settings/website",
          icon: Settings,
        },
        {
          title: "Legal",
          href: "/admin/settings/legal",
          icon: Settings,
        }
      ],
    },
  ]
} 