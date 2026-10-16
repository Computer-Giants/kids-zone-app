export interface TileMatchingPairItem {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  matchId: string;
}

export interface TileMatchingConfigData {
  pairs: TileMatchingPairItem[];
}

export interface WordSearchWordItem {
  word: string;
  hint: string;
  start: [number, number];
  end: [number, number];
}

export interface WordSearchConfigData {
  grid: string[][];
  words: WordSearchWordItem[];
}

export interface WordScrambleConfigData {
  scrambled: string;
  targetWord: string;
  clue: string;
  letterBank: string[];
  funFact?: string;
}

export type PuzzleCategory = "church" | "saints" | "bible" | "catechism";

export interface SeedPuzzle {
  id: string;
  slug: string;
  type: "matching" | "word_search" | "scramble";
  title: string;
  instructions: string;
  difficulty: 1 | 2 | 3;
  category: PuzzleCategory;
  minAge: number;
  maxAge: number;
  themeTag: string;
  config: TileMatchingConfigData | WordSearchConfigData | WordScrambleConfigData;
}

export const SEED_PUZZLES: readonly SeedPuzzle[] = [
  {
    id: "puz10001-0001-4000-8000-000000000001",
    slug: "sacred-altar-vessels",
    type: "matching",
    title: "Sacred Altar Vessels",
    instructions:
      "Tap the cards to find matching pairs of sacred items used on the holy altar during Mass.",
    difficulty: 1,
    category: "church",
    minAge: 3,
    maxAge: 8,
    themeTag: "Church",
    config: {
      pairs: [
        {
          id: "chalice-1",
          label: "Chalice",
          icon: "🍷",
          description: "The golden cup holding the Precious Blood of Jesus",
          matchId: "chalice",
        },
        {
          id: "chalice-2",
          label: "Chalice",
          icon: "🍷",
          description: "The golden cup holding the Precious Blood of Jesus",
          matchId: "chalice",
        },
        {
          id: "paten-1",
          label: "Paten",
          icon: "🟡",
          description: "The sacred plate holding the holy host",
          matchId: "paten",
        },
        {
          id: "paten-2",
          label: "Paten",
          icon: "🟡",
          description: "The sacred plate holding the holy host",
          matchId: "paten",
        },
        {
          id: "crucifix-1",
          label: "Crucifix",
          icon: "✝️",
          description: "The holy cross reminding us of Jesus' great love",
          matchId: "crucifix",
        },
        {
          id: "crucifix-2",
          label: "Crucifix",
          icon: "✝️",
          description: "The holy cross reminding us of Jesus' great love",
          matchId: "crucifix",
        },
        {
          id: "candle-1",
          label: "Altar Candle",
          icon: "🕯️",
          description: "The living flame shining brightly for the Light of Christ",
          matchId: "candle",
        },
        {
          id: "candle-2",
          label: "Altar Candle",
          icon: "🕯️",
          description: "The living flame shining brightly for the Light of Christ",
          matchId: "candle",
        },
      ],
    },
  },
  {
    id: "puz10001-0001-4000-8000-000000000002",
    slug: "holy-saints-of-god",
    type: "word_search",
    title: "Holy Saints of God",
    instructions: "Find the names of holy heroes hidden across the letter grid.",
    difficulty: 2,
    category: "saints",
    minAge: 8,
    maxAge: 15,
    themeTag: "Saints",
    config: {
      grid: [
        ["F", "R", "A", "N", "C", "I", "S", "B"],
        ["D", "O", "V", "E", "G", "O", "D", "E"],
        ["P", "A", "T", "R", "I", "C", "K", "L"],
        ["H", "O", "L", "Y", "J", "O", "Y", "L"],
        ["A", "M", "A", "R", "Y", "S", "P", "S"],
        ["L", "A", "M", "B", "P", "E", "A", "C"],
        ["F", "A", "P", "E", "T", "E", "R", "X"],
        ["G", "R", "A", "C", "E", "H", "I", "M"],
      ],
      words: [
        {
          word: "FRANCIS",
          hint: "Saint who loved all God's animals and praised Brother Sun",
          start: [0, 0],
          end: [0, 6],
        },
        {
          word: "PATRICK",
          hint: "Bishop who taught Ireland about the Holy Trinity with a shamrock",
          start: [2, 0],
          end: [2, 6],
        },
        {
          word: "MARY",
          hint: "Our Blessed Mother who said yes to God with joyful love",
          start: [4, 1],
          end: [4, 4],
        },
        {
          word: "PETER",
          hint: "The rock upon whom Jesus built His holy Church",
          start: [6, 2],
          end: [6, 6],
        },
      ],
    },
  },
  {
    id: "puz10001-0001-4000-8000-000000000003",
    slug: "holy-week-and-easter",
    type: "scramble",
    title: "Holy Week & Easter",
    instructions: "Unscramble the holy word to celebrate the glorious Resurrection of Jesus.",
    difficulty: 2,
    category: "bible",
    minAge: 7,
    maxAge: 12,
    themeTag: "Bible",
    config: {
      scrambled: "LAULEILA",
      targetWord: "ALLELUIA",
      clue: "The joyful song of praise we sing with glad hearts at Easter Mass",
      letterBank: ["A", "L", "L", "E", "L", "U", "I", "A"],
      funFact: "Alleluia comes from Hebrew meaning 'Praise the Lord'!",
    },
  },
  {
    id: "puz10001-0001-4000-8000-000000000004",
    slug: "sacred-church-symbols",
    type: "matching",
    title: "Sacred Church Symbols",
    instructions: "Match the signs and holy symbols we see in our Catholic parish.",
    difficulty: 1,
    category: "church",
    minAge: 3,
    maxAge: 10,
    themeTag: "Church",
    config: {
      pairs: [
        {
          id: "bell-1",
          label: "Altar Bells",
          icon: "🔔",
          description: "Rung with joyful reverence during the holy Mass",
          matchId: "bell",
        },
        {
          id: "bell-2",
          label: "Altar Bells",
          icon: "🔔",
          description: "Rung with joyful reverence during the holy Mass",
          matchId: "bell",
        },
        {
          id: "water-1",
          label: "Holy Water",
          icon: "💧",
          description: "Reminds us of our Baptism and God's cleansing grace",
          matchId: "water",
        },
        {
          id: "water-2",
          label: "Holy Water",
          icon: "💧",
          description: "Reminds us of our Baptism and God's cleansing grace",
          matchId: "water",
        },
        {
          id: "dove-1",
          label: "Holy Spirit Dove",
          icon: "🕊️",
          description: "Brings the peace and wisdom of God into our hearts",
          matchId: "dove",
        },
        {
          id: "dove-2",
          label: "Holy Spirit Dove",
          icon: "🕊️",
          description: "Brings the peace and wisdom of God into our hearts",
          matchId: "dove",
        },
        {
          id: "rosary-1",
          label: "Holy Rosary",
          icon: "📿",
          description: "A gentle string of prayers meditating on the life of Christ",
          matchId: "rosary",
        },
        {
          id: "rosary-2",
          label: "Holy Rosary",
          icon: "📿",
          description: "A gentle string of prayers meditating on the life of Christ",
          matchId: "rosary",
        },
      ],
    },
  },
];

export function getPuzzleBySlug(slug: string): SeedPuzzle | undefined {
  return SEED_PUZZLES.find((p) => p.slug === slug);
}

export function getPuzzlesByType(type: string): SeedPuzzle[] {
  return SEED_PUZZLES.filter((p) => p.type === type);
}

export function getPuzzlesByDifficulty(difficulty: number): SeedPuzzle[] {
  return SEED_PUZZLES.filter((p) => p.difficulty === difficulty);
}
