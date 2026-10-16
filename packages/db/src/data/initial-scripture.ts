export interface SeedVerse {
  chapter: number;
  verse: number;
  text: string;
}

export interface SeedTranslation {
  id: number;
  code: string;
  name: string;
  language: string;
  level: "standard" | "easy";
  license: string;
  sourceUrl: string;
  attribution: string;
  isDefault: boolean;
}

export const DOUAY_RHEIMS_TRANSLATION: SeedTranslation = {
  id: 1,
  code: "drb",
  name: "Douay-Rheims Bible (Challoner Revision)",
  language: "en",
  level: "standard",
  license: "Public Domain",
  sourceUrl: "https://www.gutenberg.org/ebooks/1581",
  attribution: "Douay-Rheims Catholic Bible, Challoner revision, 1752 (Public Domain)",
  isDefault: true,
};

/** Genesis Chapter 1 (Douay-Rheims public domain text). */
export const GENESIS_1_VERSES: SeedVerse[] = [
  { chapter: 1, verse: 1, text: "In the beginning God created heaven, and earth." },
  {
    chapter: 1,
    verse: 2,
    text: "And the earth was void and empty, and darkness was upon the face of the deep; and the spirit of God moved over the waters.",
  },
  { chapter: 1, verse: 3, text: "And God said: Be light made. And light was made." },
  {
    chapter: 1,
    verse: 4,
    text: "And God saw the light that it was good; and he divided the light from the darkness.",
  },
  {
    chapter: 1,
    verse: 5,
    text: "And he called the light Day, and the darkness Night; and there was evening and morning one day.",
  },
  {
    chapter: 1,
    verse: 6,
    text: "And God said: Let there be a firmament made amidst the waters: and let it divide the waters from the waters.",
  },
  {
    chapter: 1,
    verse: 7,
    text: "And God made a firmament, and divided the waters that were under the firmament, from those that were above the firmament, and it was so.",
  },
  {
    chapter: 1,
    verse: 8,
    text: "And God called the firmament, Heaven; and the evening and morning were the second day.",
  },
  {
    chapter: 1,
    verse: 9,
    text: "God also said: Let the waters that are under the heaven, be gathered together into one place, and let the dry land appear. And it was so done.",
  },
  {
    chapter: 1,
    verse: 10,
    text: "And God called the dry land, Earth; and the gathering together of the waters, he called Seas. And God saw that it was good.",
  },
  {
    chapter: 1,
    verse: 11,
    text: "And he said: Let the earth bring forth green herb, and such as may seed, and the fruit tree yielding fruit after its kind, which may have seed in itself upon the earth. And it was so done.",
  },
  {
    chapter: 1,
    verse: 12,
    text: "And the earth brought forth the green herb, and such as yieldeth seed according to its kind, and the tree that beareth fruit, having seed each according to its kind. And God saw that it was good.",
  },
  { chapter: 1, verse: 13, text: "And the evening and the morning were the third day." },
  {
    chapter: 1,
    verse: 14,
    text: "And God said: Let there be lights made in the firmament of heaven, to divide the day and the night, and let them be for signs, and for seasons, and for days and years:",
  },
  {
    chapter: 1,
    verse: 15,
    text: "To shine in the firmament of heaven, and to give light upon the earth. And it was so done.",
  },
  {
    chapter: 1,
    verse: 16,
    text: "And God made two great lights: a greater light to rule the day; and a lesser light to rule the night: and the stars.",
  },
  {
    chapter: 1,
    verse: 17,
    text: "And he set them in the firmament of heaven to shine upon the earth.",
  },
  {
    chapter: 1,
    verse: 18,
    text: "And to rule the day and the night, and to divide the light and the darkness. And God saw that it was good.",
  },
  { chapter: 1, verse: 19, text: "And the evening and morning were the fourth day." },
  {
    chapter: 1,
    verse: 20,
    text: "God also said: Let the waters bring forth the creeping creature having life, and the fowl that may fly over the earth under the firmament of heaven.",
  },
  {
    chapter: 1,
    verse: 21,
    text: "And God created the great whales, and every living and moving creature, which the waters brought forth, according to their kinds, and every winged fowl according to its kind. And God saw that it was good.",
  },
  {
    chapter: 1,
    verse: 22,
    text: "And he blessed them, saying: Increase and multiply, and fill the waters of the sea: and let the birds be multiplied upon the earth.",
  },
  { chapter: 1, verse: 23, text: "And the evening and morning were the fifth day." },
  {
    chapter: 1,
    verse: 24,
    text: "And God said: Let the earth bring forth the living creature in its kind, cattle and creeping things, and beasts of the earth, according to their kinds. And it was so done.",
  },
  {
    chapter: 1,
    verse: 25,
    text: "And God made the beasts of the earth according to their kinds, and cattle, and every thing that creepeth on the earth after its kind. And God saw that it was good.",
  },
  {
    chapter: 1,
    verse: 26,
    text: "And he said: Let us make man to our image and likeness: and let him have dominion over the fishes of the sea, and the fowls of the air, and the beasts, and the whole earth, and every creeping creature that moveth upon the earth.",
  },
  {
    chapter: 1,
    verse: 27,
    text: "And God created man to his own image: to the image of God he created him: male and female he created them.",
  },
  {
    chapter: 1,
    verse: 28,
    text: "And God blessed them, saying: Increase and multiply, and fill the earth, and subdue it, and rule over the fishes of the sea, and the fowls of the air, and all living creatures that move upon the earth.",
  },
  {
    chapter: 1,
    verse: 29,
    text: "And God said: Behold I have given you every herb bearing seed upon the earth, and all trees that have in themselves seed of their own kind, to be your meat:",
  },
  {
    chapter: 1,
    verse: 30,
    text: "And to all beasts of the earth, and to every fowl of the air, and to all that move upon the earth, and wherein there is life, that they may have to feed upon. And it was so done.",
  },
  {
    chapter: 1,
    verse: 31,
    text: "And God saw all the things that he had made, and they were very good. And the evening and morning were the sixth day.",
  },
];

