// export { auth as middleware } from "@/auth";

import { NextResponse } from "next/server";
import authConfig from "./auth/auth.config";
import NextAuth from "next-auth";

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req) {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next(); // Allow request to proceed
});

export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  matcher: ["/multiplayer/(.*)", "/profile"],
};
