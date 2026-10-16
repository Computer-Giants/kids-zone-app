import { eq } from "drizzle-orm";
import { getDb } from "./index";
import { CATHOLIC_BOOKS } from "./data/catholic-books";
import {
  DOUAY_RHEIMS_TRANSLATION,
  GENESIS_1_VERSES,
  GENESIS_CREATION_STORY,
  JOHN_1_VERSES,
  MATTHEW_5_VERSES,
  PSALM_23_VERSES,
  SEED_FEATURED_VERSES,
} from "./data/initial-scripture";
import {
  bibleBooks,
  bibleTranslations,
  bibleVerses,
  featuredVerses,
  verseOfTheDay,
} from "./schema/bible";
import { stories, storyKinds, storyPages } from "./schema/fun";

/**
 * Idempotently seeds the 73 Catholic Bible books, Douay-Rheims translation, sample chapter verses,
 * curated featured verses, Genesis 1 story retelling, and daily verse assignments.
 */
export async function seedBibleData() {
  const db = getDb();

  console.log("Seeding Bible translations...");
  const [existingTranslation] = await db
    .select({ id: bibleTranslations.id })
    .from(bibleTranslations)
    .where(eq(bibleTranslations.code, DOUAY_RHEIMS_TRANSLATION.code))
    .limit(1);

  let translationId = existingTranslation?.id;
  if (!translationId) {
    const [inserted] = await db
      .insert(bibleTranslations)
      .values({
        code: DOUAY_RHEIMS_TRANSLATION.code,
        name: DOUAY_RHEIMS_TRANSLATION.name,
        language: DOUAY_RHEIMS_TRANSLATION.language,
        level: DOUAY_RHEIMS_TRANSLATION.level,
        license: DOUAY_RHEIMS_TRANSLATION.license,
        sourceUrl: DOUAY_RHEIMS_TRANSLATION.sourceUrl,
        attribution: DOUAY_RHEIMS_TRANSLATION.attribution,
        isDefault: DOUAY_RHEIMS_TRANSLATION.isDefault,
      })
      .returning({ id: bibleTranslations.id });
    translationId = inserted?.id ?? 1;
  }

  console.log("Seeding 73 Catholic canonical books...");
  for (const book of CATHOLIC_BOOKS) {
    await db
      .insert(bibleBooks)
      .values({
        id: book.id,
        code: book.code,
        name: book.name,
        testament: book.testament,
        isDeuterocanonical: book.isDeuterocanonical,
        chapters: book.chapters,
      })
      .onConflictDoNothing({ target: bibleBooks.id });
  }

  console.log("Seeding Douay-Rheims sample chapters (Genesis 1, Psalm 23, Matthew 5, John 1)...");

  // Genesis 1 (Book ID 1)
  for (const v of GENESIS_1_VERSES) {
    await db
      .insert(bibleVerses)
      .values({
        translationId,
        bookId: 1,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      })
      .onConflictDoNothing();
  }

  // Psalms 23 (Book ID 23)
  for (const v of PSALM_23_VERSES) {
    await db
      .insert(bibleVerses)
      .values({
        translationId,
        bookId: 23,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      })
      .onConflictDoNothing();
  }

  // Matthew 5 (Book ID 47)
  for (const v of MATTHEW_5_VERSES) {
    await db
      .insert(bibleVerses)
      .values({
        translationId,
        bookId: 47,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      })
      .onConflictDoNothing();
  }

  // John 1 (Book ID 50)
  for (const v of JOHN_1_VERSES) {
    await db
      .insert(bibleVerses)
      .values({
        translationId,
        bookId: 50,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      })
      .onConflictDoNothing();
  }

  console.log("Seeding curated featured verses...");
  for (const fv of SEED_FEATURED_VERSES) {
    await db
      .insert(featuredVerses)
      .values({
        id: fv.id,
        bookId: fv.bookId,
        startChapter: fv.startChapter,
        startVerse: fv.startVerse,
        endChapter: fv.endChapter,
        endVerse: fv.endVerse,
        meaning: fv.meaning,
        status: fv.status,
        minAge: fv.minAge,
        maxAge: fv.maxAge,
        sourceNote: fv.sourceNote,
      })
      .onConflictDoNothing({ target: featuredVerses.id });
  }

  console.log("Seeding story kinds and Bible retelling story...");
  // Ensure story kind 'bible' exists
  let kindRow = await db.query.storyKinds.findFirst({
    where: eq(storyKinds.slug, "bible"),
  });
  if (!kindRow) {
    const inserted = await db
      .insert(storyKinds)
      .values({
        slug: "bible",
        name: "Bible Story",
        sortOrder: 1,
        isActive: true,
      })
      .returning();
    kindRow = inserted[0];
  }

  if (kindRow) {
    await db
      .insert(stories)
      .values({
        id: GENESIS_CREATION_STORY.id,
        slug: GENESIS_CREATION_STORY.slug,
        title: GENESIS_CREATION_STORY.title,
        summary: GENESIS_CREATION_STORY.summary,
        kindId: kindRow.id,
        readingMinutes: GENESIS_CREATION_STORY.readingMinutes,
        author: GENESIS_CREATION_STORY.author,
        bibleBookId: GENESIS_CREATION_STORY.bibleBookId,
        bibleStartChapter: GENESIS_CREATION_STORY.bibleStartChapter,
        bibleStartVerse: GENESIS_CREATION_STORY.bibleStartVerse,
        bibleEndChapter: GENESIS_CREATION_STORY.bibleEndChapter,
        bibleEndVerse: GENESIS_CREATION_STORY.bibleEndVerse,
        status: GENESIS_CREATION_STORY.status,
        minAge: GENESIS_CREATION_STORY.minAge,
        maxAge: GENESIS_CREATION_STORY.maxAge,
        sourceNote: "Genesis 1 kid retelling. Catholic verified.",
      })
      .onConflictDoNothing({ target: stories.id });

    for (const page of GENESIS_CREATION_STORY.pages) {
      await db
        .insert(storyPages)
        .values({
          storyId: GENESIS_CREATION_STORY.id,
          position: page.position,
          text: page.text,
        })
        .onConflictDoNothing();
    }
  }

  console.log("Seeding verse of the day calendar mapping...");
  const today = new Date().toISOString().slice(0, 10);
  const featuredVerseId = SEED_FEATURED_VERSES[0]?.id;
  if (featuredVerseId) {
    await db
      .insert(verseOfTheDay)
      .values({
        day: today,
        locale: "en",
        featuredVerseId,
      })
      .onConflictDoNothing();
  }

  console.log("Bible seeding completed successfully.");
}
