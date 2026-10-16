"use client";

import { Button, MascotLamb } from "@kidzone/ui";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { signUpParentAction } from "../actions";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    try {
      const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (userZone) {
        setTimezone(userZone);
      }
    } catch {
      // Fallback to UTC
    }
  }, []);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Immediate client feedback for password
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    startTransition(async () => {
      const res = await signUpParentAction({
        email,
        password,
        fullName: fullName || undefined,
        timezone,
      });

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
          <MascotLamb size="md" mood="celebrating" />
        </div>
        <h1 className="font-heading text-ink text-3xl font-bold tracking-tight md:text-4xl">
          Create Parent Account
        </h1>
        <p className="text-ink-soft mt-2 text-base">
          Start your family household. Children never need accounts or credentials.
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="border-sand-border shadow-card-rest rounded-2xl border-2 bg-white p-6 sm:p-8">
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

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label
              htmlFor="parent-name"
              className="font-heading text-ink mb-1 block text-sm font-bold"
            >
              Full Name (Optional)
            </label>
            <input
              id="parent-name"
              type="text"
              name="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Mary Joseph"
              className="border-sand-border text-ink placeholder:text-ink-soft/50 focus:border-orange focus:ring-orange/20 min-h-[48px] w-full rounded-xl border-2 bg-white px-4 text-base focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="parent-signup-email"
              className="font-heading text-ink mb-1 block text-sm font-bold"
            >
              Email Address <span className="text-orange">*</span>
            </label>
            <input
              id="parent-signup-email"
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
              htmlFor="parent-signup-password"
              className="font-heading text-ink mb-1 block text-sm font-bold"
            >
              Password <span className="text-orange">*</span>
            </label>
            <input
              id="parent-signup-password"
              type="password"
              name="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters with a number"
              className="border-sand-border text-ink placeholder:text-ink-soft/50 focus:border-orange focus:ring-orange/20 min-h-[48px] w-full rounded-xl border-2 bg-white px-4 text-base focus:outline-none focus:ring-2"
            />
            <p className="text-ink-soft mt-1 text-xs">
              Must be at least 8 characters and include at least one number.
            </p>
          </div>

          <input type="hidden" name="timezone" value={timezone} />

          <div className="pt-3">
            <Button
              type="submit"
              variant="parent"
              size="md"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Creating account..." : "Create Parent Account"}
            </Button>
          </div>
        </form>

        {/* Informative Privacy Note */}
        <div className="bg-sand/50 text-ink-soft mt-5 rounded-xl p-3 text-center text-xs">
          🛡️ <strong>Family Privacy Guarantee:</strong> Children never hold accounts or passwords.
          You maintain all family learning controls.
        </div>

        {/* Existing Member Sign In Link */}
        <div className="border-sand-border mt-6 border-t pt-4 text-center">
          <p className="text-ink-soft text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-heading text-orange hover:text-orange-deep font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
