"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AudioPlayer,
  BookOpen,
  BookSelectorModal,
  ChapterNav,
  MascotLamb,
  ReadingModeToggle,
  Sparkles,
  type BookItem,
  type ReadingMode,
} from "@kidzone/ui";
import { useSpeech } from "@/lib/use-speech";
import { setCachedChapter, getCachedChapter } from "@/lib/bible-cache";
import { recordReadingProgress } from "@/lib/reading-progress";
import type { LearnerSession } from "@/lib/child-session";

export interface VerseItem {
  verse: number;
  text: string;
}

export interface StoryRetelling {
  id: string;
  title: string;
  summary: string | null;
  author: string | null;
  pages: Array<{ position: number; text: string }>;
}

export interface KeyVerseItem {
  id: string;
  citation: string;
  startVerse: number;
  endVerse: number;
  text: string;
  meaning: string;
}

export interface ChapterReaderViewProps {
  book: BookItem;
  chapter: number;
  initialVerses: VerseItem[];
  initialRetelling: StoryRetelling | null;
  initialKeyVerses: KeyVerseItem[];
  allBooks: readonly BookItem[];
  session: LearnerSession;
}

export function ChapterReaderView({
  book,
  chapter,
  initialVerses,
  initialRetelling,
  initialKeyVerses,
  allBooks,
  session,
}: ChapterReaderViewProps) {
  const router = useRouter();

  // Determine initial reading mode based on child age band or default
  const getDefaultMode = React.useCallback((): ReadingMode => {
    const band = session?.ageBand;
    if (band === "b3_7" && initialRetelling) return "stories";
    if (band === "b8_10") return "key_verses";
    if (band === "b11_15") return "full";
    if (initialRetelling) return "stories";
    return "key_verses";
  }, [session?.ageBand, initialRetelling]);

  const [mode, setMode] = React.useState<ReadingMode>(getDefaultMode);
  const [verses, setVerses] = React.useState<VerseItem[]>(initialVerses);
  const [retelling, setRetelling] = React.useState<StoryRetelling | null>(initialRetelling);
  const [keyVerses, setKeyVerses] = React.useState<KeyVerseItem[]>(initialKeyVerses);
  const [isBookModalOpen, setIsBookModalOpen] = React.useState(false);

  // Story retelling multi-page stepper state
  const [currentStoryPage, setCurrentStoryPage] = React.useState(0);

  // Progress completion state
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [starsAwarded, setStarsAwarded] = React.useState<number | null>(null);
  const [isSavingProgress, setIsSavingProgress] = React.useState(false);

  // Speech read aloud
  const speech = useSpeech();

  // Cache chapter in Cache Storage for offline reading (AC-7)
  React.useEffect(() => {
    const payload = {
      book,
      chapter,
      verses: initialVerses,
      retelling: initialRetelling,
      keyVerses: initialKeyVerses,
    };
    setCachedChapter(book.code, chapter, payload);
  }, [book, chapter, initialVerses, initialRetelling, initialKeyVerses]);

  // If initial verses were empty (e.g. offline load), try restoring from Cache Storage
  React.useEffect(() => {
    if (verses.length === 0) {
      getCachedChapter<{
        verses?: VerseItem[];
        retelling?: StoryRetelling | null;
        keyVerses?: KeyVerseItem[];
      }>(book.code, chapter).then((cached) => {
        if (cached) {
          if (cached.verses && cached.verses.length > 0) setVerses(cached.verses);
          if (cached.retelling) setRetelling(cached.retelling);
          if (cached.keyVerses && cached.keyVerses.length > 0) setKeyVerses(cached.keyVerses);
        }
      });
    }
  }, [book.code, chapter, verses.length]);

  // Construct speech text depending on active mode
  const getSpeechText = React.useCallback((): string => {
    if (mode === "stories" && retelling && retelling.pages.length > 0) {
      const page = retelling.pages[currentStoryPage];
      if (page) {
        return `${retelling.title}. Page ${currentStoryPage + 1}: ${page.text}`;
      }
      return retelling.pages.map((p, idx) => `Page ${idx + 1}: ${p.text}`).join(" ");
    }

    if (mode === "key_verses" && keyVerses.length > 0) {
      return keyVerses
        .map((kv) => `${kv.citation}: ${kv.text}. What this means: ${kv.meaning}`)
        .join(". ");
    }

    if (verses.length > 0) {
      const passage = verses.map((v) => `Verse ${v.verse}: ${v.text}`).join(" ");
      return `${book.name} chapter ${chapter}. ${passage}`;
    }

    return `${book.name} chapter ${chapter}`;
  }, [mode, retelling, currentStoryPage, keyVerses, verses, book.name, chapter]);

  const handleToggleAudio = () => {
    if (speech.isPlaying) {
      speech.stop();
    } else {
      const textToRead = getSpeechText();
      speech.speak(textToRead);
    }
  };

  const handleSelectChapter = (targetChapter: number) => {
    speech.stop();
    router.push(`/bible/${book.code}/${targetChapter}`);
  };

  const handleSelectBook = (selectedBook: BookItem) => {
    speech.stop();
    router.push(`/bible/${selectedBook.code}/1`);
  };

  const handleCompleteReading = async () => {
    if (isCompleted || isSavingProgress) return;
    setIsSavingProgress(true);

    const contentId = `${book.code}-${chapter}`;
    const childId = session && !session.isGuest ? session.id : undefined;

    const result = await recordReadingProgress({
      contentId,
      childId,
      entityType: mode === "stories" ? "story" : "bible_chapter",
    });

    setIsSavingProgress(false);
    setIsCompleted(true);
    setStarsAwarded(result.starsAwarded);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 sm:py-10">
      {/* Top Bar with Back Link and Mode Toggle */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Link
          href="/bible"
          className="font-heading text-ink-soft hover:text-ink border-sand-border shadow-card-rest focus-accessible inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 bg-white px-3.5 py-2 text-xs font-black transition-all active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All 73 Books</span>
        </Link>

        {/* AC-5: Reading Mode Switcher */}
        <ReadingModeToggle
          mode={mode}
          onChange={(newMode) => {
            speech.stop();
            setMode(newMode);
          }}
          hasStoryRetelling={Boolean(retelling)}
        />
      </div>

      {/* Chapter Navigation Header */}
      <ChapterNav
        bookName={book.name}
        bookCode={book.code}
        currentChapter={chapter}
        totalChapters={book.chapters}
        onSelectChapter={handleSelectChapter}
        onOpenBookSelector={() => setIsBookModalOpen(true)}
      />

      {/* Audio Player Toolbar (AC-6) */}
      <AudioPlayer
        title={
          mode === "stories" && retelling
            ? `${retelling.title} (Page ${currentStoryPage + 1}/${retelling.pages.length})`
            : `${book.name} Chapter ${chapter}`
        }
        isPlaying={speech.isPlaying}
        onTogglePlay={handleToggleAudio}
        playbackRate={speech.playbackRate}
        onToggleSpeed={speech.toggleSpeed}
        onRestart={() => {
          speech.stop();
          speech.speak(getSpeechText());
        }}
        statusLabel={
          mode === "stories"
            ? "Story Narration"
            : mode === "key_verses"
              ? "Key Verses Audio"
              : "Scripture Read Aloud"
        }
      />

      {/* Mode 1: Illustrated Kid Story Retelling (AC-2: Little Lambs 3 to 7) */}
      {mode === "stories" && retelling && (
        <article className="border-sand-border shadow-card-rest flex flex-col gap-6 rounded-3xl border-2 bg-white p-6 sm:p-10">
          <div className="border-sand-border flex items-center justify-between gap-3 border-b pb-4">
            <div className="space-y-1">
              <div className="bg-yellow-tint font-heading text-yellow-deep inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Illustrated Bible Retelling</span>
              </div>
              <h1 className="font-heading text-ink text-2xl font-black sm:text-3xl">
                {retelling.title}
              </h1>
              {retelling.summary && (
                <p className="font-body text-ink-soft text-sm">{retelling.summary}</p>
              )}
            </div>

            <div className="hidden sm:block">
              <MascotLamb size="md" mood="happy" />
            </div>
          </div>

          {/* Current Story Page Content */}
          {retelling.pages.length > 0 && (
            <div className="space-y-6">
              <div className="bg-sand/40 border-sand-border rounded-2xl border p-6 sm:p-8">
                <div className="font-heading text-orange-deep mb-3 flex items-center justify-between text-xs font-extrabold uppercase tracking-wider">
                  <span>
                    Page {currentStoryPage + 1} of {retelling.pages.length}
                  </span>
                  <span>
                    {book.name} {chapter}
                  </span>
                </div>
                <p className="font-heading text-ink text-xl font-bold leading-relaxed sm:text-2xl">
                  {retelling.pages[currentStoryPage]?.text}
                </p>
              </div>

              {/* Story Page Stepper Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  disabled={currentStoryPage === 0}
                  onClick={() => {
                    speech.stop();
                    setCurrentStoryPage((p) => Math.max(0, p - 1));
                  }}
                  className={`font-heading focus-accessible min-h-[48px] rounded-2xl px-5 py-2.5 text-sm font-black transition-all ${
                    currentStoryPage > 0
                      ? "bg-sand text-ink hover:bg-sand-border active:scale-95"
                      : "bg-sand/50 text-ink-soft cursor-not-allowed opacity-30"
                  }`}
                >
                  &larr; Previous Page
                </button>

                <div className="flex items-center gap-1.5">
                  {retelling.pages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        speech.stop();
                        setCurrentStoryPage(idx);
                      }}
                      aria-label={`Go to page ${idx + 1}`}
                      className={`h-3 rounded-full transition-all ${
                        idx === currentStoryPage
                          ? "bg-blue-deep w-8"
                          : "bg-sand-border hover:bg-sand w-3"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentStoryPage >= retelling.pages.length - 1}
                  onClick={() => {
                    speech.stop();
                    setCurrentStoryPage((p) => Math.min(retelling.pages.length - 1, p + 1));
                  }}
                  className={`font-heading focus-accessible min-h-[48px] rounded-2xl px-5 py-2.5 text-sm font-black transition-all ${
                    currentStoryPage < retelling.pages.length - 1
                      ? "bg-blue-deep shadow-sticker-blue hover:bg-blue-deep/90 text-white active:scale-95"
                      : "bg-sand/50 text-ink-soft cursor-not-allowed opacity-30"
                  }`}
                >
                  Next Page &rarr;
                </button>
              </div>
            </div>
          )}
        </article>
      )}

      {/* Mode 2: Curated Key Verses with Practical Meaning (AC-3: Seekers 8 to 10) */}
      {mode === "key_verses" && (
        <div className="space-y-6">
          <div className="border-sand-border shadow-card-rest space-y-2 rounded-3xl border-2 bg-white p-6 sm:p-8">
            <div className="bg-blue-tint font-heading text-blue-deep inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Key Scripture Verses</span>
            </div>
            <h1 className="font-heading text-ink text-2xl font-black sm:text-3xl">
              Memorable Verses from {book.name} {chapter}
            </h1>
            <p className="font-body text-ink-soft text-sm leading-relaxed">
              Read God&apos;s special words and see how each verse teaches us to love and follow
              Jesus every day.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {keyVerses.map((kv) => (
              <article
                key={kv.id}
                className="border-sand-border shadow-card-rest flex flex-col gap-4 rounded-3xl border-2 bg-white p-6 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-blue-deep text-lg font-black">
                    {kv.citation}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      speech.speak(`${kv.citation}. ${kv.text}. What this means: ${kv.meaning}`)
                    }
                    className="bg-blue-tint text-blue-deep hover:bg-blue focus-accessible flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:text-white active:scale-95"
                    aria-label={`Listen to ${kv.citation}`}
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>

                <blockquote className="text-ink/90 border-yellow border-l-4 py-1 pl-4 font-serif text-base italic sm:text-lg">
                  &ldquo;{kv.text}&rdquo;
                </blockquote>

                <div className="bg-sand/60 border-sand-border flex items-start gap-3 rounded-2xl border p-4">
                  <div className="shrink-0 pt-0.5">
                    <MascotLamb size="sm" mood="happy" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-heading text-orange-deep block text-xs font-black uppercase tracking-wider">
                      What this means for you
                    </span>
                    <p className="font-body text-ink text-sm font-medium leading-relaxed">
                      {kv.meaning}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            {keyVerses.length === 0 && (
              <div className="border-sand-border text-ink-soft rounded-3xl border-2 bg-white p-8 text-center">
                <p className="font-heading text-base font-bold">
                  No curated key verses marked yet for this chapter.
                </p>
                <p className="font-body mt-1 text-xs">
                  You can switch to Full Chapter mode to read all scripture verses.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: Full Chapter Douay-Rheims Scripture Text (AC-4: Disciples 11 to 15) */}
      {mode === "full" && (
        <article className="border-sand-border shadow-card-rest flex flex-col gap-6 rounded-3xl border-2 bg-white p-6 sm:p-10">
          <header className="border-sand-border space-y-1 border-b pb-4">
            <div className="bg-sand font-heading text-orange-deep inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider">
              <span>Douay-Rheims Catholic Bible</span>
            </div>
            <h1 className="font-heading text-ink text-3xl font-black sm:text-4xl">
              {book.name} {chapter}
            </h1>
            <p className="font-body text-ink-soft text-xs">
              Challoner Catholic Public Domain Scripture Revision (73 Canonical Books)
            </p>
          </header>

          <div className="text-ink/90 space-y-4 font-serif text-base leading-loose sm:text-lg">
            {verses.map((v) => (
              <p key={v.verse} className="group flex items-baseline gap-2">
                <span className="font-heading text-blue-deep shrink-0 select-none text-xs font-black">
                  {v.verse}
                </span>
                <span>{v.text}</span>
              </p>
            ))}

            {verses.length === 0 && (
              <div className="text-ink-soft py-8 text-center">
                <p className="font-heading text-base font-bold">
                  Scripture text is loading or being loaded for this chapter.
                </p>
              </div>
            )}
          </div>
        </article>
      )}

      {/* Reading Completion Celebration (AC-8) */}
      <section className="border-sand-border bg-sand/50 shadow-card-rest flex flex-col items-center justify-center gap-4 rounded-3xl border-2 p-6 text-center sm:p-8">
        {isCompleted ? (
          <div className="animate-lamb-hop space-y-2">
            <MascotLamb size="md" mood="celebrating" />
            <h3 className="font-heading text-ink text-xl font-black sm:text-2xl">
              Great job reading God&apos;s Word!
            </h3>
            <p className="font-body text-ink-soft text-sm">
              {session && !session.isGuest
                ? `You earned ${starsAwarded ?? 1} reading star for your journey!`
                : "Your reading was saved to your device. Keep up your daily reading habit!"}
            </p>
          </div>
        ) : (
          <div className="max-w-md space-y-3">
            <h3 className="font-heading text-ink text-lg font-black sm:text-xl">
              Finished reading this chapter?
            </h3>
            <p className="font-body text-ink-soft text-xs sm:text-sm">
              Tap the button to record your progress and celebrate learning Sacred Scripture.
            </p>
            <button
              type="button"
              disabled={isSavingProgress}
              onClick={handleCompleteReading}
              className="bg-orange hover:bg-orange-deep font-heading shadow-sticker-orange focus-accessible inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-6 py-3 text-base font-black text-white transition-all active:scale-95"
            >
              <Sparkles className="h-5 w-5" />
              <span>{isSavingProgress ? "Recording..." : "I Finished Reading!"}</span>
            </button>
          </div>
        )}
      </section>

      {/* Catholic 73-Book Selector Modal */}
      <BookSelectorModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        books={allBooks}
        currentBookCode={book.code}
        onSelectBook={handleSelectBook}
      />
    </div>
  );
}
