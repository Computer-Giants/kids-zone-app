"use client";

import Link from "next/link";
import { BookOpen, DailyReviewCard, Flame, Sparkles, Star } from "@kidzone/ui";

export interface AnalyticsQuestHubProps {
  streakDays?: number;
  weeklyStars?: number;
  reviewsDue?: number;
  scriptureReference?: string;
  scriptureText?: string;
  onStartReview?: () => void;
  isAuthenticated?: boolean;
}

export function AnalyticsQuestHub({
  streakDays = 0,
  weeklyStars = 0,
  reviewsDue = 3,
  scriptureReference = "Psalm 23:1",
  scriptureText = "The Lord is my shepherd; I have everything I need.",
  onStartReview,
  isAuthenticated = false,
}: AnalyticsQuestHubProps) {
  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="bg-sand text-orange-deep inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Today's Sacred Quest</span>
          </div>
          <h2 className="font-heading text-ink text-2xl font-black tracking-tight sm:text-3xl">
            Faith Habits and Daily Progress
          </h2>
        </div>
        <p className="font-body text-ink-soft text-sm font-medium">
          {isAuthenticated
            ? "Your active faith progress this week"
            : "Explore what children achieve every day in Kid Zone"}
        </p>
      </div>

      {/* Bento Analytics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Streak Flame Card */}
        <div className="border-orange/20 bg-orange-tint shadow-card-rest hover:shadow-card-hover group relative flex flex-col justify-between rounded-3xl border-2 p-6 transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="text-orange shadow-xs flex h-14 w-14 items-center justify-center rounded-2xl bg-white transition-transform group-hover:scale-105">
              <Flame className="fill-orange text-orange-deep h-8 w-8" />
            </div>
            <span className="font-heading text-orange-deep shadow-xs rounded-full bg-white px-3 py-1 text-xs font-extrabold">
              {streakDays > 0 ? "Active Habit" : "Start Today"}
            </span>
          </div>

          <div className="mt-4">
            <span className="font-heading text-ink text-3xl font-black sm:text-4xl">
              {streakDays > 0 ? `${streakDays} Days` : "Day 1"}
            </span>
            <h3 className="font-heading text-ink mt-1 text-lg font-bold">
              Prayer and Learning Streak
            </h3>
            <p className="font-body text-ink-soft mt-1 text-sm leading-relaxed">
              {streakDays > 0
                ? "Wonderful commitment! Keep your sacred faith habit shining bright."
                : "Every sacred lesson adds to your habit. Complete a story or prayer today!"}
            </p>
          </div>
        </div>

        {/* Weekly Stars Card */}
        <div className="border-yellow-deep/20 bg-yellow-tint shadow-card-rest hover:shadow-card-hover group relative flex flex-col justify-between rounded-3xl border-2 p-6 transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="text-yellow-deep shadow-xs flex h-14 w-14 items-center justify-center rounded-2xl bg-white transition-transform group-hover:scale-105">
              <Star className="fill-yellow text-yellow-deep h-8 w-8" />
            </div>
            <span className="font-heading text-yellow-deep shadow-xs rounded-full bg-white px-3 py-1 text-xs font-extrabold">
              Weekly Stars
            </span>
          </div>

          <div className="mt-4">
            <span className="font-heading text-ink text-3xl font-black sm:text-4xl">
              {weeklyStars} Stars
            </span>
            <h3 className="font-heading text-ink mt-1 text-lg font-bold">Golden Progress Stars</h3>
            <p className="font-body text-ink-soft mt-1 text-sm leading-relaxed">
              Earned by reading sacred scripture, answering quiz questions, and reverent church
              tours.
            </p>
          </div>
        </div>

        {/* Daily Scripture Verse Card */}
        <Link
          href="/bible"
          className="border-blue-deep/20 bg-blue-tint text-decoration-none shadow-card-rest hover:shadow-card-hover group relative flex flex-col justify-between rounded-3xl border-2 p-6 transition-all duration-200 hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div className="text-blue-deep shadow-xs flex h-14 w-14 items-center justify-center rounded-2xl bg-white transition-transform group-hover:scale-105">
              <BookOpen className="text-blue-deep h-8 w-8" />
            </div>
            <span className="font-heading text-blue-deep shadow-xs rounded-full bg-white px-3 py-1 text-xs font-extrabold">
              Scripture
            </span>
          </div>

          <div className="mt-4">
            <span className="font-heading text-blue-deep text-xs font-bold uppercase tracking-wider">
              {scriptureReference}
            </span>
            <blockquote className="font-scripture text-ink mt-1 text-base font-semibold italic leading-relaxed sm:text-lg">
              "{scriptureText}"
            </blockquote>
            <p className="font-heading text-blue-deep mt-2 text-xs font-bold">
              Tap to open Children's Bible with Audio →
            </p>
          </div>
        </Link>
      </div>

      {/* Daily Spaced Review Warmup Strip */}
      <div className="w-full">
        <Link href="/review" className="text-decoration-none focus-accessible block rounded-3xl">
          <DailyReviewCard dueCount={reviewsDue} onStartReview={onStartReview ?? (() => {})} />
        </Link>
      </div>
    </section>
  );
}
