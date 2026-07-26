import { NextRequest, NextResponse } from "next/server";

const privatePaths = ["/answer", "/history", "/export", "/notifications", "/admin"];

export function proxy(request: NextRequest) {
  const isPrivate = privatePaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  );
  if (!isPrivate) return NextResponse.next();
  const hasSession =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");
  if (hasSession) return NextResponse.next();
  const target = new URL("/auth/sign-in", request.url);
  target.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  return NextResponse.redirect(target);
}

export const config = {
  matcher: [
    "/answer/:path*",
    "/history/:path*",
    "/export/:path*",
    "/notifications/:path*",
    "/admin/:path*"
  ]
};
