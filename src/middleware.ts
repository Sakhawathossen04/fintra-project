import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "fintra_session";
const ANON_COOKIE = "dl_anon";

/** Routes that still require a signed-in account (billing-related only). */
const PROTECTED_ROUTES = ["/settings", "/billing", "/checkout"];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // The workspace and its APIs are open — but ensure an anonymous id exists
  // so threads persist per browser without any login.
  const touchesAgent =
    pathname === "/agent" ||
    pathname.startsWith("/agent/") ||
    pathname.startsWith("/api/agent");

  let response: NextResponse;
  const isProtected = PROTECTED_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  if (isProtected && !req.cookies.get(SESSION_COOKIE)?.value) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    response = NextResponse.redirect(loginUrl);
  } else {
    response = NextResponse.next();
  }

  if (touchesAgent && !req.cookies.get(ANON_COOKIE)?.value) {
    response.cookies.set(ANON_COOKIE, crypto.randomUUID().replace(/-/g, ""), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/agent/:path*",
    "/api/agent/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/checkout/:path*",
  ],
};
