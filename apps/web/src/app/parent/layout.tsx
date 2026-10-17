import { createClient } from "@kidzone/auth/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Parent Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ParentLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/parent");
  }

  return <>{children}</>;
}
