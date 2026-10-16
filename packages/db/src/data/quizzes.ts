export type QuestionKind = "multiple_choice" | "true_false" | "who_am_i" | "picture_select";

export interface SeedQuizOption {
  id: string;
  position: number;
  text: string;
  isCorrect: boolean;
  imageHint?: string;
}

export interface SeedQuizQuestion {
  id: string;
  position: number;
  type: QuestionKind;
  prompt: string;
  hint?: string;
  explanation: string;
  difficulty: number;
  options: SeedQuizOption[];
  clues?: string[]; // For who_am_i questions
}

export interface SeedQuiz {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "bible" | "saints" | "catechism" | "seasons";
  minAge: number;
  maxAge: number;
  passScore: number;
  lessonSlug?: string;
  questions: SeedQuizQuestion[];
}

export const SEED_QUIZZES: readonly SeedQuiz[] = [
  {
    id: "q1a10001-0001-4000-8000-000000000001",
    slug: "creation-and-gods-animals",
    title: "Creation & God's Beautiful World",
    description:
      "Explore the wonderful six days of creation and the gentle creatures God made for us to cherish.",
    category: "bible",
    minAge: 3,
    maxAge: 7,
    passScore: 60,
    questions: [
      {
        id: "qq1a0001-0001-4000-8000-000000000001",
        position: 1,
        type: "multiple_choice",
        prompt: "On the first day of creation, what did God say to fill the darkness with warmth?",
        hint: "Think about what shines in the morning sky!",
        explanation:
          "God said 'Let there be light', and there was light! God saw that the light was good.",
        difficulty: 1,
        options: [
          { id: "opt-1-1", position: 1, text: "'Let there be light!'", isCorrect: true },
          { id: "opt-1-2", position: 2, text: "'Let there be rain!'", isCorrect: false },
          { id: "opt-1-3", position: 3, text: "'Let there be stones!'", isCorrect: false },
        ],
      },
      {
        id: "qq1a0001-0001-4000-8000-000000000002",
        position: 2,
        type: "true_false",
        prompt:
          "True or False: God made the birds that fly in the air and the swimming fishes in the sea.",
        hint: "Listen to the birds singing outside in the trees.",
        explanation:
          "Yes! God created every soaring eagle, little sparrow, and sea creature on the fifth day.",
        difficulty: 1,
        options: [
          { id: "opt-2-1", position: 1, text: "True", isCorrect: true },
          { id: "opt-2-2", position: 2, text: "False", isCorrect: false },
        ],
      },
      {
        id: "qq1a0001-0001-4000-8000-000000000003",
        position: 3,
        type: "multiple_choice",
        prompt:
          "Which holy saint is famous for blessing animals and preaching gently to the birds?",
        hint: "He lived in Assisi, Italy and called the wolf his brother.",
        explanation:
          "Saint Francis of Assisi loved all creation and treated every animal as a sister or brother from God.",
        difficulty: 1,
        options: [
          { id: "opt-3-1", position: 1, text: "Saint Francis of Assisi", isCorrect: true },
          { id: "opt-3-2", position: 2, text: "Saint Peter the Fisherman", isCorrect: false },
          { id: "opt-3-3", position: 3, text: "Saint Paul the Traveler", isCorrect: false },
        ],
      },
      {
        id: "qq1a0001-0001-4000-8000-000000000004",
        position: 4,
        type: "multiple_choice",
        prompt: "What did God do on the seventh day after finishing His great work of creation?",
        hint: "This is why Sundays are holy days of peace and Mass.",
        explanation:
          "God rested on the seventh day and blessed it. That is why we worship God and rest with family on Sunday!",
        difficulty: 1,
        options: [
          { id: "opt-4-1", position: 1, text: "He rested and blessed the day", isCorrect: true },
          { id: "opt-4-2", position: 2, text: "He went on a long journey", isCorrect: false },
          { id: "opt-4-3", position: 3, text: "He built a great ship", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "q1a10001-0001-4000-8000-000000000002",
    slug: "saint-francis-and-friends",
    title: "Saint Francis: Peacemaker & Friend",
    description:
      "Learn how Saint Francis brought God's peaceful love to animals, towns, and poor people.",
    category: "saints",
    minAge: 8,
    maxAge: 10,
    passScore: 60,
    questions: [
      {
        id: "qq1a0002-0001-4000-8000-000000000001",
        position: 1,
        type: "multiple_choice",
        prompt: "In which Italian town was Saint Francis born into a wealthy merchant family?",
        hint: "A beautiful hill town in Umbria with stone basilicas.",
        explanation:
          "Saint Francis was born in Assisi around 1181 AD before giving away his wealth to serve Christ in poverty.",
        difficulty: 1,
        options: [
          { id: "opt-21-1", position: 1, text: "Assisi", isCorrect: true },
          { id: "opt-21-2", position: 2, text: "Rome", isCorrect: false },
          { id: "opt-21-3", position: 3, text: "Venice", isCorrect: false },
        ],
      },
      {
        id: "qq1a0002-0001-4000-8000-000000000002",
        position: 2,
        type: "multiple_choice",
        prompt:
          "How did Saint Francis resolve the conflict between the people of Gubbio and the hungry wolf?",
        hint: "He used peace and mutual promises instead of weapons.",
        explanation:
          "Francis made a peace treaty: the townspeople fed the wolf daily, and the wolf promised never to hurt anyone.",
        difficulty: 2,
        options: [
          {
            id: "opt-22-1",
            position: 1,
            text: "He promised the town would feed the wolf in exchange for peace",
            isCorrect: true,
          },
          {
            id: "opt-22-2",
            position: 2,
            text: "He chased the wolf far across the sea",
            isCorrect: false,
          },
          {
            id: "opt-22-3",
            position: 3,
            text: "He built a tall wall around the forest",
            isCorrect: false,
          },
        ],
      },
      {
        id: "qq1a0002-0001-4000-8000-000000000003",
        position: 3,
        type: "multiple_choice",
        prompt:
          "What wonderful Christmas tradition did Saint Francis invent in the town of Greccio?",
        hint: "Think about what Catholic families place beneath the Christmas tree.",
        explanation:
          "Saint Francis created the first living Nativity manger scene with real animals so people could see the humble birth of Jesus.",
        difficulty: 2,
        options: [
          {
            id: "opt-23-1",
            position: 1,
            text: "The Christmas Nativity manger scene",
            isCorrect: true,
          },
          { id: "opt-23-2", position: 2, text: "Christmas candy canes", isCorrect: false },
          { id: "opt-23-3", position: 3, text: "Wrapping paper with ribbons", isCorrect: false },
        ],
      },
      {
        id: "qq1a0002-0001-4000-8000-000000000004",
        position: 4,
        type: "multiple_choice",
        prompt: "What is the famous prayer attributed to Saint Francis that begins with peace?",
        hint: "'Lord, make me an instrument of Thy...'",
        explanation:
          "The Peace Prayer of Saint Francis asks God to make us instruments of peace, love, faith, hope, and joy.",
        difficulty: 1,
        options: [
          {
            id: "opt-24-1",
            position: 1,
            text: "'Lord, make me an instrument of Thy peace'",
            isCorrect: true,
          },
          {
            id: "opt-24-2",
            position: 2,
            text: "'Give me great riches and crowns'",
            isCorrect: false,
          },
          {
            id: "opt-24-3",
            position: 3,
            text: "'Make me ruler over many cities'",
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: "q1a10001-0001-4000-8000-000000000003",
    slug: "seven-holy-sacraments",
    title: "The Seven Holy Sacraments",
    description:
      "Discover the sacred visible signs instituted by Jesus Christ to give us sanctifying grace.",
    category: "catechism",
    minAge: 8,
    maxAge: 15,
    passScore: 60,
    questions: [
      {
        id: "qq1a0003-0001-4000-8000-000000000001",
        position: 1,
        type: "multiple_choice",
        prompt:
          "Which holy sacrament washes away original sin and welcomes us as adopted children into God's Church?",
        hint: "Water is poured over the head in the Name of the Father, Son, and Holy Spirit.",
        explanation:
          "Baptism is the gateway sacrament of new life in Christ and membership in the holy Catholic Church.",
        difficulty: 1,
        options: [
          { id: "opt-31-1", position: 1, text: "Sacrament of Baptism", isCorrect: true },
          { id: "opt-31-2", position: 2, text: "Sacrament of Holy Orders", isCorrect: false },
          { id: "opt-31-3", position: 3, text: "Sacrament of Matrimony", isCorrect: false },
        ],
      },
      {
        id: "qq1a0003-0001-4000-8000-000000000002",
        position: 2,
        type: "multiple_choice",
        prompt:
          "In the Holy Eucharist at Mass, what do the bread and wine truly become through the priest's consecration?",
        hint: "This is the Real Presence of our Savior.",
        explanation:
          "Catholics believe in the Real Presence: the bread and wine become the true Body, Blood, Soul, and Divinity of Jesus Christ.",
        difficulty: 2,
        options: [
          {
            id: "opt-32-1",
            position: 1,
            text: "The true Body and Blood of Jesus Christ",
            isCorrect: true,
          },
          { id: "opt-32-2", position: 2, text: "Just a reminder picture", isCorrect: false },
          { id: "opt-32-3", position: 3, text: "Ordinary bread from the store", isCorrect: false },
        ],
      },
      {
        id: "qq1a0003-0001-4000-8000-000000000003",
        position: 3,
        type: "multiple_choice",
        prompt:
          "When we confess our sins with sincere sorrow in Reconciliation, who forgives us through the priest?",
        hint: "Jesus gave this power to His apostles: 'Whose sins you forgive, they are forgiven.'",
        explanation:
          "Jesus Christ Himself forgives us in Confession, restoring our souls with peace, mercy, and grace.",
        difficulty: 2,
        options: [
          {
            id: "opt-33-1",
            position: 1,
            text: "Jesus Christ in His infinite mercy",
            isCorrect: true,
          },
          { id: "opt-33-2", position: 2, text: "The mayor of the town", isCorrect: false },
          {
            id: "opt-33-3",
            position: 3,
            text: "No one, we must hide our faults",
            isCorrect: false,
          },
        ],
      },
      {
        id: "qq1a0003-0001-4000-8000-000000000004",
        position: 4,
        type: "multiple_choice",
        prompt: "How many Sacraments did Jesus Christ institute for His Church?",
        hint: "Baptism, Confirmation, Eucharist, Penance, Anointing of the Sick, Holy Orders, Matrimony.",
        explanation:
          "There are Seven Sacraments in the Catholic Church, providing grace at every key moment of life.",
        difficulty: 1,
        options: [
          { id: "opt-34-1", position: 1, text: "Seven (7)", isCorrect: true },
          { id: "opt-34-2", position: 2, text: "Three (3)", isCorrect: false },
          { id: "opt-34-3", position: 3, text: "Twelve (12)", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "q1a10001-0001-4000-8000-000000000004",
    slug: "mystery-saints-who-am-i",
    title: "Who Am I? Saint Mysteries",
    description:
      "Read the historical clues and identify famous holy men and women from Catholic history.",
    category: "saints",
    minAge: 11,
    maxAge: 15,
    passScore: 60,
    questions: [
      {
        id: "qq1a0004-0001-4000-8000-000000000001",
        position: 1,
        type: "who_am_i",
        prompt:
          "Clue: I plucked a three leaf shamrock on the green hills of Ireland to explain the Holy Trinity to kings. Who am I?",
        clues: [
          "I was held captive tending sheep as a teenager, praying over 100 times daily.",
          "I returned to the Emerald Isle to forgive my captors and preach the Good News.",
          "My feast day is celebrated on March 17 with green shamrocks.",
        ],
        hint: "The beloved Apostle of Ireland.",
        explanation:
          "Saint Patrick used the green shamrock with three leaves on one stem to teach about the Father, Son, and Holy Spirit.",
        difficulty: 2,
        options: [
          { id: "opt-41-1", position: 1, text: "Saint Patrick", isCorrect: true },
          { id: "opt-41-2", position: 2, text: "Saint Columba", isCorrect: false },
          { id: "opt-41-3", position: 3, text: "Saint Brendan", isCorrect: false },
        ],
      },
      {
        id: "qq1a0004-0001-4000-8000-000000000002",
        position: 2,
        type: "who_am_i",
        prompt:
          "Clue: Known as 'The Little Flower', I taught the world 'The Little Way' of spiritual childhood. Who am I?",
        clues: [
          "I entered the Carmelite monastery in Lisieux, France at fifteen years old.",
          "I promised to spend my heaven doing good upon earth, letting fall a shower of roses.",
          "I am one of only four women Doctors of the Universal Church.",
        ],
        hint: "Her feast day is October 1.",
        explanation:
          "Saint Thérèse of Lisieux taught that doing the smallest daily chores with immense love pleases God deeply.",
        difficulty: 2,
        options: [
          { id: "opt-42-1", position: 1, text: "Saint Thérèse of Lisieux", isCorrect: true },
          { id: "opt-42-2", position: 2, text: "Saint Teresa of Ávila", isCorrect: false },
          { id: "opt-42-3", position: 3, text: "Saint Bernadette", isCorrect: false },
        ],
      },
      {
        id: "qq1a0004-0001-4000-8000-000000000003",
        position: 3,
        type: "who_am_i",
        prompt:
          "Clue: At just seventeen years of age, I carried a white banner bearing the holy names 'Jesus and Mary' to liberate Orléans. Who am I?",
        clues: [
          "I was a peasant maiden in Domrémy who heard the heavenly voices of Saint Michael.",
          "I showed unfailing courage and trust in God amidst trials.",
          "I am the beloved patron saint of France and soldiers.",
        ],
        hint: "Known as the Maid of Orléans.",
        explanation:
          "Saint Joan of Arc obediently followed God's calling with heroic virtue and courage.",
        difficulty: 3,
        options: [
          { id: "opt-43-1", position: 1, text: "Saint Joan of Arc", isCorrect: true },
          { id: "opt-43-2", position: 2, text: "Saint Genevieve", isCorrect: false },
          { id: "opt-43-3", position: 3, text: "Saint Clare of Assisi", isCorrect: false },
        ],
      },
      {
        id: "qq1a0004-0001-4000-8000-000000000004",
        position: 4,
        type: "who_am_i",
        prompt:
          "Clue: I was the silent guardian of the Holy Family and foster father of Jesus Christ who worked with carpenter tools in Nazareth. Who am I?",
        clues: [
          "In the Gospels, I do not speak a single recorded word, but obeyed God immediately in dreams.",
          "I protected the Infant Jesus and Mary from King Herod by fleeing into Egypt.",
          "My feast is celebrated on March 19 and May 1 as patron of workers.",
        ],
        hint: "Spouse of the Blessed Virgin Mary.",
        explanation:
          "Saint Joseph is the just man, protector of the Holy Family, and universal patron of the Catholic Church.",
        difficulty: 1,
        options: [
          { id: "opt-44-1", position: 1, text: "Saint Joseph", isCorrect: true },
          { id: "opt-44-2", position: 2, text: "Saint Joachim", isCorrect: false },
          { id: "opt-44-3", position: 3, text: "Saint Zechariah", isCorrect: false },
        ],
      },
    ],
  },
];

export function getQuizBySlug(slug: string): SeedQuiz | undefined {
  return SEED_QUIZZES.find((q) => q.slug.toLowerCase() === slug.toLowerCase());
}

export function getQuizzesByCategory(category?: string): SeedQuiz[] {
  if (!category || category === "all") return [...SEED_QUIZZES];
  return SEED_QUIZZES.filter((q) => q.category === category);
}

export function getQuizzesByAgeBand(ageBand?: string): SeedQuiz[] {
  if (!ageBand) return [...SEED_QUIZZES];
  if (ageBand === "b3_7") {
    return SEED_QUIZZES.filter((q) => q.minAge <= 7);
  }
  if (ageBand === "b8_10") {
    return SEED_QUIZZES.filter((q) => q.maxAge >= 8 && q.minAge <= 10);
  }
  if (ageBand === "b11_15") {
    return SEED_QUIZZES.filter((q) => q.maxAge >= 11);
  }
  return [...SEED_QUIZZES];
}
