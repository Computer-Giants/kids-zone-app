import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuizBySlug, SEED_QUIZZES } from "@kidzone/db";
import { getActiveLearnerSession } from "@/lib/child-session";
import { QuizRunnerView } from "./quiz-runner-view";

interface QuizPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SEED_QUIZZES.map((quiz) => ({
    slug: quiz.slug,
  }));
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { slug } = await params;
  const quiz = getQuizBySlug(slug);

  if (!quiz) {
    return {
      title: "Quiz Not Found | Kid Zone",
    };
  }

  return {
    title: `${quiz.title} | Catholic Faith Quizzes for Kids`,
    description: quiz.description,
  };
}

export default async function QuizRunnerPage({ params }: QuizPageProps) {
  const { slug } = await params;
  const quiz = getQuizBySlug(slug);

  if (!quiz) {
    notFound();
  }

  const session = await getActiveLearnerSession();

  return <QuizRunnerView quiz={quiz} session={session} />;
}