/** Psalms Chapter 23 (Douay-Rheims Psalm 22 Vulgate / 23 Hebrew). */
export const PSALM_23_VERSES: SeedVerse[] = [
  { chapter: 23, verse: 1, text: "The Lord ruleth me: and I shall want nothing." },
  {
    chapter: 23,
    verse: 2,
    text: "He hath set me in a place of pasture. He hath brought me up, on the water of refreshment:",
  },
  {
    chapter: 23,
    verse: 3,
    text: "He hath converted my soul. He hath led me on the paths of justice, for his own name's sake.",
  },
  {
    chapter: 23,
    verse: 4,
    text: "For though I should walk in the midst of the shadow of death, I will fear no evils: for thou art with me. Thy rod and thy staff, they have comforted me.",
  },
  {
    chapter: 23,
    verse: 5,
    text: "Thou hast prepared a table before me against them that afflict me. Thou hast anointed my head with oil; and my chalice which inebriateth me, how goodly is it!",
  },
  {
    chapter: 23,
    verse: 6,
    text: "And thy mercy will follow me all the days of my life. And that I may dwell in the house of the Lord unto length of days.",
  },
];

/** Matthew Chapter 5 Beatitudes (verses 1 to 14). */
export const MATTHEW_5_VERSES: SeedVerse[] = [
  {
    chapter: 5,
    verse: 1,
    text: "And seeing the multitudes, he went up into a mountain, and when he was set down, his disciples came unto him.",
  },
  { chapter: 5, verse: 2, text: "And opening his mouth, he taught them, saying:" },
  {
    chapter: 5,
    verse: 3,
    text: "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
  },
  { chapter: 5, verse: 4, text: "Blessed are the meek: for they shall possess the land." },
  { chapter: 5, verse: 5, text: "Blessed are they that mourn: for they shall be comforted." },
  {
    chapter: 5,
    verse: 6,
    text: "Blessed are they that hunger and thirst after justice: for they shall have their fill.",
  },
  { chapter: 5, verse: 7, text: "Blessed are the merciful: for they shall obtain mercy." },
  { chapter: 5, verse: 8, text: "Blessed are the clean of heart: for they shall see God." },
  {
    chapter: 5,
    verse: 9,
    text: "Blessed are the peacemakers: for they shall be called the children of God.",
  },
  {
    chapter: 5,
    verse: 10,
    text: "Blessed are they that suffer persecution for justice' sake: for theirs is the kingdom of heaven.",
  },
  {
    chapter: 5,
    verse: 11,
    text: "Blessed are ye when they shall revile you, and persecute you, and speak all that is evil against you, untruly, for my sake:",
  },
  {
    chapter: 5,
    verse: 12,
    text: "Be glad and rejoice, for your reward is very great in heaven. For so they persecuted the prophets that were before you.",
  },
  {
    chapter: 5,
    verse: 13,
    text: "You are the salt of the earth. But if the salt lose its savour, wherewith shall it be salted? It is good for nothing any more but to be cast out, and to be trodden on by men.",
  },
  {
    chapter: 5,
    verse: 14,
    text: "You are the light of the world. A city seated on a mountain cannot be hid.",
  },
];

