"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { SeedPatronage, SeedSaint } from "@kidzone/db";
import { MascotLamb, PatronageBadge, RotateCcw, SaintCard, Search, Sparkles } from "@kidzone/ui";
import type { LearnerSession } from "@/lib/child-session";
import { useSpeech } from "@/lib/use-speech";

export interface SaintsIndexViewProps {
  initialSaintOfTheDay: SeedSaint;
  allSaints: readonly SeedSaint[];
  patronages: readonly SeedPatronage[];
  session: LearnerSession;
}

export function SaintsIndexView({
  initialSaintOfTheDay,
  allSaints,
  patronages,
  session,
}: SaintsIndexViewProps) {
  const router = useRouter();
  const [featuredSaint, setFeaturedSaint] = React.useState<SeedSaint>(initialSaintOfTheDay);
  const [search, setSearch] = React.useState("");
  const [selectedPatronage, setSelectedPatronage] = React.useState<string | null>(null);

  const speech = useSpeech();

  const handleDiscoverAnother = () => {
    speech.stop();
    const otherSaints = allSaints.filter((s) => s.slug !== featuredSaint.slug);
    if (otherSaints.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherSaints.length);
      setFeaturedSaint(otherSaints[randomIndex]!);
    }
  };

  const handlePlayFeaturedAudio = () => {
    if (speech.isPlaying) {
      speech.stop();
    } else {
      const textToRead = `${featuredSaint.title} ${featuredSaint.name}. ${featuredSaint.tagline}. Patron of ${featuredSaint.patronages.join(", ")}. Prayer: ${featuredSaint.prayer}`;
      speech.speak(textToRead);
    }
  };

  const filteredSaints = React.useMemo(() => {
    return allSaints.filter((saint) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        saint.name.toLowerCase().includes(q) ||
        saint.tagline.toLowerCase().includes(q) ||
        saint.searchAliases.some((alias) => alias.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (selectedPatronage) {
        return saint.patronages.includes(selectedPatronage.toLowerCase());
      }

      return true;
    });
  }, [allSaints, search, selectedPatronage]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 sm:py-12">
      {/* Header and Welcome */}
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="bg-yellow-tint font-heading text-yellow-deep inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Friends of Jesus in Heaven</span>
        </div>

        <h1 className="font-heading text-ink text-3xl font-black tracking-tight sm:text-5xl">
          Catholic Saints & Life Stories
        </h1>

        <p className="font-body text-ink/80 max-w-2xl text-base font-medium leading-relaxed sm:text-lg">
          {session && !session.isGuest
            ? `Welcome back, ${session.nickname}! Meet the holy heroes who walked with Jesus and learn how to practice their virtues.`
            : "Meet holy heroes from history who loved God with all their hearts. Discover today's feast day or explore inspiring life stories."}
        </p>
      </header>

      {/* AC-1: Saint of the Day Hero Section */}
      <section aria-labelledby="saint-of-the-day-title" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="saint-of-the-day-title"
            className="font-heading text-ink flex items-center gap-2 text-xl font-black tracking-tight sm:text-2xl"
          >
            <Sparkles className="text-yellow-deep h-5 w-5" />
            <span>Today&apos;s Holy Hero</span>
          </h2>

          {/* AC-1: Discover Another Saint Action */}
          <button
            type="button"
            data-testid="discover-another-saint-btn"
            onClick={handleDiscoverAnother}
            className="bg-sand font-heading text-blue-deep hover:bg-blue-tint focus-accessible border-sand-border inline-flex min-h-[44px] items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-black transition-all active:scale-95 sm:text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Discover Another Saint</span>
          </button>
        </div>

        <SaintCard
          slug={featuredSaint.slug}
          name={featuredSaint.name}
          title={featuredSaint.title}
          tagline={featuredSaint.tagline}
          feastMonth={featuredSaint.feastMonth}
          feastDay={featuredSaint.feastDay}
          eraLabel={featuredSaint.eraLabel}
          patronages={featuredSaint.patronages}
          isDailyHero={true}
          onSelect={() => router.push(`/saints/${featuredSaint.slug}`)}
          onPlayAudio={handlePlayFeaturedAudio}
          isPlaying={speech.isPlaying}
        />
      </section>

      {/* AC-2: Catalog Search & Patronage Filters */}
      <section aria-labelledby="catalog-title" className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2
            id="catalog-title"
            className="font-heading text-ink text-xl font-black tracking-tight sm:text-2xl"
          >
            Explore All Saints ({filteredSaints.length})
          </h2>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="text-ink/40 pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, place..."
              className="border-sand-border font-body text-ink placeholder:text-ink/40 focus-accessible min-h-[48px] w-full rounded-2xl border-2 bg-white pl-10 pr-4 text-sm shadow-sm"
              aria-label="Search saints by name or alias"
            />
          </div>
        </div>

        {/* Patronage Filter Chips */}
        <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">
          <PatronageBadge
            label="All Patronages"
            active={selectedPatronage === null}
            onClick={() => setSelectedPatronage(null)}
          />
          {patronages.map((p) => (
            <PatronageBadge
              key={p.id}
              label={p.label}
              active={selectedPatronage === p.slug}
              onClick={() => setSelectedPatronage(selectedPatronage === p.slug ? null : p.slug)}
            />
          ))}
        </div>

        {/* Saints Grid */}
        {filteredSaints.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSaints.map((saint) => (
              <SaintCard
                key={saint.id}
                slug={saint.slug}
                name={saint.name}
                title={saint.title}
                tagline={saint.tagline}
                feastMonth={saint.feastMonth}
                feastDay={saint.feastDay}
                eraLabel={saint.eraLabel}
                patronages={saint.patronages}
                onSelect={() => router.push(`/saints/${saint.slug}`)}
              />
            ))}
          </div>
        ) : (
          <div className="border-sand-border bg-sand/30 flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-12 text-center">
            <MascotLamb size="md" mood="thinking" />
            <div className="space-y-1">
              <h3 className="font-heading text-ink text-lg font-black">No saints found</h3>
              <p className="font-body text-ink/70 text-sm">
                Try searching for another name or clearing the patronage filter.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedPatronage(null);
              }}
              className="bg-sand font-heading text-blue-deep hover:bg-sand-border inline-flex min-h-[44px] items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
