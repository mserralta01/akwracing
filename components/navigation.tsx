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
  navigationMenuTriggerStyle,
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
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
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
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="bg-white">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-white text-gray-900 font-medium hover:text-racing-red data-[state=open]:bg-white">
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
                  <NavigationMenuLink className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-white disabled:opacity-50 disabled:pointer-events-none bg-white hover:bg-white hover:text-racing-red h-10 py-2 px-4 group text-gray-900",
                    "data-[active]:bg-white data-[state=open]:bg-white"
                  )}>
                    Facilities
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/instructors" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-white disabled:opacity-50 disabled:pointer-events-none bg-white hover:bg-white hover:text-racing-red h-10 py-2 px-4 group text-gray-900",
                    "data-[active]:bg-white data-[state=open]:bg-white"
                  )}>
                    Instructors
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-white disabled:opacity-50 disabled:pointer-events-none bg-white hover:bg-white hover:text-racing-red h-10 py-2 px-4 group text-gray-900",
                    "data-[active]:bg-white data-[state=open]:bg-white"
                  )}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden p-0"
          onClick={() => {/* Add mobile menu handler */}}
        >
          <Menu className="h-6 w-6 text-gray-900" />
        </Button>

        {/* Auth Buttons */}
        <div className="ml-auto flex items-center space-x-4">
          <AuthButtons />
        </div>
      </div>
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