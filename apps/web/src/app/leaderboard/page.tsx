import { getActiveLearnerSession } from "@/lib/child-session";
import { LeaderboardClient } from "./leaderboard-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weekly Stars Leaderboard | Kid Zone",
  description: "Friendly weekly star rankings partitioned by Catholic age bands.",
};

export default async function LeaderboardPage() {
  const session = await getActiveLearnerSession();
  const ageBand = session?.ageBand ?? "b8_10";
  const activeChildId = session && !session.isGuest ? session.id : undefined;

  let initialLeaderboard = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/leaderboard?ageBand=${ageBand}`,
      {
        cache: "no-store",
      },
    );
    if (res.ok) {
      const data = await res.json();
      initialLeaderboard = data.leaderboard ?? [];
    }
  } catch {
    // Fallback handled in client
  }

  return (
    <LeaderboardClient
      initialLeaderboard={initialLeaderboard}
      initialAgeBand={ageBand}
      activeChildId={activeChildId}
    />
  );
}
