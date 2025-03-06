import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  //   const session = await auth();
  //   const protectedRoutes = ["/dashboard", "/profile", "/multiplayer/room"];

  //   if (!session && protectedRoutes.includes(req.nextUrl.pathname)) {
  //   if (true && protectedRoutes.includes(request.nextUrl.pathname)) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard", "/profile", "/multiplayer/room/:path*"], // Add protected routes
};
