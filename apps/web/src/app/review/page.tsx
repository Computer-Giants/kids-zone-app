import { getActiveLearnerSession } from "@/lib/child-session";
import { ReviewClient, type ReviewQuestion } from "./review-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Faith Review | Kid Zone",
  description: "Gentle spaced repetition daily question warmup for young Catholic learners.",
};

export default async function DailyReviewPage() {
  const session = await getActiveLearnerSession();
  const childId = session && !session.isGuest ? session.id : undefined;
  const ageBand = session?.ageBand ?? "b8_10";

  let questions: ReviewQuestion[] = [];
  try {
    const query = childId
      ? `childId=${childId}&limit=5`
      : `childId=00000000-0000-4000-8000-000000000001&limit=5`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/review/daily?${query}`,
      { cache: "no-store" },
    );
    if (res.ok) {
      const data = await res.json();
      questions = data.questions ?? [];
    }
  } catch {
    // Handled in client
  }

  return <ReviewClient questions={questions} childId={childId} ageBand={ageBand} />;
}
