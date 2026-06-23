import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn   = !!req.auth;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginPage  = nextUrl.pathname === "/login";

  // Unauthenticated user hitting an admin route → redirect to /login
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already authenticated user hitting /login → send to dashboard
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", nextUrl.origin));
  }
});

// Only run middleware on admin and login paths — never on static assets or API routes
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
