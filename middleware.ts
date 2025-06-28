import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Handles authentication logic.
 * @returns A redirect response if the user needs to be redirected, otherwise null.
 */
function authenticationMiddleware(request: NextRequest): NextResponse | null {
  const authToken = request.cookies.get("access")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  console.log(authToken, isAuthPage, pathname);

  // Redirect authenticated users away from auth pages
  if (authToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isUnrestrictedPage = pathname === "/" || isAuthPage;

  // Protect routes that require authentication
  if (!authToken && !isUnrestrictedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return null;
}

/**
 * Middleware to handle authentication.
 * @param request - The incoming request.
 * @returns A redirect response if the user needs to be redirected, otherwise null.
 */
export function middleware(request: NextRequest) {
  // The order here is important. Authentication runs first.
  const authResponse = authenticationMiddleware(request);
  if (authResponse) {
    return authResponse; // Stop processing and return the redirect.
  }

  // If no middleware returned a response, continue to the requested page.
  return NextResponse.next();
}

export const config = {
  // The matcher defines which paths this middleware runs on.
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
