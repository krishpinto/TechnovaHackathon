import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLoggedInUser } from "./actions/auth";

export async function middleware(request: NextRequest) {
  try {
    // Only apply to dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      const user = await getLoggedInUser();
      
      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Don't redirect on API routes
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
