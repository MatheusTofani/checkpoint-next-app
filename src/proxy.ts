import { NextResponse, type NextRequest } from "next/server";

// Mantém em sincronia com SESSION_COOKIE em src/lib/session.ts
const SESSION_COOKIE = "checkpoint_session";
const publicRoutes = ["/login"];

// Checagem otimista: só olha se o cookie existe (ele expira junto com o token).
// A validação real acontece no DAL (src/lib/dal.ts) e na própria API.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (!isPublicRoute && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isPublicRoute && hasSession) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|logout|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)",
  ],
};
