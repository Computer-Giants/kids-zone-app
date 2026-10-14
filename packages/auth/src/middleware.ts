import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Refreshes the Supabase session on every request and redirects unauthenticated users
 * away from `protectedPrefixes`. Use it from an app's `src/middleware.ts`.
 */
export async function updateSession(
  request: NextRequest,
  opts: { protectedPrefixes?: string[]; loginPath?: string } = {},
) {
  const { protectedPrefixes = ["/dashboard"], loginPath = "/login" } = opts;
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const isProtected = protectedPrefixes.some((p) => request.nextUrl.pathname.startsWith(p));
    if (isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = loginPath;
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet: CookieToSet[]) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const isProtected = protectedPrefixes.some((p) => request.nextUrl.pathname.startsWith(p));

  if (!data.user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return response;
}
