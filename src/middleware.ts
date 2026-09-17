import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "fintra_session";

const PROTECTED_ROUTES = ["/workspace", "/settings", "/billing", "/checkout"];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isProtected = PROTECTED_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  if (!isProtected) return NextResponse.next();

  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  if (hasSession) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/workspace/:path*", "/settings/:path*", "/billing/:path*", "/checkout/:path*"],
};
