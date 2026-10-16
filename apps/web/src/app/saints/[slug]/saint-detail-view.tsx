"use client";

import * as React from "react";
import Link from "next/link";
import type { SeedSaint } from "@kidzone/db";
import {
  ArrowLeft,
  AudioPlayer,
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  House,
  MapPin,
  MascotLamb,
  PatronageBadge,
  Sparkles,
} from "@kidzone/ui";
import type { LearnerSession } from "@/lib/child-session";
import { recordReadingProgress } from "@/lib/reading-progress";
import { useSpeech } from "@/lib/use-speech";

export type SaintReadingMode = "story" | "facts" | "bio";

export interface SaintDetailViewProps {
  saint: SeedSaint;
  session: LearnerSession;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function SaintDetailView({ saint, session }: SaintDetailViewProps) {
  // Determine default mode by age band (AC-4, AC-5, AC-6)
  const getDefaultMode = React.useCallback((): SaintReadingMode => {
    const band = session?.ageBand;
    if (band === "b3_7" && saint.story) return "story";
    if (band === "b8_10") return "facts";
    if (band === "b11_15") return "bio";
    if (saint.story) return "story";
    return "facts";
  }, [session?.ageBand, saint.story]);

  const [mode, setMode] = React.useState<SaintReadingMode>(getDefaultMode);
  const [currentPage, setCurrentPage] = React.useState(0);

  // Completion state
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [starsAwarded, setStarsAwarded] = React.useState<number | null>(null);
  const [isSavingProgress, setIsSavingProgress] = React.useState(false);

  // Audio speech
  const speech = useSpeech();

  const monthName = MONTH_NAMES[saint.feastMonth - 1] ?? "";
  const feastFormatted = monthName
    ? `${monthName} ${saint.feastDay}`
    : `Feast: ${saint.feastMonth}/${saint.feastDay}`;

  const yearsFormatted =
    saint.birthYear && saint.deathYear
      ? `${saint.birthYear} to ${saint.deathYear} AD`
      : saint.birthYear
        ? `Born ${saint.birthYear} AD`
        : saint.deathYear
          ? `Died ${saint.deathYear} AD`
          : saint.eraLabel;

  // Build speech text for current mode
  const getSpeechText = React.useCallback(() => {
    if (mode === "story" && saint.story) {
      const page = saint.story.pages[currentPage];
      if (page) {
        return `Page ${page.position} of ${saint.story.pages.length}. ${page.text}`;
      }
      return `${saint.story.title}. ${saint.story.summary}`;
    }

    if (mode === "facts") {
      const factsText = saint.funFacts.map((f) => `Fact ${f.position}: ${f.text}`).join(". ");
      const virtuesText =
        saint.virtueTags.length > 0 ? `Virtues: ${saint.virtueTags.join(", ")}.` : "";
      return `${saint.title} ${saint.name}. ${saint.tagline}. ${virtuesText} ${factsText}`;
    }

    // Bio mode
    const placesText = saint.places
      .map((p) => `${p.placeName} (${p.kind}): ${p.note || ""}`)
      .join(". ");
    return `${saint.title} ${saint.name}, ${saint.eraLabel}. Patron of ${saint.patronages.join(", ")}. Holy Places: ${placesText}. Prayer: ${saint.prayer}`;
  }, [mode, saint, currentPage]);

  const handleToggleAudio = () => {
    if (speech.isPlaying) {
      speech.stop();
    } else {
      const textToRead = getSpeechText();
      speech.speak(textToRead);
    }
  };

  const handleCompleteReading = async () => {
    if (isCompleted || isSavingProgress) return;
    setIsSavingProgress(true);

    const contentId = `saint-${saint.slug}`;
    const childId = session && !session.isGuest ? session.id : undefined;

    const result = await recordReadingProgress({
      contentId,
      childId,
      entityType: mode === "story" ? "saint_story" : "saint",
    });

    setIsSavingProgress(false);
    setIsCompleted(true);
    setStarsAwarded(result.starsAwarded);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 sm:py-12">
      {/* Top Navigation Back link */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between">
        <Link
          href="/saints"
          onClick={() => speech.stop()}
          className="bg-sand font-heading text-ink hover:bg-sand-border focus-accessible border-sand-border inline-flex min-h-[44px] items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-black transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All Saints</span>
        </Link>

        <Link
          href="/"
          onClick={() => speech.stop()}
          className="bg-sand text-ink/70 hover:text-ink focus-accessible inline-flex min-h-[44px] items-center gap-2 rounded-2xl px-3 py-2 transition-all"
          aria-label="Return to home screen"
        >
          <House className="h-4 w-4" />
        </Link>
      </nav>

      {/* AC-3: Saint Profile Header */}
      <header className="border-sand-border via-sand/20 to-yellow-tint/20 shadow-card-rest space-y-5 rounded-3xl border-2 bg-gradient-to-b from-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-yellow font-heading text-ink shadow-sticker-yellow inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-black">
              <Calendar className="text-blue-deep h-3.5 w-3.5" />
              <span>{feastFormatted}</span>
            </span>
            <span className="bg-sand font-heading text-ink/80 border-sand-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
              <span>{yearsFormatted}</span>
            </span>
            {saint.countryCodes.length > 0 && (
              <span className="bg-sand font-heading text-ink/70 border-sand-border inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold">
                <MapPin className="h-3 w-3" />
                <span>{saint.countryCodes.join(", ")}</span>
              </span>
            )}
          </div>

          {/* Audio read aloud toggle */}
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={speech.isPlaying ? "Pause narration" : "Listen to audio narration"}
            className="bg-blue-tint font-heading text-blue-deep hover:bg-blue focus-accessible inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all hover:text-white"
          >
            <span>{speech.isPlaying ? "Pause Voice" : "Listen Aloud"}</span>
          </button>
        </div>

        <div className="flex items-start gap-5">
          <div className="bg-yellow-tint border-yellow text-yellow-deep shadow-sticker-yellow flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border-2 sm:h-20 sm:w-20">
            <HeartHandshake className="h-9 w-9 sm:h-11 sm:w-11" />
          </div>

          <div className="space-y-1">
            <div className="font-heading text-blue-deep text-xs font-black uppercase tracking-wider sm:text-sm">
              {saint.title} {saint.eraLabel}
            </div>
            <h1 className="font-heading text-ink text-2xl font-black tracking-tight sm:text-4xl">
              {saint.name}
            </h1>
            <p className="font-body text-ink/85 text-sm font-medium leading-relaxed sm:text-base">
              {saint.tagline}
            </p>
          </div>
        </div>

        {/* Patronages and Virtues */}
        <div className="border-sand-border/70 space-y-2 border-t pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-heading text-ink/60 text-xs font-bold uppercase tracking-wider">
              Patron of:
            </span>
            {saint.patronages.map((p) => (
              <PatronageBadge key={p} label={p.charAt(0).toUpperCase() + p.slice(1)} />
            ))}
          </div>
        </div>
      </header>

      {/* Tri Mode Reading Selector (AC-4, AC-5, AC-6) */}
      <nav aria-label="Reading modes" className="flex items-center justify-center">
        <div className="bg-sand border-sand-border inline-flex gap-1 rounded-2xl border p-1.5">
          {saint.story && (
            <button
              type="button"
              data-testid="mode-story-btn"
              onClick={() => {
                speech.stop();
                setMode("story");
              }}
              className={`font-heading inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all sm:text-sm ${
                mode === "story"
                  ? "text-blue-deep bg-white shadow-sm"
                  : "text-ink/70 hover:text-ink"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Picture Story (Ages 3 to 7)</span>
            </button>
          )}

          <button
            type="button"
            data-testid="mode-facts-btn"
            onClick={() => {
              speech.stop();
              setMode("facts");
            }}
            className={`font-heading inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all sm:text-sm ${
              mode === "facts" ? "text-blue-deep bg-white shadow-sm" : "text-ink/70 hover:text-ink"
            }`}
          >
            <HeartHandshake className="h-4 w-4" />
            <span>Fun Facts (Ages 8 to 10)</span>
          </button>

          <button
            type="button"
            data-testid="mode-bio-btn"
            onClick={() => {
              speech.stop();
              setMode("bio");
            }}
            className={`font-heading inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all sm:text-sm ${
              mode === "bio" ? "text-blue-deep bg-white shadow-sm" : "text-ink/70 hover:text-ink"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Full Biography (Ages 11 to 15)</span>
          </button>
        </div>
      </nav>

      {/* Audio playback controls bar (AC-7) */}
      <AudioPlayer
        title={mode === "story" && saint.story ? saint.story.title : `${saint.title} ${saint.name}`}
        isPlaying={speech.isPlaying}
        onTogglePlay={handleToggleAudio}
        onRestart={() => {
          speech.stop();
          if (mode === "story") setCurrentPage(0);
        }}
        playbackRate={speech.playbackRate}
        onToggleSpeed={speech.toggleSpeed}
        statusLabel={`Listen Aloud (${mode === "story" ? "Story" : mode === "facts" ? "Fun Facts" : "Biography"})`}
      />

      {/* MODE 1: Illustrated Picture Story (AC-4) */}
      {mode === "story" && saint.story && (
        <section aria-labelledby="story-title" className="space-y-6">
          <div className="border-sand-border shadow-card-rest space-y-6 rounded-3xl border-2 bg-white p-6 sm:p-10">
            <div className="border-sand-border flex items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="font-heading text-orange-deep text-xs font-black uppercase tracking-wider">
                  Illustrated Story Retelling
                </span>
                <h2 id="story-title" className="font-heading text-ink text-2xl font-black">
                  {saint.story.title}
                </h2>
              </div>
              <div className="bg-sand font-heading text-ink shrink-0 rounded-full px-3 py-1 text-xs font-bold">
                Page {currentPage + 1} of {saint.story.pages.length}
              </div>
            </div>

            {/* Current Page Content */}
            <div className="bg-sand/30 border-sand-border flex min-h-[160px] items-center justify-center rounded-2xl border p-4 sm:p-6">
              <p className="text-ink max-w-xl text-center font-serif text-lg leading-relaxed sm:text-2xl">
                {saint.story.pages[currentPage]?.text}
              </p>
            </div>

            {/* Multi page stepper controls */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  speech.stop();
                  setCurrentPage((p) => Math.max(0, p - 1));
                }}
                disabled={currentPage === 0}
                className="bg-sand font-heading text-ink hover:bg-sand-border inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-black transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Page</span>
              </button>

              <div className="flex items-center gap-1.5">
                {saint.story.pages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      speech.stop();
                      setCurrentPage(idx);
                    }}
                    aria-label={`Go to page ${idx + 1}`}
                    className={`h-3 rounded-full transition-all ${
                      idx === currentPage ? "bg-orange w-8" : "bg-sand-border hover:bg-ink/30 w-3"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  speech.stop();
                  setCurrentPage((p) => Math.min(saint.story!.pages.length - 1, p + 1));
                }}
                disabled={currentPage === saint.story.pages.length - 1}
                className="bg-orange font-heading hover:bg-orange-deep shadow-sticker-orange inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-black text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>Next Page</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* MODE 2: Fun Facts & Virtues (AC-5) */}
      {mode === "facts" && (
        <section aria-labelledby="facts-title" className="space-y-6">
          <div className="border-sand-border shadow-card-rest space-y-6 rounded-3xl border-2 bg-white p-6 sm:p-8">
            <h2
              id="facts-title"
              className="font-heading text-ink flex items-center gap-2 text-xl font-black sm:text-2xl"
            >
              <Sparkles className="text-yellow-deep h-6 w-6" />
              <span>Memorable Fun Facts</span>
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {saint.funFacts.map((fact) => (
                <div
                  key={fact.position}
                  className="bg-sand/40 border-sand-border flex items-start gap-4 rounded-2xl border p-5"
                >
                  <div className="bg-blue-deep font-heading shadow-sticker-blue flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-base font-black text-white">
                    {fact.position}
                  </div>
                  <p className="font-body text-ink pt-1.5 text-base font-medium leading-relaxed">
                    {fact.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Virtues in Action */}
            {saint.virtueTags.length > 0 && (
              <div className="border-sand-border space-y-3 border-t pt-4">
                <h3 className="font-heading text-orange-deep text-sm font-black uppercase tracking-wider">
                  Virtues to Practice Today
                </h3>
                <div className="flex flex-wrap gap-2">
                  {saint.virtueTags.map((virtue) => (
                    <span
                      key={virtue}
                      className="bg-yellow-tint font-heading text-ink border-yellow/60 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-black"
                    >
                      <Sparkles className="text-yellow-deep h-3.5 w-3.5" />
                      <span>{virtue}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* MODE 3: Full Historical Biography & Prayer (AC-6) */}
      {mode === "bio" && (
        <section aria-labelledby="bio-title" className="space-y-6">
          <div className="border-sand-border shadow-card-rest space-y-6 rounded-3xl border-2 bg-white p-6 sm:p-8">
            <h2 id="bio-title" className="font-heading text-ink text-xl font-black sm:text-2xl">
              Historical Journey & Pilgrimage
            </h2>

            {/* Shrines & Places */}
            {saint.places.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-heading text-blue-deep text-sm font-black uppercase tracking-wider">
                  Sacred Places & Shrines
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {saint.places.map((place, idx) => (
                    <div
                      key={idx}
                      className="bg-sand/40 border-sand-border flex flex-col gap-1 rounded-2xl border p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-ink text-sm font-black">
                          {place.placeName}
                        </span>
                        <span className="bg-sand font-heading text-ink/70 border-sand-border rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize">
                          {place.kind}
                        </span>
                      </div>
                      {place.note && (
                        <p className="font-body text-ink/80 text-xs leading-relaxed">
                          {place.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traditional Prayer */}
            <div className="from-yellow-tint/40 to-sand/60 border-yellow/50 space-y-3 rounded-2xl border-2 bg-gradient-to-br p-6">
              <span className="font-heading text-yellow-deep flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
                <HeartHandshake className="h-4 w-4" />
                <span>Traditional Prayer of {saint.name}</span>
              </span>
              <blockquote className="text-ink border-yellow border-l-4 pl-4 font-serif text-base italic leading-relaxed sm:text-lg">
                &ldquo;{saint.prayer}&rdquo;
              </blockquote>
            </div>
          </div>
        </section>
      )}

      {/* AC-8: Reading Completion Action & Mascot Feedback */}
      <section className="border-sand-border bg-sand/30 space-y-5 rounded-3xl border-2 p-6 sm:p-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <MascotLamb size="md" mood={isCompleted ? "celebrating" : "happy"} />
            <div className="space-y-1">
              <h3 className="font-heading text-ink text-lg font-black">
                {isCompleted
                  ? "Wonderful reading!"
                  : `Did you enjoy learning about ${saint.title} ${saint.name}?`}
              </h3>
              <p className="font-body text-ink/80 text-sm">
                {isCompleted
                  ? session && !session.isGuest
                    ? `Your reading star (${starsAwarded ?? 1} earned) has been recorded in your journey!`
                    : "Your reading star has been saved on this device!"
                  : "Tap below to celebrate finishing this holy hero's story."}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="complete-saint-reading-btn"
            onClick={handleCompleteReading}
            disabled={isCompleted || isSavingProgress}
            className={`font-heading focus-accessible inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-6 py-3 text-sm font-black transition-all active:scale-95 ${
              isCompleted
                ? "bg-green shadow-sticker-green cursor-default text-white"
                : "bg-orange hover:bg-orange-deep shadow-sticker-orange text-white"
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="h-5 w-5" />
                <span>Story Completed!</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>{isSavingProgress ? "Saving..." : "I Finished Reading!"}</span>
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
