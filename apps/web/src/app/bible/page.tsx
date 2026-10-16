import type { Metadata } from "next";
import { CATHOLIC_BOOKS, SEED_FEATURED_VERSES } from "@kidzone/db";
import { getActiveLearnerSession } from "@/lib/child-session";
import { BibleIndexView, type VerseOfTheDayData } from "./bible-index-view";

export const metadata: Metadata = {
  title: "Catholic Bible for Children | 73 Canonical Books",
  description:
    "Explore all 73 Catholic Bible books with illustrated retellings for young children, key verses for seekers, and full Douay-Rheims scripture chapters.",
};

function getVerseOfTheDay(): VerseOfTheDayData {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % SEED_FEATURED_VERSES.length;
  const fv = SEED_FEATURED_VERSES[index]!;

  return {
    citation: fv.citation,
    text: fv.text,
    meaning: fv.meaning,
    bookCode: fv.bookCode,
    chapter: fv.startChapter,
  };
}

export default async function BiblePage() {
  const session = await getActiveLearnerSession();
  const verseOfTheDay = getVerseOfTheDay();

  return <BibleIndexView books={CATHOLIC_BOOKS} verseOfTheDay={verseOfTheDay} session={session} />;
}
