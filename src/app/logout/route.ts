import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/src/lib/session";

// Limpa um cookie de sessão inválido/expirado. Usado pelo DAL para evitar
// loop entre o proxy (que vê o cookie) e o login.
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.nextUrl));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
