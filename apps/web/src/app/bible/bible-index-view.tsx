"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Sparkles, VerseCard, MascotLamb, type BookItem } from "@kidzone/ui";
import { useSpeech } from "@/lib/use-speech";
import type { LearnerSession } from "@/lib/child-session";

export interface VerseOfTheDayData {
  citation: string;
  text: string;
  meaning: string;
  bookCode: string;
  chapter: number;
}

export interface BibleIndexViewProps {
  books: readonly BookItem[];
  verseOfTheDay: VerseOfTheDayData;
  session: LearnerSession;
}

type TabKey = "all" | "old" | "deutero" | "new";

export function BibleIndexView({ books, verseOfTheDay, session }: BibleIndexViewProps) {
  const [search, setSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<TabKey>("all");

  const speech = useSpeech();

  const handlePlayVerseAudio = () => {
    if (speech.isPlaying) {
      speech.stop();
    } else {
      const speechText = `${verseOfTheDay.citation}. ${verseOfTheDay.text}. What this means for you: ${verseOfTheDay.meaning}`;
      speech.speak(speechText);
    }
  };

  const filteredBooks = React.useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.code.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;

      if (activeTab === "old") return b.testament === "old";
      if (activeTab === "new") return b.testament === "new";
      if (activeTab === "deutero") return b.isDeuterocanonical;
      return true;
    });
  }, [books, search, activeTab]);

  const deuteroCount = React.useMemo(
    () => books.filter((b) => b.isDeuterocanonical).length,
    [books],
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 sm:py-12">
      {/* Learner Greeting & Header */}
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="bg-blue-tint font-heading text-blue-deep inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Catholic Sacred Scripture</span>
        </div>

        <h1 className="font-heading text-ink text-3xl font-black tracking-tight sm:text-5xl">
          Holy Bible for Children
        </h1>

        <p className="font-body text-ink-soft max-w-2xl text-base leading-relaxed sm:text-lg">
          Explore God&apos;s holy word across all 73 Catholic books. Listen to story retellings,
          reflect on daily verses, and read full Douay-Rheims scripture chapters.
        </p>

        {session && (
          <div className="bg-sand border-sand-border font-heading text-ink-soft inline-flex items-center gap-2 rounded-2xl border px-3.5 py-1.5 text-xs font-black">
            <MascotLamb size="sm" mood="happy" />
            <span>
              {session.isGuest ? "Exploring as a guest reader" : `Reading as ${session.nickname}`}
            </span>
          </div>
        )}
      </header>

      {/* Verse of the Day Hero Card */}
      <section aria-label="Verse of the Day">
        <VerseCard
          citation={verseOfTheDay.citation}
          text={verseOfTheDay.text}
          meaning={verseOfTheDay.meaning}
          bookCode={verseOfTheDay.bookCode}
          chapter={verseOfTheDay.chapter}
          isDailyHero={true}
          isPlaying={speech.isPlaying}
          onPlayAudio={handlePlayVerseAudio}
          onReadChapter={() => {
            window.location.href = `/bible/${verseOfTheDay.bookCode}/${verseOfTheDay.chapter}`;
          }}
        />
      </section>

      {/* Quick Start Chapter Highlights */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-ink text-xl font-black sm:text-2xl">
            Popular Chapters to Explore
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-4">
          {[
            {
              title: "The Creation",
              ref: "Genesis 1",
              href: "/bible/gen/1",
              desc: "God makes the beautiful world",
              badge: "Story Retelling",
            },
            {
              title: "The Good Shepherd",
              ref: "Psalm 23",
              href: "/bible/ps/23",
              desc: "The Lord ruleth me",
              badge: "Comfort",
            },
            {
              title: "The Beatitudes",
              ref: "Matthew 5",
              href: "/bible/matt/5",
              desc: "Blessed are the peacemakers",
              badge: "Teachings",
            },
            {
              title: "The Word of God",
              ref: "John 1",
              href: "/bible/john/1",
              desc: "In the beginning was the Word",
              badge: "Gospel",
            },
          ].map((item) => (
            <Link
              key={item.ref}
              href={item.href}
              className="border-sand-border shadow-card-rest hover:shadow-card-hover hover:border-blue-deep focus-accessible group flex flex-col justify-between gap-2 rounded-2xl border-2 bg-white p-4 transition-all active:scale-95"
            >
              <div className="space-y-1">
                <span className="bg-sand font-heading text-orange-deep inline-block rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  {item.badge}
                </span>
                <h3 className="font-heading text-ink group-hover:text-blue-deep text-base font-black transition-colors">
                  {item.title}
                </h3>
                <p className="font-body text-ink-soft text-xs leading-snug">{item.desc}</p>
              </div>
              <span className="font-heading text-blue-deep flex items-center gap-1 text-xs font-black">
                <span>{item.ref}</span>
                <span>&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Catholic Canonical Book Selector (AC-1: All 73 Books) */}
      <section className="border-sand-border shadow-card-rest space-y-5 rounded-3xl border-2 bg-white p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h2 className="font-heading text-ink text-2xl font-black sm:text-3xl">
              All 73 Catholic Books
            </h2>
            <p className="font-body text-ink-soft text-sm">
              Includes all 46 Old Testament books, 7 Deuterocanonicals, and 27 New Testament books
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="text-ink-soft absolute left-3.5 top-3.5 h-4 w-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by book name..."
              className="border-sand-border bg-sand-light/50 font-body text-ink placeholder:text-ink-soft/70 focus-accessible w-full rounded-2xl border-2 py-2.5 pl-10 pr-4 text-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          className="border-sand-border flex flex-wrap items-center gap-2 border-b pb-4"
          role="tablist"
        >
          {[
            { id: "all", label: `All Books (${books.length})` },
            { id: "old", label: "Old Testament (46)" },
            { id: "deutero", label: `Deuterocanonical (${deuteroCount})` },
            { id: "new", label: "New Testament (27)" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id as TabKey)}
              className={`font-heading focus-accessible min-h-[44px] rounded-xl px-4 py-2 text-xs font-black transition-all sm:text-sm ${
                activeTab === t.id
                  ? "bg-blue-deep shadow-sticker-blue scale-[1.02] text-white"
                  : "bg-sand text-ink-soft hover:bg-sand-border hover:text-ink active:scale-95"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 73 Books Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredBooks.map((book) => (
            <Link
              key={book.id}
              href={`/bible/${book.code}/1`}
              className="border-sand-border bg-sand-light/40 hover:border-blue-deep hover:bg-blue-tint/20 focus-accessible group flex min-h-[76px] flex-col justify-between gap-1.5 rounded-2xl border-2 p-3.5 transition-all active:scale-95"
            >
              <div className="flex items-start justify-between gap-1">
                <span className="font-heading text-ink group-hover:text-blue-deep truncate text-sm font-black">
                  {book.name}
                </span>
                {book.isDeuterocanonical && (
                  <span
                    title="Catholic Deuterocanonical Book"
                    className="bg-yellow-tint text-yellow-deep inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-black"
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>DC</span>
                  </span>
                )}
              </div>
              <div className="font-body text-ink-soft flex items-center justify-between text-[11px]">
                <span>
                  {book.chapters} {book.chapters === 1 ? "ch." : "chs."}
                </span>
                <span className="font-heading text-blue-deep font-black group-hover:underline">
                  Read &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-ink-soft py-12 text-center">
            <p className="font-heading text-lg font-bold">
              No books found matching &ldquo;{search}&rdquo;
            </p>
            <p className="font-body mt-1 text-xs">
              Try clearing the search or switching category tabs
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
