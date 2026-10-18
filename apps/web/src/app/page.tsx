"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AnimatedLambGuide,
  BookOpen,
  Button,
  Crown,
  DailyReviewCard,
  Gamepad2,
  HelpCircle,
  type LambMood,
  MessageCircle,
  SectionCard,
  Sparkles,
} from "@kidzone/ui";

const GUIDE_TIPS: Record<LambMood, string> = {
  happy:
    "Hello friend! I am your guide lamb. Tap me anytime to hear tips or explore Bible stories!",
  thinking:
    "Did you know? Saint Francis loved all of God's creatures, especially little lambs like me!",
  celebrating: "Hooray! You completed today's lesson and earned golden progress stars!",
  encouraging: "Every step counts! Take your time and remember that God loves you very much.",
};

export default function Home() {
  const [guideMood, setGuideMood] = useState<LambMood>("happy");
  const [showSpeech, setShowSpeech] = useState(true);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center justify-start gap-12 px-4 py-8 sm:px-6 sm:py-16">
      {/* Hero Section */}
      <section className="flex w-full flex-col-reverse items-center justify-between gap-8 md:flex-row md:gap-12">
        <div className="flex max-w-xl flex-col items-start gap-5">
          <div className="bg-orange-tint text-orange-deep font-heading inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide">
            <Sparkles className="h-4 w-4" />
            <span>Catholic Learning Adventure</span>
          </div>

          <h1 className="font-heading text-ink text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Learn and Grow in the Catholic Faith
          </h1>

          <p className="text-ink-soft font-body text-lg font-medium leading-relaxed sm:text-xl">
            Explore sacred Scripture, wonderful saint stories, prayers, quizzes, and church puzzles
            guided by our friendly living lamb companion.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/signup">
              <Button size="lg" variant="primary">
                <Sparkles className="h-6 w-6 shrink-0" />
                <span>Begin Your Journey</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                <span>Parent Sign In</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mascot Lamb Companion in Hero */}
        <div className="flex shrink-0 flex-col items-center">
          <div className="bg-sand border-sand-border shadow-card-rest flex flex-col items-center rounded-3xl border-2 p-6">
            <AnimatedLambGuide
              size="xl"
              mood={guideMood}
              speechText={showSpeech ? GUIDE_TIPS[guideMood] : undefined}
              speechSpeaker="Guide Lamb"
              onSpeechDismiss={() => setShowSpeech(false)}
            />
          </div>
          <span className="font-heading text-ink-soft mt-3 text-xs font-bold">
            Tap the lamb to change mood & hop!
          </span>
        </div>
      </section>

      {/* Daily Spaced Repetition Review Warmup */}
      <section className="w-full">
        <Link href="/review" className="text-decoration-none focus-accessible block rounded-2xl">
          <DailyReviewCard dueCount={3} onStartReview={() => {}} />
        </Link>
      </section>

      {/* Interactive Guide Companion Showcase */}
      <section className="border-sand-border shadow-card-rest w-full space-y-6 rounded-3xl border-2 bg-white p-6 sm:p-8">
        <div className="border-sand-border flex flex-col gap-4 border-b-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-ink text-2xl font-bold sm:text-3xl">
              Living Vector Guide Companion
            </h2>
            <p className="text-ink-soft mt-1 text-sm sm:text-base">
              Pure SVG vector character with eye blinks, ear wiggles, and interactive speech hints.
            </p>
          </div>

          {/* Mood Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {(["happy", "thinking", "celebrating", "encouraging"] as LambMood[]).map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => {
                  setGuideMood(mood);
                  setShowSpeech(true);
                }}
                className={`font-heading min-h-[44px] cursor-pointer rounded-xl px-3.5 py-2 text-xs font-bold capitalize transition-all ${
                  guideMood === mood
                    ? "bg-orange shadow-sticker-orange text-white"
                    : "bg-sand text-ink hover:bg-orange-tint"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Showcase Grid of Animated Lamb Sizes and Expressions */}
        <div className="bg-cream border-sand-border grid grid-cols-2 items-center justify-items-center gap-4 rounded-2xl border-2 p-6 py-4 sm:grid-cols-4">
          <div className="flex flex-col items-center gap-2">
            <AnimatedLambGuide size="sm" mood="happy" interactive={false} />
            <span className="font-heading text-ink-soft text-xs font-bold">Small (64px)</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AnimatedLambGuide size="md" mood="thinking" interactive={false} />
            <span className="font-heading text-ink-soft text-xs font-bold">Thinking (96px)</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AnimatedLambGuide size="lg" mood="celebrating" interactive={false} />
            <span className="font-heading text-ink-soft text-xs font-bold">
              Celebrating (128px)
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AnimatedLambGuide size="md" mood="encouraging" interactive={false} />
            <span className="font-heading text-ink-soft text-xs font-bold">Encouraging (96px)</span>
          </div>
        </div>
      </section>

      {/* Learning Modules Bento */}
      <section className="w-full space-y-6">
        <div className="border-sand-border border-b-2 pb-3">
          <h2 className="font-heading text-ink text-2xl font-bold sm:text-3xl">
            Explore Learning Sections
          </h2>
          <p className="text-ink-soft mt-1 text-sm sm:text-base">
            Every section carries its own theme colour and tap friendly learning cards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/bible" className="focus-accessible text-decoration-none block rounded-3xl">
            <SectionCard
              section="bible"
              title="Children's Bible"
              description="Sacred scripture simplified for young minds with audio read aloud."
              icon={<BookOpen className="text-blue-deep h-8 w-8" />}
              badge="Bible"
            />
          </Link>

          <Link href="/saints" className="focus-accessible text-decoration-none block rounded-3xl">
            <SectionCard
              section="saints"
              title="Saints and Catechism"
              description="Inspiring lives of the holy saints, the seven sacraments, and traditional prayers."
              icon={<Crown className="text-yellow-deep h-8 w-8" />}
              badge="Saints"
            />
          </Link>

          <Link href="/quizzes" className="focus-accessible text-decoration-none block rounded-3xl">
            <SectionCard
              section="quizzes"
              title="Fun Faith Quizzes"
              description="Four question quizzes with gentle retries and encouraging lamb reactions."
              icon={<HelpCircle className="text-red-deep h-8 w-8" />}
              badge="Quizzes"
            />
          </Link>

          <Link href="/fun" className="focus-accessible text-decoration-none block rounded-3xl">
            <SectionCard
              section="games"
              title="Church Puzzles"
              description="Word search, tile matching, and scramble puzzles with sacred themes."
              icon={<Gamepad2 className="text-green-deep h-8 w-8" />}
              badge="Games"
            />
          </Link>

          <Link href="/bible" className="focus-accessible text-decoration-none block rounded-3xl">
            <SectionCard
              section="stories"
              title="Illustrated Stories"
              description="Bedtime stories, virtues, and Gospel parables with beautiful drawings."
              icon={<BookOpen className="text-indigo-deep h-8 w-8" />}
              badge="Stories"
            />
          </Link>

          <Link
            href="/leaderboard"
            className="focus-accessible text-decoration-none block rounded-3xl"
          >
            <SectionCard
              section="saints"
              title="Weekly Stars Leaderboard"
              description="Celebrate faith progress with Catholic friends partitioned by age band."
              icon={<Crown className="text-yellow-deep h-8 w-8" />}
              badge="Stars"
            />
          </Link>

          <Link href="/chat" className="focus-accessible text-decoration-none block rounded-3xl">
            <SectionCard
              section="chat"
              title="Parish and Youth Chat"
              description="Safe moderated discussion rooms for children aged eleven to fifteen."
              icon={<MessageCircle className="text-violet-deep h-8 w-8" />}
              badge="Community"
            />
          </Link>
        </div>
      </section>

      {/* Button Variants Showcase */}
      <section className="border-sand-border shadow-card-rest w-full space-y-6 rounded-3xl border-2 bg-white p-8">
        <h3 className="font-heading text-ink text-xl font-bold sm:text-2xl">
          Accessible Button Palette
        </h3>
        <p className="text-ink-soft text-sm">
          All buttons enforce minimum forty eight pixel tap targets, solid fills, and tactile
          sticker shadows without gradients.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary Standout</Button>
          <Button variant="bible">Bible Blue</Button>
          <Button variant="saints">Saints Gold</Button>
          <Button variant="quizzes">Quiz Coral</Button>
          <Button variant="games">Games Green</Button>
          <Button variant="stories">Stories Indigo</Button>
          <Button variant="chat">Chat Violet</Button>
          <Button variant="parent">Parent Slate</Button>
          <Button variant="outline">Outline White</Button>
        </div>
      </section>
    </div>
  );
}
