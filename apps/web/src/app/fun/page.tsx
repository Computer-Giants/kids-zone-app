import type { Metadata } from "next";
import { AnimatedLambGuide, Button, Sparkles } from "@kidzone/ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Catholic Puzzles and Games for Kids",
  description:
    "Fun and faithful church puzzles, quizzes, matching games, and word challenges for children aged 3 to 15.",
};

export default function FunPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 px-4 py-12 text-center sm:py-16">
      <div className="bg-green-tint font-heading text-green-deep inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide">
        <Sparkles className="h-4 w-4" />
        <span>Puzzles and Quizzes</span>
      </div>

      <div className="border-sand-border bg-sand shadow-card-rest rounded-3xl border-2 p-6">
        <AnimatedLambGuide
          size="lg"
          mood="celebrating"
          speechText="Ready to play? Fun faith quizzes and church puzzles with stars are coming soon!"
          speechSpeaker="Guide Lamb"
        />
      </div>

      <div className="max-w-xl space-y-3">
        <h1 className="font-heading text-ink text-3xl font-black tracking-tight sm:text-4xl">
          Games and Faith Puzzles
        </h1>
        <p className="font-body text-ink-soft text-base leading-relaxed sm:text-lg">
          Practice what you have learned with gentle four question quizzes, word search challenges,
          and church item tile matching puzzles.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link href="/quizzes">
          <Button variant="primary" size="lg">
            <Sparkles className="h-5 w-5 shrink-0" />
            <span>Play Faith Quizzes</span>
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg">
            <span>Explore Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
