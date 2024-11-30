"use client"

import { useState, useEffect, Fragment } from "react"
import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignInDialog } from "@/components/auth/sign-in-dialog"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { isAdminUser } from "@/lib/auth"

export function UserMenu() {
  const { user, signOut } = useAuth()
  const [showSignIn, setShowSignIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminStatus = await isAdminUser(user)
        setIsAdmin(adminStatus)
      } else {
        setIsAdmin(false)
      }
    }

    checkAdminStatus()
  }, [user])

  // Simulated notifications - replace with real data
  const notifications = [
    { id: 1, message: "New course available", read: false },
    { id: 2, message: "Upcoming race event", read: false },
  ]

  return (
    <div className="flex items-center gap-4">
      {/* Notifications */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.some(n => !n.read) && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center"
                >
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-racing-red'}`} />
                <span>{notification.message}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {user ? (
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          ) : (
            <Button variant="ghost">My Account</Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          {user ? (
            <Fragment>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <Fragment>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </Fragment>
              )}
              <DropdownMenuItem onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </Fragment>
          ) : (
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => setShowSignIn(true)}>
                Sign in
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowSignIn(true)}>
                Create account
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
    </div>
  )
} 