import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPuzzleBySlug, SEED_PUZZLES } from "@kidzone/db";
import { getActiveLearnerSession } from "@/lib/child-session";
import { PuzzleRunnerView } from "./puzzle-runner-view";

interface PuzzleRunnerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return SEED_PUZZLES.map((puzzle) => ({
    slug: puzzle.slug,
  }));
}

export async function generateMetadata({ params }: PuzzleRunnerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const puzzle = getPuzzleBySlug(slug);

  if (!puzzle) {
    return {
      title: "Puzzle Not Found | Kid Zone",
      description: "The requested church puzzle could not be found.",
    };
  }

  return {
    title: `${puzzle.title} | Catholic Church Puzzles for Children`,
    description: `${puzzle.instructions} Play encouraging Catholic church puzzles and earn stars on Kid Zone.`,
  };
}

export default async function PuzzleRunnerPage({ params }: PuzzleRunnerPageProps) {
  const { slug } = await params;
  const puzzle = getPuzzleBySlug(slug);

  if (!puzzle) {
    notFound();
  }

  const session = await getActiveLearnerSession();

  return <PuzzleRunnerView puzzle={puzzle} session={session} />;
}
