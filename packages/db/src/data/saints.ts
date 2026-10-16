export interface SeedPatronage {
  id: number;
  slug: string;
  label: string;
}

export interface SeedSaintFunFact {
  position: number;
  text: string;
}

export interface SeedSaintPlace {
  kind: "birth" | "death" | "ministry" | "shrine" | "tomb";
  placeName: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
  note?: string;
}

export interface SeedSaintStoryPage {
  position: number;
  text: string;
  illustrationDesc?: string;
}

export interface SeedSaintStory {
  id: string;
  slug: string;
  title: string;
  summary: string;
  author: string;
  readingMinutes: number;
  pages: SeedSaintStoryPage[];
}

export interface SeedSaint {
  id: string;
  slug: string;
  name: string;
  title: string;
  tagline: string;
  feastMonth: number;
  feastDay: number;
  feastNote?: string;
  birthYear?: number;
  deathYear?: number;
  eraLabel: string;
  countryCodes: string[];
  searchAliases: string[];
  prayer: string;
  patronages: string[];
  funFacts: SeedSaintFunFact[];
  places: SeedSaintPlace[];
  story?: SeedSaintStory;
  virtueTags: string[];
  minAge: number;
  maxAge: number;
}

export const SEED_PATRONAGES: readonly SeedPatronage[] = [
  { id: 1, slug: "animals", label: "Animals & Ecology" },
  { id: 2, slug: "children", label: "Children & Students" },
  { id: 3, slug: "lost-items", label: "Lost Things" },
  { id: 4, slug: "missions", label: "Missions & Missionaries" },
  { id: 5, slug: "musicians", label: "Music & Musicians" },
  { id: 6, slug: "sailors", label: "Sailors & Travellers" },
  { id: 7, slug: "workers", label: "Fathers & Workers" },
  { id: 8, slug: "courage", label: "Courage & Soldiers" },
  { id: 9, slug: "ireland", label: "Ireland & Celtic Faith" },
];

