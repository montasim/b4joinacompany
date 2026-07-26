import { NextRequest, NextResponse } from "next/server";

const privatePaths = ["/answer", "/history", "/export", "/notifications", "/account", "/admin"];

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();
  const isPrivate = privatePaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  );
  if (!isPrivate) return NextResponse.next();
  const hasSession =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");
  if (hasSession) return NextResponse.next();
  const target = new URL("/auth/sign-in", request.url);
  target.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(target);
}

export const config = {
  matcher: [
    "/answer/:path*",
    "/history/:path*",
    "/export/:path*",
    "/notifications/:path*",
    "/account/:path*",
    "/admin/:path*"
  ]
};
