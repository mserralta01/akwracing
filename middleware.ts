import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Log the pathname to debug
  console.log("Accessing path:", request.nextUrl.pathname)

  // Your middleware logic here
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/equipment/:path*",
    // ... other paths
  ],
} 