/** John Chapter 1 (verses 1 to 14). */
export const JOHN_1_VERSES: SeedVerse[] = [
  {
    chapter: 1,
    verse: 1,
    text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
  },
  { chapter: 1, verse: 2, text: "The same was in the beginning with God." },
  {
    chapter: 1,
    verse: 3,
    text: "All things were made by him: and without him was made nothing that was made.",
  },
  { chapter: 1, verse: 4, text: "In him was life, and the life was the light of men." },
  {
    chapter: 1,
    verse: 5,
    text: "And the light shineth in darkness, and the darkness did not comprehend it.",
  },
  { chapter: 1, verse: 6, text: "There was a man sent from God, whose name was John." },
  {
    chapter: 1,
    verse: 7,
    text: "This man came for a witness, to give testimony of the light, that all men might believe through him.",
  },
  { chapter: 1, verse: 8, text: "He was not the light, but was to give testimony of the light." },
  {
    chapter: 1,
    verse: 9,
    text: "That was the true light, which enlighteneth every man that cometh into this world.",
  },
  {
    chapter: 1,
    verse: 10,
    text: "He was in the world, and the world was made by him, and the world knew him not.",
  },
  { chapter: 1, verse: 11, text: "He came unto his own, and his own received him not." },
  {
    chapter: 1,
    verse: 12,
    text: "But as many as received him, he gave them power to be made the sons of God, to them that believe in his name.",
  },
  {
    chapter: 1,
    verse: 13,
    text: "Who are born, not of blood, nor of the will of the flesh, nor of the will of man, but of God.",
  },
  {
    chapter: 1,
    verse: 14,
    text: "And the Word was made flesh, and dwelt among us, (and we saw his glory, the glory as it were of the only begotten of the Father,) full of grace and truth.",
  },
];

export interface CuratedFeaturedVerse {
  id: string;
  bookId: number;
  bookName: string;
  bookCode: string;
  startChapter: number;
  startVerse: number;
  endChapter: number;
  endVerse: number;
  citation: string;
  text: string;
  meaning: string;
  minAge: number;
  maxAge: number;
  status: "published";
  sourceNote: string;
}

