import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if the user is authenticated
  const isAuth = !!token;

  // Define auth pages and public routes
  const isAuthPage = pathname.startsWith("/auth/");
  const isApiAuthRoute = pathname.startsWith("/api/auth/");
  const PUBLIC_ROUTES = ["/", "/about", "/contact"];
  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/_next/") ||
    pathname.includes("/favicon.ico");

  // Skip middleware for NextAuth API routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // If it's an auth page and user is authenticated, redirect to dashboard
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If it's not an auth page, not a public route, and user is not authenticated,
  // redirect to signin
  if (!isAuthPage && !isPublicRoute && !isAuth) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
