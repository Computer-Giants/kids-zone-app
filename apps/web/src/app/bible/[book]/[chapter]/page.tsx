import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CATHOLIC_BOOKS,
  GENESIS_1_VERSES,
  GENESIS_CREATION_STORY,
  getBookByCode,
  getBookById,
  JOHN_1_VERSES,
  MATTHEW_5_VERSES,
  PSALM_23_VERSES,
  SEED_FEATURED_VERSES,
} from "@kidzone/db";
import { getActiveLearnerSession } from "@/lib/child-session";
import {
  ChapterReaderView,
  type KeyVerseItem,
  type StoryRetelling,
  type VerseItem,
} from "./chapter-reader-view";

interface PageProps {
  params: Promise<{ book: string; chapter: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { book: bookParam, chapter: chapterParam } = await params;
  const numericId = Number(bookParam);
  const book =
    !isNaN(numericId) && numericId > 0 ? getBookById(numericId) : getBookByCode(bookParam);

  if (!book) {
    return { title: "Bible Chapter Not Found" };
  }

  return {
    title: `${book.name} Chapter ${chapterParam} | Catholic Bible for Children`,
    description: `Read ${book.name} chapter ${chapterParam} with illustrated retellings for young children, key verses, and full Douay-Rheims scripture.`,
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { book: bookParam, chapter: chapterParam } = await params;
  const numericId = Number(bookParam);
  const book =
    !isNaN(numericId) && numericId > 0 ? getBookById(numericId) : getBookByCode(bookParam);

  if (!book) {
    notFound();
  }

  const chapterNum = Number(chapterParam);
  if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > book.chapters) {
    notFound();
  }

  const session = await getActiveLearnerSession();

  // Resolve initial scripture verses
  let verses: VerseItem[] = [];
  if (book.id === 1 && chapterNum === 1) verses = GENESIS_1_VERSES;
  else if (book.id === 23 && chapterNum === 23) verses = PSALM_23_VERSES;
  else if (book.id === 47 && chapterNum === 5) verses = MATTHEW_5_VERSES;
  else if (book.id === 50 && chapterNum === 1) verses = JOHN_1_VERSES;

  // Resolve initial kid retelling story (if present for this chapter)
  let retelling: StoryRetelling | null = null;
  if (book.id === 1 && chapterNum === 1) {
    retelling = {
      id: GENESIS_CREATION_STORY.id,
      title: GENESIS_CREATION_STORY.title,
      summary: GENESIS_CREATION_STORY.summary,
      author: GENESIS_CREATION_STORY.author,
      pages: GENESIS_CREATION_STORY.pages,
    };
  }

  // Resolve initial key verses with practical meanings
  const keyVerses: KeyVerseItem[] = SEED_FEATURED_VERSES.filter(
    (fv) => fv.bookId === book.id && fv.startChapter === chapterNum,
  ).map((fv) => ({
    id: fv.id,
    citation: fv.citation,
    startVerse: fv.startVerse,
    endVerse: fv.endVerse,
    text: fv.text,
    meaning: fv.meaning,
  }));

  return (
    <ChapterReaderView
      book={book}
      chapter={chapterNum}
      initialVerses={verses}
      initialRetelling={retelling}
      initialKeyVerses={keyVerses}
      allBooks={CATHOLIC_BOOKS}
      session={session}
    />
  );
}
