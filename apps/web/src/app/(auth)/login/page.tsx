"use client";

import { Button, MascotLamb } from "@kidzone/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { signInMagicLinkAction, signInParentAction } from "../actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") ?? "/parent";
  const authError = searchParams.get("error");

  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    authError === "auth_code_error"
      ? "The sign in link was invalid or expired. Please request a new one."
      : null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const res = await signInParentAction({ email, password }, nextUrl);
      if (!res.success && res.error) {
        setError(res.error);
      }
    });
  };

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const res = await signInMagicLinkAction({ email }, origin);
      if (!res.success && res.error) {
        setError(res.error);
      } else if (res.success && res.message) {
        setMessage(res.message);
      }
    });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-md flex-col justify-center px-4 py-8">
      {/* Friendly Header with Lamb Mascot */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3">
          <MascotLamb size="md" mood="happy" />
        </div>
        <h1 className="font-heading text-ink text-3xl font-bold tracking-tight md:text-4xl">
          Parent Sign In
        </h1>
        <p className="text-ink-soft mt-2 text-base">
          Welcome back! Access your household dashboard and manage your children&apos;s learning
          journey.
        </p>
      </div>

      {/* Main Form Container Card */}
      <div className="border-sand-border shadow-card-rest rounded-2xl border-2 bg-white p-6 sm:p-8">
        {/* Mode Selector Tabs */}
        <div className="bg-slate-tint mb-6 flex rounded-xl p-1">
          <button
            type="button"
            onClick={() => {
              setMode("password");
              setError(null);
              setMessage(null);
            }}
            className={`font-heading flex-1 rounded-lg py-2.5 text-center text-sm font-bold transition-all ${
              mode === "password" ? "text-ink shadow-xs bg-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("magic-link");
              setError(null);
              setMessage(null);
            }}
            className={`font-heading flex-1 rounded-lg py-2.5 text-center text-sm font-bold transition-all ${
              mode === "magic-link" ? "text-ink shadow-xs bg-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div
            role="alert"
            className="border-red/20 bg-red-tint text-red-deep mb-5 rounded-xl border p-3 text-sm font-semibold"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="border-green/20 bg-green-tint text-green-deep mb-5 rounded-xl border p-3 text-sm font-semibold"
          >
            {message}
          </div>
        )}

        {/* Password Login Form */}
        {mode === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="parent-email"
                className="font-heading text-ink mb-1 block text-sm font-bold"
              >
                Parent Email
              </label>
              <input
                id="parent-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="border-sand-border text-ink placeholder:text-ink-soft/50 focus:border-orange focus:ring-orange/20 min-h-[48px] w-full rounded-xl border-2 bg-white px-4 text-base focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label
                htmlFor="parent-password"
                className="font-heading text-ink mb-1 block text-sm font-bold"
              >
                Password
              </label>
              <input
                id="parent-password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your secret password"
                className="border-sand-border text-ink placeholder:text-ink-soft/50 focus:border-orange focus:ring-orange/20 min-h-[48px] w-full rounded-xl border-2 bg-white px-4 text-base focus:outline-none focus:ring-2"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="parent"
                size="md"
                disabled={isPending}
                className="w-full"
              >
                {isPending ? "Signing in..." : "Sign In with Password"}
              </Button>
            </div>
          </form>
        )}

        {/* Magic Link Request Form */}
        {mode === "magic-link" && (
          <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="magic-email"
                className="font-heading text-ink mb-1 block text-sm font-bold"
              >
                Parent Email
              </label>
              <input
                id="magic-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="border-sand-border text-ink placeholder:text-ink-soft/50 focus:border-orange focus:ring-orange/20 min-h-[48px] w-full rounded-xl border-2 bg-white px-4 text-base focus:outline-none focus:ring-2"
              />
              <p className="text-ink-soft mt-1.5 text-xs">
                We will email you a secure one time login link. No password required.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="parent"
                size="md"
                disabled={isPending}
                className="w-full"
              >
                {isPending ? "Sending link..." : "Send Magic Link"}
              </Button>
            </div>
          </form>
        )}

        {/* Sign Up Switch Link */}
        <div className="border-sand-border mt-6 border-t pt-4 text-center">
          <p className="text-ink-soft text-sm">
            New to Kid Zone?{" "}
            <Link
              href="/signup"
              className="font-heading text-orange hover:text-orange-deep font-bold hover:underline"
            >
              Create Parent Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-160px)] items-center justify-center p-8">
          <div className="font-heading text-ink-soft text-lg font-bold">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
