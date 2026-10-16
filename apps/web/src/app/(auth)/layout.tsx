import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Parent Account",
  description: "Sign in or create a parent account for Kid Zone Catholic learning.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
