import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем защищенные маршруты
  if (pathname.startsWith("/dashboard")) {
    // Получаем токен JWT из cookies
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Если токена нет - редирект на страницу авторизации
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Матчер для защищенных маршрутов
  matcher: ["/dashboard/:path*"],
};