export const SEED_SAINTS: readonly SeedSaint[] = [
  {
    id: "a1a10001-0001-4000-8000-000000000001",
    slug: "francis-of-assisi",
    name: "Francis of Assisi",
    title: "St.",
    tagline: "The joyful brother to all creation and friend of the poor",
    feastMonth: 10,
    feastDay: 4,
    birthYear: 1181,
    deathYear: 1226,
    eraLabel: "13th Century (Medieval Italy)",
    countryCodes: ["IT"],
    searchAliases: ["Francesco", "Brother Francis", "Il Poverello"],
    prayer:
      "Lord, make me an instrument of Thy peace; where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; and where there is sadness, joy.",
    patronages: ["animals", "ecology", "peace"],
    virtueTags: ["Humility", "Peacemaking", "Kindness", "Poverty of Spirit"],
    minAge: 3,
    maxAge: 15,
    funFacts: [
      {
        position: 1,
        text: "Francis created the very first Christmas Nativity manger scene with live animals in Greccio, Italy!",
      },
      {
        position: 2,
        text: "He preached a gentle sermon to a flock of birds, who listened quietly without flying away.",
      },
      {
        position: 3,
        text: "Francis loved nature so dearly he wrote the Canticle of the Sun, calling the sun his brother and the moon his sister.",
      },
    ],
    places: [
      {
        kind: "birth",
        placeName: "Assisi",
        countryCode: "IT",
        latitude: 43.0707,
        longitude: 12.6196,
        note: "Born into a wealthy cloth merchant family",
      },
      {
        kind: "ministry",
        placeName: "Gubbio",
        countryCode: "IT",
        latitude: 43.3512,
        longitude: 12.5772,
        note: "Made peace between the frightened townspeople and the fierce wolf",
      },
      {
        kind: "shrine",
        placeName: "Basilica of Saint Francis",
        countryCode: "IT",
        latitude: 43.0747,
        longitude: 12.6056,
        note: "His sacred tomb visited by millions of pilgrims",
      },
    ],
    story: {
      id: "b1a10001-0001-4000-8000-000000000001",
      slug: "st-francis-and-the-wolf",
      title: "Saint Francis and the Peaceful Wolf",
      summary: "How gentle Saint Francis tamed a fierce wolf in Gubbio with love and kindness.",
      author: "Catholic Children's Treasury",
      readingMinutes: 3,
      pages: [
        {
          position: 1,
          text: "Once in the Italian mountain town of Gubbio, the villagers were frightened because a hungry, fierce wolf wandered outside their stone gates.",
        },
        {
          position: 2,
          text: "Gentle Saint Francis smiled and walked out into the woods alone to meet the wolf. He made the Sign of the Cross and said softly: 'Brother Wolf, come in peace.'",
        },
        {
          position: 3,
          text: "Miraculously, the fierce wolf stopped growling! He lowered his ears, trotted over to Saint Francis, and gently rested his heavy head on Francis's brown robe.",
        },
        {
          position: 4,
          text: "Francis promised the wolf: 'Brother Wolf, the people will feed you every day if you promise never to hurt anyone again.' The wolf lifted his paw into Francis's hand to agree!",
        },
        {
          position: 5,
          text: "From that day on, Brother Wolf lived happily inside Gubbio, playing with children and sleeping quietly beside house doors as a beloved friend.",
        },
      ],
    },
  },
  {
    id: "a1a10001-0001-4000-8000-000000000002",
    slug: "therese-of-lisieux",
    name: "Thérèse of Lisieux",
    title: "St.",
    tagline: "The Little Flower who taught us to do small things with great love",
    feastMonth: 10,
    feastDay: 1,
    birthYear: 1873,
    deathYear: 1897,
    eraLabel: "19th Century (France)",
    countryCodes: ["FR"],
    searchAliases: ["The Little Flower", "Therese Martin", "Doctor of the Church"],
    prayer:
      "O Jesus, my gentle Lord, give me the simplicity of a little child. Help me to do all my small daily actions, chores, and prayers with immense love for You and my family.",
    patronages: ["missions", "florists", "children"],
    virtueTags: ["Love", "Simplicity", "Humility", "Generosity"],
    minAge: 3,
    maxAge: 15,
    funFacts: [
      {
        position: 1,
        text: "She promised from heaven to spend her eternity doing good on earth by letting fall a shower of roses.",
      },
      {
        position: 2,
        text: "Thérèse is one of only four women Doctors of the Universal Catholic Church.",
      },
      {
        position: 3,
        text: "Her famous spiritual approach is called 'The Little Way', proving that anyone can be a saint right at home.",
      },
    ],
    places: [
      {
        kind: "birth",
        placeName: "Alençon",
        countryCode: "FR",
        latitude: 48.4329,
        longitude: 0.0931,
        note: "Born to holy parents Saints Louis and Zélie Martin",
      },
      {
        kind: "shrine",
        placeName: "Lisieux",
        countryCode: "FR",
        latitude: 49.1459,
        longitude: 0.2278,
        note: "Carmelite monastery where she lived and prayed",
      },
    ],
    story: {
      id: "b1a10001-0001-4000-8000-000000000002",
      slug: "st-therese-the-little-way",
      title: "The Little Flower's Secret of Love",
      summary: "How little Thérèse discovered that small acts done with love make a great saint.",
      author: "Catholic Children's Treasury",
      readingMinutes: 3,
      pages: [
        {
          position: 1,
          text: "When Thérèse was a girl in France, she wanted to do heroic things for God, like the great martyrs and missionaries she read about in church.",
        },
        {
          position: 2,
          text: "One day while praying, she realized: 'I am too small for great deeds. But like a little wildflower, I can please God by doing small things with great love!'",
        },
        {
          position: 3,
          text: "Whenever someone was unkind, Thérèse offered a sweet smile. Whenever chores were boring, she swept the floor singing a hymn for Jesus.",
        },
        {
          position: 4,
          text: "She called this her 'Little Way' of spiritual childhood. She taught that picking up a stray pin from the floor with love can save a soul.",
        },
        {
          position: 5,
          text: "Jesus loved her joyful heart so much that Thérèse became one of the greatest teachers of the Church, showering roses of blessing upon the world.",
        },
      ],
    },
  },
  {
    id: "a1a10001-0001-4000-8000-000000000003",
    slug: "patrick",
    name: "Patrick of Ireland",
    title: "St.",
    tagline: "The courageous shepherd who illuminated Ireland with the Holy Trinity",
    feastMonth: 3,
    feastDay: 17,
    birthYear: 385,
    deathYear: 461,
    eraLabel: "5th Century (Britain & Ireland)",
    countryCodes: ["IE", "GB"],
    searchAliases: ["Padraig", "Apostle of Ireland", "Patricius"],
    prayer:
      "Christ with me, Christ before me, Christ behind me, Christ in me, Christ beneath me, Christ above me, Christ on my right, Christ on my left, Christ when I lie down, Christ when I sit down, Christ when I arise.",
    patronages: ["ireland", "sailors"],
    virtueTags: ["Faith", "Forgiveness", "Courage", "Zeal"],
    minAge: 3,
    maxAge: 15,
    funFacts: [
      {
        position: 1,
        text: "Patrick used a tiny green three-leaf clover shamrock to explain the Mystery of the Holy Trinity: Three Persons in One God!",
      },
      {
        position: 2,
        text: "While tending sheep in captivity as a teenager, he prayed over a hundred times every day and night.",
      },
      {
        position: 3,
        text: "He returned to the very land where he had been held captive to bring forgiveness, baptism, and peace.",
      },
    ],
    places: [
      {
        kind: "ministry",
        placeName: "Slemish Mountain",
        countryCode: "IE",
        latitude: 54.8767,
        longitude: -6.1102,
        note: "Where he tended sheep and prayed to God constantly",
      },
      {
        kind: "shrine",
        placeName: "Downpatrick",
        countryCode: "GB",
        latitude: 54.3267,
        longitude: -5.7175,
        note: "Traditional burial place marked with a memorial stone",
      },
    ],
    story: {
      id: "b1a10001-0001-4000-8000-000000000003",
      slug: "st-patrick-and-the-shamrock",
      title: "Saint Patrick and the Green Shamrock",
      summary: "How Patrick brought God's light to Ireland using a humble green clover.",
      author: "Catholic Children's Treasury",
      readingMinutes: 3,
      pages: [
        {
          position: 1,
          text: "Long ago, green Ireland did not know about Jesus Christ. Brave Saint Patrick sailed across stormy seas with a heart full of prayer to tell them the Good News.",
        },
        {
          position: 2,
          text: "When Irish kings asked: 'How can God be Three Persons in One God?', Patrick bent down to the green grass and gently plucked a tiny shamrock.",
        },
        {
          position: 3,
          text: "'Look at this little clover,' Patrick smiled warmly. 'Here is one leaf, here is a second leaf, and here is a third leaf. Yet they are all on one single stem!'",
        },
        {
          position: 4,
          text: "'In the same way: the Father, the Son, and the Holy Spirit are Three Divine Persons, yet One true and loving God.' The people understood and rejoiced!",
        },
        {
          position: 5,
          text: "Patrick built churches, baptized thousands of believers, and filled the Emerald Isle with bells of faith that still ring today.",
        },
      ],
    },
  },
  {
    id: "a1a10001-0001-4000-8000-000000000004",
    slug: "anthony-of-padua",
    name: "Anthony of Padua",
    title: "St.",
    tagline: "The eloquent preacher, friend of the poor, and helper with lost things",
    feastMonth: 6,
    feastDay: 13,
    birthYear: 1195,
    deathYear: 1231,
    eraLabel: "13th Century (Portugal & Italy)",
    countryCodes: ["PT", "IT"],
    searchAliases: ["Antonio", "Wonderworker of Padua", "Doctor of the Church"],
    prayer:
      "Blessed Saint Anthony, gentle servant of Jesus and Mary, obtain for me the grace to restore what I have lost, and above all, to never lose the love and friendship of Jesus Christ.",
    patronages: ["lost-items", "children"],
    virtueTags: ["Patience", "Charity", "Preaching", "Wisdom"],
    minAge: 3,
    maxAge: 15,
    funFacts: [
      {
        position: 1,
        text: "Anthony once preached by the seashore when people refused to listen, and hundreds of fish poked their heads out of the water to hear him!",
      },
      {
        position: 2,
        text: "Catholic families around the world give 'St. Anthony's Bread' to feed hungry families in gratitude for answered prayers.",
      },
      {
        position: 3,
        text: "He was holding the Infant Jesus in his arms during prayer when a fellow brother saw heavenly light radiating through the room.",
      },
    ],
    places: [
      {
        kind: "birth",
        placeName: "Lisbon",
        countryCode: "PT",
        latitude: 38.7223,
        longitude: -9.1393,
        note: "Born Fernando Martins de Bulhões",
      },
      {
        kind: "shrine",
        placeName: "Basilica of Saint Anthony, Padua",
        countryCode: "IT",
        latitude: 45.4014,
        longitude: 11.8803,
        note: "Magnificent church housing his sacred relics",
      },
    ],
    story: {
      id: "b1a10001-0001-4000-8000-000000000004",
      slug: "st-anthony-and-the-fish",
      title: "Saint Anthony and the Sermon to the Fish",
      summary: "How the fish of the sea gathered to praise God when Saint Anthony spoke.",
      author: "Catholic Children's Treasury",
      readingMinutes: 3,
      pages: [
        {
          position: 1,
          text: "Saint Anthony traveled to Rimini to tell the people about God's mercy, but the crowd was stubborn and walked away, closing their ears.",
        },
        {
          position: 2,
          text: "Anthony walked down to where the river met the sea and cried: 'Hear the word of the Lord, you fishes of the sea, since people refuse to listen!'",
        },
        {
          position: 3,
          text: "Suddenly, the water began to ripple! Little fish, medium fish, and great fish swam in neat rows, poking their shining heads above the water.",
        },
        {
          position: 4,
          text: "'My brother fish,' Anthony preached, 'you must thank God who gave you clear water to swim in and food to eat!' The fish opened their mouths and bowed their heads in praise.",
        },
        {
          position: 5,
          text: "Seeing this wonder, the townspeople ran to the shore in amazement and fell on their knees to listen to Saint Anthony's holy message.",
        },
      ],
    },
  },
  {
    id: "a1a10001-0001-4000-8000-000000000005",
    slug: "nicholas-of-myra",
    name: "Nicholas of Myra",
    title: "St.",
    tagline: "The generous bishop who protected children and inspired secret giving",
    feastMonth: 12,
    feastDay: 6,
    birthYear: 270,
    deathYear: 343,
    eraLabel: "4th Century (Ancient Asia Minor)",
    countryCodes: ["TR", "GR", "IT"],
    searchAliases: ["Nikolaos", "Bishop of Myra", "Santa Claus"],
    prayer:
      "God of mercy, by the prayers of Saint Nicholas, keep us safe in all dangers and grant us generous hearts that seek to give secretly without expecting praise in return.",
    patronages: ["children", "sailors"],
    virtueTags: ["Generosity", "Secret Charity", "Justice", "Fatherhood"],
    minAge: 3,
    maxAge: 15,
    funFacts: [
      {
        position: 1,
        text: "Nicholas secretly tossed three bags of gold through an open window at night to help three poor sisters.",
      },
      {
        position: 2,
        text: "He was a bishop who attended the Council of Nicaea in 325 AD and helped write the Catholic Creed we profess at Mass!",
      },
      {
        position: 3,
        text: "Children leave shoes by the hearth on December 5th to receive gold coins, fruit, and sweet treats in honor of his feast.",
      },
    ],
    places: [
      {
        kind: "birth",
        placeName: "Patara",
        countryCode: "TR",
        latitude: 36.2619,
        longitude: 29.3138,
        note: "Ancient seaport where he gave away his family inheritance to the poor",
      },
      {
        kind: "ministry",
        placeName: "Myra (Demre)",
        countryCode: "TR",
        latitude: 36.2444,
        longitude: 29.9856,
        note: "Ancient cathedral where he served as beloved bishop",
      },
      {
        kind: "shrine",
        placeName: "Bari",
        countryCode: "IT",
        latitude: 41.1306,
        longitude: 16.8703,
        note: "Basilica where his relics rest and produce holy manna",
      },
    ],
    story: {
      id: "b1a10001-0001-4000-8000-000000000005",
      slug: "st-nicholas-secret-gifts",
      title: "Saint Nicholas and the Secret Gold",
      summary: "How Bishop Nicholas gave secret gifts in the dark of night to save a poor family.",
      author: "Catholic Children's Treasury",
      readingMinutes: 3,
      pages: [
        {
          position: 1,
          text: "Long ago in the town of Patara, a poor father had three loving daughters, but he had no money to feed them or help them marry.",
        },
        {
          position: 2,
          text: "Young Nicholas heard of their sorrow. He had inherited wealth from his parents, but he wanted to give for God's glory alone, not for praise.",
        },
        {
          position: 3,
          text: "When everyone was fast asleep, Nicholas wrapped gold coins in a round cloth and quietly tossed it through the open window, landing right inside a stocking hung by the hearth to dry!",
        },
        {
          position: 4,
          text: "He did this three times in secret under the starry night sky, weeping with joy when he saw the father shed tears of grateful thanksgiving to God.",
        },
        {
          position: 5,
          text: "Nicholas became the holy bishop of Myra, teaching the world that the truest joy comes from giving with a pure and silent heart.",
        },
      ],
    },
  },
  {
    id: "a1a10001-0001-4000-8000-000000000006",
    slug: "joan-of-arc",
    name: "Joan of Arc",
    title: "St.",
    tagline: "The brave maiden of Domrémy who followed God's calling with unfailing trust",
    feastMonth: 5,
    feastDay: 30,
    birthYear: 1412,
    deathYear: 1431,
    eraLabel: "15th Century (France)",
    countryCodes: ["FR"],
    searchAliases: ["Jeanne d'Arc", "Maid of Orléans"],
    prayer:
      "Saint Joan of Arc, courageous and faithful maiden, teach me to listen for God's gentle voice in prayer and give me the bravery to do what is right, even when it is difficult.",
    patronages: ["courage"],
    virtueTags: ["Courage", "Loyalty", "Prayer", "Obedience"],
    minAge: 6,
    maxAge: 15,
    funFacts: [
      {
        position: 1,
        text: "Joan carried a white banner bearing the holy names 'Jesus and Mary' into battle rather than a sword.",
      },
      {
        position: 2,
        text: "She was only seventeen years old when she led the French army to victory at the siege of Orléans!",
      },
      {
        position: 3,
        text: "She heard heavenly voices from Saint Michael the Archangel and Saint Catherine encouraging her.",
      },
    ],
    places: [
      {
        kind: "birth",
        placeName: "Domrémy",
        countryCode: "FR",
        latitude: 48.4428,
        longitude: 5.6744,
        note: "Where she prayed in church and heard the angel's voice",
      },
      {
        kind: "ministry",
        placeName: "Orléans",
        countryCode: "FR",
        latitude: 47.9029,
        longitude: 1.9093,
        note: "Liberated the besieged city carrying her white banner",
      },
    ],
  },
  {
    id: "a1a10001-0001-4000-8000-000000000007",
    slug: "joseph",
    name: "Joseph, Spouse of Mary",
    title: "St.",
    tagline: "The silent protector of the Holy Family and patron of workers",
    feastMonth: 3,
    feastDay: 19,
    feastNote: "Also celebrated May 1 as St. Joseph the Worker",
    eraLabel: "1st Century (Holy Land)",
    countryCodes: ["IL", "PS", "EG"],
    searchAliases: ["San Giuseppe", "Foster Father of Jesus", "Terror of Demons"],
    prayer:
      "Saint Joseph, pure and faithful guardian of the Virgin Mary and foster father of Jesus Christ, watch over our family, protect our home, and teach us to work with honesty and joy.",
    patronages: ["workers"],
    virtueTags: ["Patience", "Protection", "Silence", "Faithfulness"],
    minAge: 3,
    maxAge: 15,
    funFacts: [
      {
        position: 1,
        text: "In the whole Bible, Saint Joseph does not speak a single word; he is the great man of faithful action!",
      },
      {
        position: 2,
        text: "He taught the young Jesus how to work with wood and tools in his carpenter workshop in Nazareth.",
      },
      {
        position: 3,
        text: "God spoke to Joseph in four holy dreams, and Joseph obeyed immediately every single time.",
      },
    ],
    places: [
      {
        kind: "birth",
        placeName: "Nazareth",
        countryCode: "IL",
        latitude: 32.7019,
        longitude: 35.3033,
        note: "Where he lived with Mary and Jesus",
      },
      {
        kind: "ministry",
        placeName: "Egypt",
        countryCode: "EG",
        latitude: 30.0444,
        longitude: 31.2357,
        note: "Protected Mary and the Infant Jesus from King Herod",
      },
    ],
  },
];

export function getSaintBySlug(slug: string): SeedSaint | undefined {
  return SEED_SAINTS.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
}

export function getSaintOfTheDay(dateStr?: string): SeedSaint {
  const d = dateStr ? new Date(dateStr) : new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  // 1. Direct feast day match
  const feastMatch = SEED_SAINTS.find((s) => s.feastMonth === month && s.feastDay === day);
  if (feastMatch) return feastMatch;

  // 2. Deterministic calendar hash for dates without a direct seed feast
  const dateKey = `${month}-${day}`;
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % SEED_SAINTS.length;
  return SEED_SAINTS[index]!;
}

export function getRandomSaint(excludeSlug?: string): SeedSaint {
  const pool = excludeSlug ? SEED_SAINTS.filter((s) => s.slug !== excludeSlug) : SEED_SAINTS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] ?? SEED_SAINTS[0]!;
}
