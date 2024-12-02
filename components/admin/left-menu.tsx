"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Settings,
  LogOut,
  School,
  ChevronDown,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const menuItems = [
  {
    title: "Overview",
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
        href: "/admin/academy/courses",
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
  },
];

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const submenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
};

const sidebarVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

export function LeftMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isCollapsed ? '4.5rem' : '16rem'
    );
    return () => {
      document.documentElement.style.removeProperty('--sidebar-width');
    };
  }, [isCollapsed]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const toggleSubmenu = (title: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setTimeout(() => {
        setExpandedItems((prev) =>
          prev.includes(title)
            ? prev.filter((item) => item !== title)
            : [...prev, title]
        );
      }, 150);
    } else {
      setExpandedItems((prev) =>
        prev.includes(title)
          ? prev.filter((item) => item !== title)
          : [...prev, title]
      );
    }
  };

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800 lg:hidden"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      <motion.div
        initial="hidden"
        animate={isSidebarOpen ? "visible" : "hidden"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ width: 'var(--sidebar-width)' }}
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-navy-900 shadow-lg lg:relative",
          "flex flex-col",
          !isSidebarOpen && "lg:translate-x-0",
          "transition-[width] duration-300 ease-in-out"
        )}
      >
        <div className={cn(
          "p-6 flex flex-col items-center border-b border-white/10 relative",
          isCollapsed ? "p-4" : "p-6"
        )}>
          <div className={cn(
            "relative transition-all duration-300 cursor-pointer",
            isCollapsed ? "w-8 h-8" : "w-40 h-40"
          )}
          onClick={() => router.push("/")}>
            {isCollapsed ? (
              <Menu className="w-8 h-8 text-racing-red" />
            ) : (
              <Image
                src="/AKWacademylogo.png"
                alt="AKW Academy Logo"
                fill
                className="object-contain rounded-lg"
                priority
              />
            )}
          </div>
          {!isCollapsed && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-racing-red to-racing-red/60 bg-clip-text text-transparent mt-4">
              Admin Panel
            </h2>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "absolute flex items-center justify-center w-6 h-6 rounded-full",
              "bg-navy-900 text-white border border-white/10 cursor-pointer hover:bg-navy-800",
              "transition-all duration-300",
              isCollapsed 
                ? "right-3 top-4" 
                : "right-4 top-6"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <motion.ul
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const isExpanded = expandedItems.includes(item.title);

              return (
                <motion.li
                  key={item.href}
                  variants={menuItemVariants}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative group">
                    <button
                      onClick={() => item.submenu ? toggleSubmenu(item.title) : router.push(item.href)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 rounded-lg transition-all",
                        isCollapsed ? "px-2 py-3" : "px-4 py-3",
                        "hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98]",
                        isActive
                          ? "bg-white/10 text-white shadow-md"
                          : "text-gray-300 hover:text-white",
                        "relative overflow-hidden"
                      )}
                    >
                      <div className={cn(
                        "flex items-center gap-3 z-10",
                        isCollapsed && "justify-center w-full"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isActive ? "text-racing-red" : "text-gray-400 group-hover:text-racing-red"
                        )} />
                        {!isCollapsed && (
                          <span className="font-medium text-sm whitespace-nowrap">{item.title}</span>
                        )}
                      </div>
                      {!isCollapsed && item.submenu && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isExpanded ? "rotate-180" : "",
                            isActive ? "text-racing-red" : "text-gray-400 group-hover:text-racing-red"
                          )}
                        />
                      )}
                      <div
                        className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                          "bg-gradient-to-r from-white/0 via-white/5 to-white/0"
                        )}
                      />
                    </button>

                    {isCollapsed && (
                      <div className="absolute left-full top-0 ml-2 p-2 bg-navy-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-50 whitespace-nowrap">
                        <span className="text-white text-sm">{item.title}</span>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {!isCollapsed && item.submenu && isExpanded && (
                      <motion.ul
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={submenuVariants}
                        transition={{ duration: 0.2 }}
                        className="ml-6 mt-2 space-y-2 overflow-hidden"
                      >
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive =
                            pathname === subItem.href ||
                            pathname?.startsWith(`${subItem.href}/`);

                          return (
                            <motion.li
                              key={subItem.href}
                              variants={menuItemVariants}
                            >
                              <Link href={subItem.href}>
                                <span
                                  className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all",
                                    "hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98]",
                                    isSubActive
                                      ? "bg-white/10 text-white shadow-sm"
                                      : "text-gray-300 hover:text-white"
                                  )}
                                >
                                  <SubIcon className={cn(
                                    "h-4 w-4",
                                    isSubActive ? "text-racing-red" : "text-gray-400 group-hover:text-racing-red"
                                  )} />
                                  {subItem.title}
                                </span>
                              </Link>
                            </motion.li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        <div className={cn(
          "p-4 mt-auto border-t border-white/10",
          isCollapsed && "flex justify-center"
        )}>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center justify-center gap-2 text-gray-300",
              "hover:text-racing-red hover:bg-white/5 transition-colors rounded-lg",
              "relative group"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Sign Out</span>
            )}
            {isCollapsed && (
              <div className="absolute left-full ml-2 p-2 bg-navy-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-50 whitespace-nowrap">
                <span className="text-white text-sm">Sign Out</span>
              </div>
            )}
          </Button>
        </div>
      </motion.div>

      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
