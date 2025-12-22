import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

  // Если пользователь на /auth и залогинен - редирект на главную
  if (pathname === "/auth" && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Если пользователь НЕ на /auth и НЕ залогинен - редирект на /auth
  if (pathname !== "/auth" && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