export const SEED_FEATURED_VERSES: CuratedFeaturedVerse[] = [
  {
    id: "f1a10001-0001-4000-8000-000000000001",
    bookId: 1,
    bookName: "Genesis",
    bookCode: "gen",
    startChapter: 1,
    startVerse: 1,
    endChapter: 1,
    endVerse: 1,
    citation: "Genesis 1:1",
    text: "In the beginning God created heaven, and earth.",
    meaning:
      "God is the loving Creator of all things, and everything He made began with His goodness.",
    minAge: 3,
    maxAge: 15,
    status: "published",
    sourceNote: "Douay-Rheims Challoner Revision (Genesis 1:1). Catholic verified.",
  },
  {
    id: "f1a10001-0001-4000-8000-000000000002",
    bookId: 23,
    bookName: "Psalms",
    bookCode: "ps",
    startChapter: 23,
    startVerse: 1,
    endChapter: 23,
    endVerse: 1,
    citation: "Psalm 23:1",
    text: "The Lord ruleth me: and I shall want nothing.",
    meaning:
      "God guides and protects you like a faithful shepherd, so you can always trust Him when you feel worried.",
    minAge: 3,
    maxAge: 15,
    status: "published",
    sourceNote: "Douay-Rheims Challoner Revision (Psalm 22 Vulgate / 23). Catholic verified.",
  },
  {
    id: "f1a10001-0001-4000-8000-000000000003",
    bookId: 47,
    bookName: "Matthew",
    bookCode: "matt",
    startChapter: 5,
    startVerse: 14,
    endChapter: 5,
    endVerse: 14,
    citation: "Matthew 5:14",
    text: "You are the light of the world. A city seated on a mountain cannot be hid.",
    meaning:
      "When you share kindness, honesty, and love with others, you shine Jesus' light for everyone to see.",
    minAge: 7,
    maxAge: 15,
    status: "published",
    sourceNote: "Douay-Rheims Challoner Revision (Matthew 5:14). Catholic verified.",
  },
  {
    id: "f1a10001-0001-4000-8000-000000000004",
    bookId: 50,
    bookName: "John",
    bookCode: "john",
    startChapter: 1,
    startVerse: 5,
    endChapter: 1,
    endVerse: 5,
    citation: "John 1:5",
    text: "And the light shineth in darkness, and the darkness did not comprehend it.",
    meaning: "God's truth and love are stronger than any fear or darkness you might ever face.",
    minAge: 8,
    maxAge: 15,
    status: "published",
    sourceNote: "Douay-Rheims Challoner Revision (John 1:5). Catholic verified.",
  },
  {
    id: "f1a10001-0001-4000-8000-000000000005",
    bookId: 57,
    bookName: "Philippians",
    bookCode: "phil",
    startChapter: 4,
    startVerse: 13,
    endChapter: 4,
    endVerse: 13,
    citation: "Philippians 4:13",
    text: "I can do all things in him who strengtheneth me.",
    meaning: "When tasks feel hard, ask Jesus for courage and strength to do your best.",
    minAge: 7,
    maxAge: 15,
    status: "published",
    sourceNote: "Douay-Rheims Challoner Revision (Philippians 4:13). Catholic verified.",
  },
  {
    id: "f1a10001-0001-4000-8000-000000000006",
    bookId: 69,
    bookName: "1 John",
    bookCode: "1john",
    startChapter: 4,
    startVerse: 19,
    endChapter: 4,
    endVerse: 19,
    citation: "1 John 4:19",
    text: "Let us therefore love God, because God first hath loved us.",
    meaning: "We learn how to be kind and caring because God loved us first with all His heart.",
    minAge: 3,
    maxAge: 15,
    status: "published",
    sourceNote: "Douay-Rheims Challoner Revision (1 John 4:19). Catholic verified.",
  },
  {
    id: "f1a10001-0001-4000-8000-000000000007",
    bookId: 24,
    bookName: "Proverbs",
    bookCode: "prov",
    startChapter: 3,
    startVerse: 5,
    endChapter: 3,
    endVerse: 5,
    citation: "Proverbs 3:5",
    text: "Have confidence in the Lord with all thy heart, and lean not upon thy own prudence.",
    meaning:
      "Trust God's gentle guidance with your whole heart, especially when you need help making the right choice.",
    minAge: 8,
    maxAge: 15,
    status: "published",
    sourceNote: "Douay-Rheims Challoner Revision (Proverbs 3:5). Catholic verified.",
  },
];

export interface SeedStoryPage {
  position: number;
  text: string;
}

export interface SeedStory {
  id: string;
  slug: string;
  title: string;
  summary: string;
  kindSlug: string;
  readingMinutes: number;
  author: string;
  bibleBookId: number;
  bibleStartChapter: number;
  bibleStartVerse: number;
  bibleEndChapter: number;
  bibleEndVerse: number;
  minAge: number;
  maxAge: number;
  status: "published";
  pages: SeedStoryPage[];
}

export const GENESIS_CREATION_STORY: SeedStory = {
  id: "s1a10001-0001-4000-8000-000000000001",
  slug: "god-creates-the-beautiful-world",
  title: "God Creates the Beautiful World",
  summary:
    "In the beginning, God made the shining stars, bright blue skies, green trees, animals, and people with loving care.",
  kindSlug: "bible",
  readingMinutes: 3,
  author: "Kid Zone Catechism Team",
  bibleBookId: 1,
  bibleStartChapter: 1,
  bibleStartVerse: 1,
  bibleEndChapter: 1,
  bibleEndVerse: 31,
  minAge: 3,
  maxAge: 7,
  status: "published",
  pages: [
    {
      position: 1,
      text: "In the beginning, God created the heavens and the earth. God said, 'Let there be light!' And bright, warm light filled the whole world.",
    },
    {
      position: 2,
      text: "God made the clear blue sky above and the deep blue oceans below. Friendly waves splashed gently on the sandy shores.",
    },
    {
      position: 3,
      text: "God made soft green grass, tall fruit trees, and lovely flowers in every bright color you can imagine.",
    },
    {
      position: 4,
      text: "God placed the bright golden sun in the sky by day, and the silver moon with sparkling stars to glow at night.",
    },
    {
      position: 5,
      text: "God created swimming fish in the sea, singing birds high in the trees, and playful animals across the land.",
    },
    {
      position: 6,
      text: "Finally, God created people in His own loving image to care for the world. God looked at everything He had made, and it was very good!",
    },
  ],
};
