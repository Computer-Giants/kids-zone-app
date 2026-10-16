"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { SeedQuiz } from "@kidzone/db";
import { BookOpen, Crown, HelpCircle, MascotLamb, QuizCard, Sparkles } from "@kidzone/ui";
import type { LearnerSession } from "@/lib/child-session";

export interface QuizzesIndexViewProps {
  quizzes: readonly SeedQuiz[];
  session: LearnerSession;
}

type CategoryFilter = "all" | "bible" | "saints" | "catechism" | "seasons";

export function QuizzesIndexView({ quizzes, session }: QuizzesIndexViewProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryFilter>("all");

  const filteredQuizzes = React.useMemo(() => {
    if (selectedCategory === "all") return quizzes;
    return quizzes.filter((q) => q.category === selectedCategory);
  }, [quizzes, selectedCategory]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 sm:py-12">
      {/* Header */}
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="bg-red-tint font-heading text-red-deep inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Joyful Faith Discovery</span>
        </div>

        <h1 className="font-heading text-ink text-3xl font-black tracking-tight sm:text-5xl">
          Fun Faith Quizzes
        </h1>

        <p className="font-body text-ink/80 max-w-2xl text-base font-medium leading-relaxed sm:text-lg">
          {session && !session.isGuest
            ? `Ready to play, ${session.nickname}? Answer 4 quick questions with our friendly lamb guide to earn golden stars!`
            : "Four friendly questions to celebrate how much you know about God, the Bible, and the Saints. Take your time and have fun!"}
        </p>
      </header>

      {/* Guide Companion Tip */}
      <div className="border-sand-border bg-sand/30 flex items-center gap-4 rounded-3xl border-2 p-5 sm:p-6">
        <MascotLamb size="sm" mood="happy" />
        <p className="font-body text-ink/90 text-sm font-medium leading-relaxed sm:text-base">
          <strong>Lamb tip:</strong> In Kid Zone quizzes, there are never any red cross marks or
          penalties! If you are unsure, I will help you with a friendly hint.
        </p>
      </div>

      {/* Category Tabs (AC-1) */}
      <section aria-labelledby="quizzes-catalog-heading" className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="quizzes-catalog-heading"
            className="font-heading text-ink text-xl font-black tracking-tight sm:text-2xl"
          >
            Choose a Quiz ({filteredQuizzes.length})
          </h2>
        </div>

        {/* Filter buttons */}
        <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            aria-pressed={selectedCategory === "all"}
            className={`font-heading focus-accessible inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
              selectedCategory === "all"
                ? "bg-blue-deep shadow-sticker-blue text-white"
                : "bg-sand text-ink hover:bg-sand-border border-sand-border border"
            }`}
          >
            <span>All Categories</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("bible")}
            aria-pressed={selectedCategory === "bible"}
            className={`font-heading focus-accessible inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
              selectedCategory === "bible"
                ? "bg-blue-deep shadow-sticker-blue text-white"
                : "bg-sand text-ink hover:bg-sand-border border-sand-border border"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Bible</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("saints")}
            aria-pressed={selectedCategory === "saints"}
            className={`font-heading focus-accessible inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
              selectedCategory === "saints"
                ? "bg-blue-deep shadow-sticker-blue text-white"
                : "bg-sand text-ink hover:bg-sand-border border-sand-border border"
            }`}
          >
            <Crown className="h-3.5 w-3.5" />
            <span>Saints</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("catechism")}
            aria-pressed={selectedCategory === "catechism"}
            className={`font-heading focus-accessible inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
              selectedCategory === "catechism"
                ? "bg-blue-deep shadow-sticker-blue text-white"
                : "bg-sand text-ink hover:bg-sand-border border-sand-border border"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Catechism</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("seasons")}
            aria-pressed={selectedCategory === "seasons"}
            className={`font-heading focus-accessible inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
              selectedCategory === "seasons"
                ? "bg-blue-deep shadow-sticker-blue text-white"
                : "bg-sand text-ink hover:bg-sand-border border-sand-border border"
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Church Seasons</span>
          </button>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              slug={quiz.slug}
              title={quiz.title}
              description={quiz.description}
              category={quiz.category}
              minAge={quiz.minAge}
              maxAge={quiz.maxAge}
              questionCount={quiz.questions.length}
              onSelect={() => router.push(`/quizzes/${quiz.slug}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
