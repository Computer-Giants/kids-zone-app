import { createClient } from "@kidzone/auth/server";
import { NextResponse, type NextRequest } from "next/server";
import { getSafeRedirectUrl } from "../../../lib/redirect";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const rawNext = requestUrl.searchParams.get("next");
  const safeNext = getSafeRedirectUrl(rawNext, "/parent");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(safeNext, request.url));
    }
  }

  // If code exchange failed or was not provided, return to login with error
  return NextResponse.redirect(new URL("/login?error=auth_code_error", request.url));
}
