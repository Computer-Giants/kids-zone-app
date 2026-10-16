"use server";

import { createClient } from "@kidzone/auth/server";
import { magicLinkSchema, parentSignInSchema, parentSignUpSchema } from "@kidzone/validators";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSafeRedirectUrl } from "../../lib/redirect";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function signUpParentAction(
  formData: FormData | Record<string, unknown>,
): Promise<AuthActionResult> {
  const raw =
    formData instanceof FormData
      ? {
          email: formData.get("email"),
          password: formData.get("password"),
          fullName: formData.get("fullName") || undefined,
          timezone: formData.get("timezone") || "UTC",
        }
      : formData;

  const parsed = parentSignUpSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Invalid sign up details provided.",
    };
  }

  const { email, password, fullName, timezone } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
        timezone: timezone || "UTC",
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // If a session was established immediately, navigate to the parent dashboard
  if (data.session) {
    redirect("/parent");
  }

  return {
    success: true,
    message:
      "Account created! You may explore your dashboard now while your email confirmation arrives.",
  };
}

export async function signInParentAction(
  formData: FormData | Record<string, unknown>,
  nextUrl = "/parent",
): Promise<AuthActionResult> {
  const raw =
    formData instanceof FormData
      ? {
          email: formData.get("email"),
          password: formData.get("password"),
        }
      : formData;

  const parsed = parentSignInSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Email and password are required.",
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: "Invalid email or password. Please try again.",
    };
  }

  redirect(getSafeRedirectUrl(nextUrl, "/parent"));
}

export async function signInMagicLinkAction(
  formData: FormData | Record<string, unknown>,
  clientOrigin = "",
): Promise<AuthActionResult> {
  const raw =
    formData instanceof FormData
      ? {
          email: formData.get("email"),
        }
      : formData;

  const parsed = magicLinkSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : "Valid email address is required.",
    };
  }

  const { email } = parsed.data;
  const supabase = await createClient();

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") || "http";
  const serverOrigin = host ? `${proto}://${host}` : "";
  const effectiveOrigin = serverOrigin || clientOrigin || (process.env.NEXT_PUBLIC_SITE_URL ?? "");

  const redirectTo = effectiveOrigin ? `${effectiveOrigin}/auth/callback?next=/parent` : undefined;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: "Check your inbox for a magic sign in link.",
  };
}

export async function signOutParentAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
