import type { Metadata } from "next";
import { SEED_QUIZZES } from "@kidzone/db";
import { getActiveLearnerSession } from "@/lib/child-session";
import { QuizzesIndexView } from "./quizzes-index-view";

export const metadata: Metadata = {
  title: "Fun Faith Quizzes for Catholic Children | Kid Zone",
  description:
    "Test your Catholic faith knowledge with encouraging 4-question quizzes on Bible stories, saints, and sacraments guided by our friendly lamb mascot.",
};

export default async function QuizzesPage() {
  const session = await getActiveLearnerSession();

  return <QuizzesIndexView quizzes={SEED_QUIZZES} session={session} />;
}
