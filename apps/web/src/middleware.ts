import { updateSession } from "@kidzone/auth/middleware";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return updateSession(request, {
    protectedPrefixes: ["/parent", "/dashboard"],
    loginPath: "/login",
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api(?:/.*)?|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
