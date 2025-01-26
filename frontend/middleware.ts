import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser } from "./actions/auth";
import { shouldBlockUser } from "./actions/users";

const protectedRoutes = ["/dashboard"];

export default async function middleware(request: NextRequest) {
  const user = await getLoggedInUser();

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!user && isProtected) {
    // if (await shouldBlockUser()) {
    //   const absoluteUrl = new URL("/getting-started", request.nextUrl.origin);
    //   return NextResponse.redirect(absoluteUrl.toString());
    // }
    const absoluteUrl = new URL("/sign-in", request.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }
  return NextResponse.next();
}
