"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { AuthButtons } from "./auth/auth-buttons";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Beginner Course",
    href: "/programs/beginner",
    description: "Start your racing journey with our comprehensive beginner program.",
  },
  {
    title: "Advanced Training",
    href: "/programs/advanced",
    description: "Take your skills to the next level with professional instruction.",
  },
  {
    title: "Race Ready",
    href: "/programs/race-ready",
    description: "Prepare for competitive racing with our intensive program.",
  },
];

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-black border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/AKWacademylogo.png"
            alt="AKW Racing Academy Logo"
            width={160}
            height={160}
            className="object-contain -my-12"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-8">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white text-lg font-bold hover:text-racing-red">
                  Programs
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/facilities" legacyBehavior passHref>
                  <NavigationMenuLink className="text-white text-lg font-bold hover:text-racing-red">
                    Facilities
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/instructors" legacyBehavior passHref>
                  <NavigationMenuLink className="text-white text-lg font-bold hover:text-racing-red">
                    Instructors
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className="text-white text-lg font-bold hover:text-racing-red">
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex ml-auto items-center space-x-4">
          <AuthButtons />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black text-white p-4 space-y-4">
          <Link href="/programs" className="block text-lg font-bold hover:text-racing-red">
            Programs
          </Link>
          <Link href="/facilities" className="block text-lg font-bold hover:text-racing-red">
            Facilities
          </Link>
          <Link href="/instructors" className="block text-lg font-bold hover:text-racing-red">
            Instructors
          </Link>
          <Link href="/contact" className="block text-lg font-bold hover:text-racing-red">
            Contact
          </Link>
          <AuthButtons />
        </div>
      )}
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-racing-red",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-gray-900">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-500">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";