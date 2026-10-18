"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  AnimatedLambGuide,
  BookOpen,
  Button,
  Compass,
  Crown,
  Gamepad2,
  HelpCircle,
  type LambMood,
  MessageCircle,
  Play,
  SectionCard,
  ShieldCheck,
  Sparkles,
  Star,
  WaveDivider,
} from "@kidzone/ui";
import { AnalyticsQuestHub } from "../components/analytics-quest-hub";
import { FloatingAppBanner } from "../components/floating-app-banner";
import { ChaplainMissionSection } from "../components/chaplain-mission-section";
import type { LearnerSession } from "../lib/child-session";

const GUIDE_TIPS: Record<LambMood, string> = {
  happy:
    "Hello friend! I am your guide lamb. Tap me anytime to hear tips or explore Bible stories!",
  thinking:
    "Did you know? Saint Francis loved all of God's creatures, especially little lambs like me!",
  celebrating: "Hooray! You completed today's lesson and earned golden progress stars!",
  encouraging: "Every step counts! Take your time and remember that God loves you very much.",
};

export interface HomeViewProps {
  learner?: LearnerSession;
}

export function HomeView({ learner }: HomeViewProps) {
  const [guideMood, setGuideMood] = useState<LambMood>("happy");
  const [showSpeech, setShowSpeech] = useState(true);

  // Derive auth-aware primary hero button label and destination
  const isRegisteredChild = learner && !learner.isGuest;
  const isGuest = learner && learner.isGuest;

  let primaryActionLabel = "Begin Your Journey";
  let primaryActionHref = "/signup";

  if (isRegisteredChild) {
    primaryActionLabel = `Continue ${learner.nickname}'s Journey`;
    primaryActionHref = "/bible";
  } else if (isGuest) {
    primaryActionLabel = "Continue as Guest";
    primaryActionHref = "/bible";
  }

  return (
    <div className="flex w-full flex-col items-center justify-start overflow-x-hidden">
      {/* =========================================================================
          SECTION 1: HERO & LIVING GUIDE LAMB (Warm Cream Canvas)
          ========================================================================= */}
      <section className="bg-cream relative w-full px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 md:pb-20">
        <div className="mx-auto flex max-w-5xl flex-col-reverse items-center justify-between gap-10 md:flex-row md:gap-14">
          {/* Hero Left Column: Typography and Call to Action */}
          <div className="flex max-w-xl flex-col items-start gap-5 text-left">
            {/* Trust announcement badge */}
            <div className="border-orange/20 bg-orange-tint text-orange-deep shadow-xs inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Catholic Faith Adventure — Ages 3 to 15</span>
            </div>

            {/* Display Headline with wide-ridged hand-drawn SVG underline */}
            <h1 className="font-heading text-ink text-4xl font-black leading-[1.14] tracking-tight sm:text-5xl lg:text-6xl">
              Learn, Pray, and Grow with{" "}
              <span className="text-orange-deep relative inline-block whitespace-nowrap">
                Joyful Faith
                <svg
                  className="pointer-events-none absolute -bottom-2.5 left-0 w-full overflow-visible"
                  viewBox="0 0 240 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 11 C40 3, 75 16, 115 7 C155 -1, 190 15, 237 6"
                    stroke="#ff7a1a"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 14 C42 6, 80 18, 120 10 C160 2, 195 16, 234 9"
                    stroke="#ffb366"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle / Prose */}
            <p className="font-body text-ink-soft text-base font-medium leading-relaxed sm:text-lg">
              Explore sacred Scripture, wonderful saint stories, prayers, quizzes, and reverent
              church tours guided by our friendly living lamb companion.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href={primaryActionHref}>
                <Button size="lg" variant="primary">
                  <Sparkles className="h-6 w-6 shrink-0" />
                  <span>{primaryActionLabel}</span>
                </Button>
              </Link>

              <a href="#explore-sections">
                <Button size="lg" variant="outline">
                  <Compass className="text-orange-deep h-5 w-5 shrink-0" />
                  <span>Explore</span>
                </Button>
              </a>
            </div>

            {/* Quick Trust Highlights Strip */}
            <div className="divide-sand-border text-ink-soft mt-4 flex flex-wrap items-center gap-y-2 divide-x pt-2 text-xs font-bold">
              <div className="pr-3.5">
                <span className="font-heading text-ink text-sm font-extrabold">50+</span> Bible
                Lessons
              </div>
              <div className="px-3.5">
                <span className="font-heading text-ink text-sm font-extrabold">100+</span> Holy
                Saints
              </div>
              <div className="px-3.5">
                <span className="font-heading text-green-deep text-sm font-extrabold">100%</span>{" "}
                Priest Reviewed
              </div>
              <div className="pl-3.5">
                <span className="font-heading text-ink text-sm font-extrabold">0</span> Ads &
                Trackers
              </div>
            </div>
          </div>

          {/* Hero Right Column: Living Vector Guide Lamb with Tooltip */}
          <div className="relative flex h-full shrink-0 flex-col items-end justify-end">
            {/* Organic arched halo backdrop behind the mascot */}
            <div
              aria-hidden="true"
              className="bg-sand/60 pointer-events-none absolute -inset-4 rounded-full blur-xl sm:-inset-8"
            />

            {/* Guide Lamb with absolute floating tooltip speech bubble (Zero layout shift) */}
            <div className="relative z-10 flex flex-col items-center">
              <AnimatedLambGuide
                size="xl"
                mood={guideMood}
                speechPosition="tooltip"
                speechText={showSpeech ? GUIDE_TIPS[guideMood] : undefined}
                speechSpeaker="Guide Lamb"
                onSpeechDismiss={() => setShowSpeech(false)}
                interactive={true}
              />

              {/* Mood selector reaction pills */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                {(["happy", "thinking", "celebrating", "encouraging"] as LambMood[]).map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => {
                      setGuideMood(mood);
                      setShowSpeech(true);
                    }}
                    className={`font-heading min-h-[44px] cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                      guideMood === mood
                        ? "bg-orange shadow-sticker-orange text-white"
                        : "text-ink border-sand-border hover:bg-orange-tint border bg-white"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>

              <span className="font-heading text-ink-soft mt-2 text-[11px] font-bold">
                Tap the lamb to hear a tip & hop!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Transition 1: Cream to Sand */}
      <WaveDivider fillColor="var(--color-sand)" position="top" />

      {/* =========================================================================
          SECTION 2: TODAY'S SACRED QUEST & ANALYTICS HUB (Sand Canvas)
          ========================================================================= */}
      <section className="bg-sand relative w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <AnalyticsQuestHub
            streakDays={isRegisteredChild ? 3 : 0}
            weeklyStars={isRegisteredChild ? 12 : 0}
            reviewsDue={3}
            isAuthenticated={Boolean(isRegisteredChild)}
          />
        </div>
      </section>

      {/* Wave Transition 2: Sand to White */}
      <WaveDivider fillColor="var(--color-white)" position="top" flipX={true} />

      {/* =========================================================================
          SECTION 3: EXPLORE LEARNING TRACKS (Enriched Bento Grid)
          ========================================================================= */}
      <section
        id="explore-sections"
        className="relative w-full bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20"
      >
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Section Header */}
          <div className="border-sand-border flex flex-col gap-2 border-b-2 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="bg-blue-tint text-blue-deep inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Faith Tracks</span>
              </div>
              <h2 className="font-heading text-ink text-3xl font-black tracking-tight sm:text-4xl">
                Explore Learning Sections
              </h2>
            </div>
            <p className="font-body text-ink-soft text-sm font-medium">
              Every section carries its own theme color and tap friendly interactive cards.
            </p>
          </div>

          {/* Enriched Bento Grid with Motion Shared Layout */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Featured Card 1: Children's Bible (Larger footprint) */}
            <motion.div
              layoutId="feature-card-bible"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="sm:col-span-2 lg:col-span-2"
            >
              <Link
                href="/bible"
                className="focus-accessible text-decoration-none block rounded-3xl"
              >
                <SectionCard
                  section="bible"
                  title="Children's Sacred Scripture"
                  description="Explore sacred scripture simplified for young minds with full audio narration, beautiful illustrations, and verse memory quests."
                  icon={<BookOpen className="text-blue-deep h-10 w-10" />}
                  badge="Featured Scripture"
                  className="bg-blue-tint/60 hover:border-blue-deep min-h-[220px]"
                />
              </Link>
            </motion.div>

            {/* Featured Card 2: Church Tour (Interactive 3D scenes) */}
            <motion.div
              layoutId="feature-card-tour"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/church-tour"
                className="focus-accessible text-decoration-none block rounded-3xl"
              >
                <SectionCard
                  section="saints"
                  title="Inside the Church Tour"
                  description="Walk through five sacred rooms of a Catholic church, tap holy objects, and learn reverence."
                  icon={<Compass className="text-yellow-deep h-9 w-9" />}
                  badge="Interactive Tour"
                />
              </Link>
            </motion.div>

            {/* Standard Card 3: Saints and Catechism */}
            <motion.div
              layoutId="feature-card-saints"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/saints"
                className="focus-accessible text-decoration-none block rounded-3xl"
              >
                <SectionCard
                  section="saints"
                  title="Saints & Catechism"
                  description="Inspiring lives of the holy saints, the seven sacraments, and traditional Catholic prayers."
                  icon={<Crown className="text-yellow-deep h-8 w-8" />}
                  badge="Saints"
                />
              </Link>
            </motion.div>

            {/* Standard Card 4: Fun Faith Quizzes */}
            <motion.div
              layoutId="feature-card-quizzes"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/quizzes"
                className="focus-accessible text-decoration-none block rounded-3xl"
              >
                <SectionCard
                  section="quizzes"
                  title="Fun Faith Quizzes"
                  description="Four question quizzes with gentle encouraging retries and celebratory stars."
                  icon={<HelpCircle className="text-red-deep h-8 w-8" />}
                  badge="Quizzes"
                />
              </Link>
            </motion.div>

            {/* Standard Card 5: Church Puzzles */}
            <motion.div
              layoutId="feature-card-games"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/fun" className="focus-accessible text-decoration-none block rounded-3xl">
                <SectionCard
                  section="games"
                  title="Church Puzzles"
                  description="Word search, tile matching, and scramble puzzles with sacred themes."
                  icon={<Gamepad2 className="text-green-deep h-8 w-8" />}
                  badge="Puzzles"
                />
              </Link>
            </motion.div>

            {/* Standard Card 6: Illustrated Stories */}
            <motion.div
              layoutId="feature-card-stories"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/bible"
                className="focus-accessible text-decoration-none block rounded-3xl"
              >
                <SectionCard
                  section="stories"
                  title="Illustrated Stories"
                  description="Bedtime stories, virtues, and Gospel parables with beautiful color drawings."
                  icon={<BookOpen className="text-indigo-deep h-8 w-8" />}
                  badge="Stories"
                />
              </Link>
            </motion.div>

            {/* Standard Card 7: Weekly Stars Leaderboard */}
            <motion.div
              layoutId="feature-card-leaderboard"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/leaderboard"
                className="focus-accessible text-decoration-none block rounded-3xl"
              >
                <SectionCard
                  section="saints"
                  title="Weekly Stars"
                  description="Celebrate faith progress with Catholic friends partitioned safely by age band."
                  icon={<Crown className="text-yellow-deep h-8 w-8" />}
                  badge="Leaderboard"
                />
              </Link>
            </motion.div>

            {/* Standard Card 8: Parish & Youth Chat */}
            <motion.div
              layoutId="feature-card-chat"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/chat"
                className="focus-accessible text-decoration-none block rounded-3xl"
              >
                <SectionCard
                  section="chat"
                  title="Parish Youth Chat"
                  description="Safe moderated discussion rooms for young Catholics aged eleven to fifteen."
                  icon={<MessageCircle className="text-violet-deep h-8 w-8" />}
                  badge="Community"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wave Transition 3: White to Cream */}
      <WaveDivider fillColor="var(--color-cream)" position="top" />

      {/* =========================================================================
          SECTION 4: PARENT ASSURANCE & VIDEO TUTORIAL WALKTHROUGH (Cream Canvas)
          ========================================================================= */}
      <section className="bg-cream relative w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Catholic Faith Trust & Reviewer Seal Banner */}
          <div className="border-sand-border shadow-card-rest flex flex-col gap-6 rounded-3xl border-2 bg-white p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-green-tint text-green-deep flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-heading text-ink text-xl font-bold sm:text-2xl">
                  Priest Reviewed and Parent Held
                </h3>
                <p className="font-body text-ink-soft mt-1 text-sm leading-relaxed sm:text-base">
                  Nothing reaches a child without human review. Children never enter personal data,
                  and progress stays private to your household account.
                </p>
              </div>
            </div>

            <Link href="/parent">
              <Button variant="parent" size="md">
                <span>Parent Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Video Tutorial Walkthrough Preview */}
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <div className="border-orange/20 bg-orange-tint text-orange-deep shadow-xs inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-black uppercase tracking-wider">
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Interactive Walkthrough</span>
              </div>
              <h3 className="font-heading text-ink mt-2 text-2xl font-black sm:text-3xl">
                See Kid Zone in Action
              </h3>
              <p className="font-body text-ink-soft mt-1 max-w-2xl text-sm leading-relaxed sm:text-base">
                Watch how children navigate Scripture, practice daily prayers, and earn progress
                stars with their friendly lamb guide.
              </p>
            </div>

            {/* Video Player Frame with interactive video player */}
            <div className="border-sand-border bg-ink shadow-sticker-sand relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-3xl border-2">
              <video
                src="/kid-zone-showcase-clean.mp4"
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              >
                <source src="/kid-zone-showcase-clean.mp4" type="video/mp4" />
                Your browser does not support playing this video.
              </video>
            </div>

            {/* Video Chapter Highlights */}
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 pt-2">
              <span className="border-sand-border font-heading text-ink shadow-xs rounded-xl border bg-white px-3 py-1 text-xs font-bold">
                0:00 Living Lamb Guide
              </span>
              <span className="border-sand-border font-heading text-ink shadow-xs rounded-xl border bg-white px-3 py-1 text-xs font-bold">
                0:45 Bible Read Aloud
              </span>
              <span className="border-sand-border font-heading text-ink shadow-xs rounded-xl border bg-white px-3 py-1 text-xs font-bold">
                1:20 Inside Church Tour
              </span>
              <span className="border-sand-border font-heading text-ink shadow-xs rounded-xl border bg-white px-3 py-1 text-xs font-bold">
                1:55 Parent Gate & Safety
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Transition 4: Cream to White */}
      <WaveDivider fillColor="var(--color-white)" position="top" flipX={true} />

      {/* =========================================================================
          SECTION 5: CATHOLIC REVIEWS & ENDORSEMENTS (White Canvas)
          ========================================================================= */}
      <section className="relative w-full bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* Section Header */}
          <div className="text-center sm:text-left">
            <div className="border-yellow-deep/20 bg-yellow-tint text-yellow-deep shadow-xs inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-black uppercase tracking-wider">
              <Star className="h-4 w-4 fill-current" />
              <span>Loved by Catholic Families</span>
            </div>
            <h2 className="font-heading text-ink mt-2 text-3xl font-black sm:text-4xl">
              Trusted by Parents, Catechists, and Priests
            </h2>
            <p className="font-body text-ink-soft mt-1 max-w-2xl text-base sm:text-lg">
              Read how Catholic families and parish communities use Kid Zone for joyful daily
              formation.
            </p>
          </div>

          {/* 3 Testimonial Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Review 1 */}
            <div className="border-sand-border bg-cream shadow-card-rest flex flex-col justify-between rounded-3xl border-2 p-6 transition-transform hover:-translate-y-1">
              <div>
                {/* 5 Stars */}
                <div className="text-yellow-deep flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="font-body text-ink mt-4 text-sm font-medium leading-relaxed">
                  &ldquo;Every lesson is reverent, doctrinally accurate, and beautifully presented.
                  In a world full of distracting media, Kid Zone is an oasis of genuine Catholic
                  truth for children.&rdquo;
                </p>
              </div>
              <div className="border-sand-border mt-6 flex items-center gap-3 border-t pt-4">
                <div className="bg-blue-tint font-heading text-blue-deep flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold">
                  FT
                </div>
                <div>
                  <h4 className="font-heading text-ink text-sm font-bold">Fr. Thomas M.</h4>
                  <p className="font-body text-ink-soft text-xs">
                    Parochial Vicar and Youth Chaplain
                  </p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="border-sand-border bg-cream shadow-card-rest flex flex-col justify-between rounded-3xl border-2 p-6 transition-transform hover:-translate-y-1">
              <div>
                {/* 5 Stars */}
                <div className="text-yellow-deep flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="font-body text-ink mt-4 text-sm font-medium leading-relaxed">
                  &ldquo;Our children love the interactive church tour and bedtime Scripture
                  stories. Knowing that there are zero advertisements and no data tracking gives us
                  complete peace of mind.&rdquo;
                </p>
              </div>
              <div className="border-sand-border mt-6 flex items-center gap-3 border-t pt-4">
                <div className="bg-orange-tint font-heading text-orange-deep flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold">
                  MD
                </div>
                <div>
                  <h4 className="font-heading text-ink text-sm font-bold">Maria & David C.</h4>
                  <p className="font-body text-ink-soft text-xs">Parents of three children</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="border-sand-border bg-cream shadow-card-rest flex flex-col justify-between rounded-3xl border-2 p-6 transition-transform hover:-translate-y-1">
              <div>
                {/* 5 Stars */}
                <div className="text-yellow-deep flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="font-body text-ink mt-4 text-sm font-medium leading-relaxed">
                  &ldquo;The age banding makes differentiated faith learning seamless. The read
                  aloud voice and saint quizzes help my catechism students absorb the Faith with
                  great joy!&rdquo;
                </p>
              </div>
              <div className="border-sand-border mt-6 flex items-center gap-3 border-t pt-4">
                <div className="bg-green-tint font-heading text-green-deep flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold">
                  SC
                </div>
                <div>
                  <h4 className="font-heading text-ink text-sm font-bold">
                    Sister Catherine, O.P.
                  </h4>
                  <p className="font-body text-ink-soft text-xs">Diocesan Religious Educator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Transition 5: White to Sand */}
      <WaveDivider fillColor="var(--color-sand)" position="top" />

      {/* =========================================================================
          SECTION 6: CHAPLAIN ABOUT, COMMUNITY GALLERY & SUPPORT HUB (Sand Canvas)
          ========================================================================= */}
      <ChaplainMissionSection isAuthenticatedChild={Boolean(isRegisteredChild)} />

      {/* Wave Transition 6: Sand to Cream */}
      <WaveDivider fillColor="var(--color-cream)" position="top" flipX={true} />

      {/* =========================================================================
          FOOTER: STORYBOOK CATHOLIC NAVIGATION & ASSURANCE
          ========================================================================= */}
      <footer className="bg-cream relative w-full px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand & Purpose */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-orange shadow-sticker-orange font-heading flex h-10 w-10 items-center justify-center rounded-2xl text-xl font-black text-white">
                  KZ
                </div>
                <div>
                  <h3 className="font-heading text-ink text-lg font-black tracking-tight">
                    Kid Zone
                  </h3>
                  <p className="font-body text-ink-soft text-xs font-semibold">
                    Catholic Faith Adventure
                  </p>
                </div>
              </div>
              <p className="font-body text-ink-soft text-sm leading-relaxed">
                Guiding children aged 3 to 15 to know, love, and live the Catholic Faith through
                sacred Scripture, holy saints, prayer, and reverent play.
              </p>
              <div className="border-green-deep/20 bg-green-tint text-green-deep inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>Priest Reviewed & Verified</span>
              </div>
            </div>

            {/* Faith Tracks */}
            <div className="space-y-3">
              <h4 className="font-heading text-ink text-sm font-bold uppercase tracking-wider">
                Explore Faith
              </h4>
              <ul className="font-body text-ink-soft space-y-2 text-sm font-medium">
                <li>
                  <Link href="/bible" className="hover:text-orange-deep transition-colors">
                    Children&apos;s Bible
                  </Link>
                </li>
                <li>
                  <Link href="/saints" className="hover:text-orange-deep transition-colors">
                    Holy Saints & Catechism
                  </Link>
                </li>
                <li>
                  <Link href="/church-tour" className="hover:text-orange-deep transition-colors">
                    Inside Church Tour
                  </Link>
                </li>
                <li>
                  <Link href="/quizzes" className="hover:text-orange-deep transition-colors">
                    Faith Quizzes
                  </Link>
                </li>
                <li>
                  <Link href="/fun" className="hover:text-orange-deep transition-colors">
                    Church Puzzles & Games
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-orange-deep text-orange-deep font-bold transition-colors"
                  >
                    About Chaplain & Mission
                  </Link>
                </li>
              </ul>
            </div>

            {/* Household & Family */}
            <div className="space-y-3">
              <h4 className="font-heading text-ink text-sm font-bold uppercase tracking-wider">
                For Parents
              </h4>
              <ul className="font-body text-ink-soft space-y-2 text-sm font-medium">
                <li>
                  <Link href="/parent" className="hover:text-orange-deep transition-colors">
                    Parent Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/parent" className="hover:text-orange-deep transition-colors">
                    Household PIN Gate
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-orange-deep transition-colors">
                    Support Free Classes
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-orange-deep transition-colors">
                    Weekly Stars Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="hover:text-orange-deep transition-colors">
                    Parish Youth Chat (Ages 11 to 15)
                  </Link>
                </li>
                <li>
                  <Link href="/download" className="hover:text-orange-deep transition-colors">
                    Download Tablet App
                  </Link>
                </li>
              </ul>
            </div>

            {/* Safeguarding & Trust */}
            <div className="space-y-3">
              <h4 className="font-heading text-ink text-sm font-bold uppercase tracking-wider">
                Child Safeguarding
              </h4>
              <ul className="font-body text-ink-soft space-y-2 text-sm font-medium">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="text-green-deep h-4 w-4 shrink-0" />
                  <span>Zero Advertising</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="text-green-deep h-4 w-4 shrink-0" />
                  <span>No Personal Data Tracking</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="text-green-deep h-4 w-4 shrink-0" />
                  <span>Parent Managed Accounts</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="text-green-deep h-4 w-4 shrink-0" />
                  <span>100% Priest Reviewed Content</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Doctrine Attribution */}
          <div className="border-sand-border text-ink-soft mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-center text-xs font-medium sm:flex-row sm:text-left">
            <p>
              &copy; {new Date().getFullYear()} Kid Zone Catholic Learning. Grounded in Scripture
              and holy tradition.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/parent" className="hover:text-ink">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/parent" className="hover:text-ink">
                Safeguarding Standards
              </Link>
              <span>•</span>
              <Link href="/parent" className="hover:text-ink">
                Review Process
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating App Download Banner (Autoshows & dismissible) */}
      <FloatingAppBanner />
    </div>
  );
}
