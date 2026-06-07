// Week 1 — "The Mirror, Mirror on the Wall"
// Content is data-driven so new weeks/days can be added without touching UI code.

export const BAZAAR_ASSETS = [
  { id: "turret", name: "Pink Castle Turret", cost: 20, emoji: "🏰", w: 1, h: 1 },
  { id: "carriage", name: "Crystal Carriage", cost: 30, emoji: "🛼", w: 1, h: 1 },
  { id: "fountain", name: "Wishing Fountain", cost: 25, emoji: "⛲", w: 1, h: 1 },
  { id: "tree", name: "Blossom Tree", cost: 12, emoji: "🌸", w: 1, h: 1 },
  { id: "unicorn", name: "Royal Unicorn", cost: 40, emoji: "🦄", w: 1, h: 1 },
  { id: "rainbow", name: "Rainbow Bridge", cost: 35, emoji: "🌈", w: 1, h: 1 },
  { id: "lamp", name: "Enchanted Lamp", cost: 15, emoji: "🪔", w: 1, h: 1 },
  { id: "swan", name: "Silver Swan Pond", cost: 22, emoji: "🦢", w: 1, h: 1 },
  { id: "crown", name: "Floating Crown", cost: 50, emoji: "👑", w: 1, h: 1 },
  { id: "flowers", name: "Royal Garden", cost: 10, emoji: "🌷", w: 1, h: 1 },
];

// ---------- LISTENING ----------
// Days 1-3: object/outfit match. Days 4-6: prepositions of place.
const listeningEarly = [
  {
    audio: "The princess wears a sparkling golden crown. Click the crown.",
    options: [
      { id: "crown", emoji: "👑", label: "crown" },
      { id: "shoe", emoji: "👠", label: "shoe" },
      { id: "ring", emoji: "💍", label: "ring" },
      { id: "dress", emoji: "👗", label: "dress" },
    ],
    answer: "crown",
  },
  {
    audio: "The brave prince holds a shiny silver sword. Click the sword.",
    options: [
      { id: "wand", emoji: "🪄", label: "wand" },
      { id: "sword", emoji: "🗡️", label: "sword" },
      { id: "shield", emoji: "🛡️", label: "shield" },
      { id: "book", emoji: "📕", label: "book" },
    ],
    answer: "sword",
  },
  {
    audio: "For the royal ball she chooses a beautiful pink dress. Click the dress.",
    options: [
      { id: "dress", emoji: "👗", label: "dress" },
      { id: "hat", emoji: "👒", label: "hat" },
      { id: "gloves", emoji: "🧤", label: "gloves" },
      { id: "crown", emoji: "👑", label: "crown" },
    ],
    answer: "dress",
  },
];

const listeningLate = [
  {
    audio: "The kitten is hiding UNDER the rug. Click what is under the rug.",
    scene: "🪅",
    options: [
      { id: "under", emoji: "🐱", label: "under the rug" },
      { id: "on", emoji: "🕯️", label: "on the table" },
      { id: "behind", emoji: "🖼️", label: "behind the frame" },
    ],
    answer: "under",
  },
  {
    audio: "The magic key is BEHIND the tapestry. Click what is behind the tapestry.",
    scene: "🧵",
    options: [
      { id: "in", emoji: "🍶", label: "in the vase" },
      { id: "behind", emoji: "🗝️", label: "behind the tapestry" },
      { id: "under", emoji: "🪑", label: "under the chair" },
    ],
    answer: "behind",
  },
  {
    audio: "The little mouse sits ON TOP OF the cheese. Click what is on top.",
    scene: "🧀",
    options: [
      { id: "next", emoji: "🪟", label: "next to the window" },
      { id: "under", emoji: "🛏️", label: "under the bed" },
      { id: "on", emoji: "🐭", label: "on top of the cheese" },
    ],
    answer: "on",
  },
];

// ---------- SPEAKING ----------
const speakingEarly = [
  "The radiant princess dances in the royal ball.",
  "A brave prince protects the magic kingdom.",
  "The sparkling crown shines in the sunlight.",
];
const speakingLate = [
  {
    question: "What would you wear to a royal ball, and why?",
    keywords: ["wear", "because", "would"],
  },
  {
    question: "Describe your dream castle in one full sentence.",
    keywords: ["castle", "is", "has"],
  },
  {
    question: "If you found a magic wand, what would you do?",
    keywords: ["would", "magic", "i"],
  },
];

// Fallback word bubbles for speaking when mic is denied.
export const SPEAKING_FALLBACK = [
  "I would wear a sparkling blue gown because it shines.",
  "My castle is tall and has a rainbow bridge.",
  "I would make flowers grow everywhere with my wand.",
  "I think the dragon is just lonely and needs a friend.",
];

// ---------- READING ----------
const readingEarly = {
  pages: [
    "Long ago, in the Crystal Meadow, lived a kind princess named Lumi. Her castle glowed with soft pink light, and every morning bluebirds sang at her window.",
    "But a Talking Mirror in the dark tower was jealous of her kindness. 'I must be the fairest,' it hissed, and it hid the sun behind grey clouds.",
    "Lumi was not afraid. She gathered her Light Runes and promised to free the kingdom from the mirror's cold spell.",
  ],
  questions: [
    {
      q: "What was the princess's name?",
      options: ["Lumi", "Rose", "Stella"],
      answer: 0,
    },
    {
      q: "Why was the mirror jealous?",
      options: [
        "Because of her kindness",
        "Because of her castle",
        "Because of her crown",
      ],
      answer: 0,
    },
    {
      q: "What did the mirror hide?",
      options: ["The moon", "The sun", "The stars"],
      answer: 1,
    },
  ],
};

const readingLate = {
  intro:
    "Read the clues and pick the SAFE path. Avoid the Queen's shadow guards! 'The safe road goes past the blossom tree, never near the dark cave.'",
  steps: [
    {
      clue: "Go toward the place where flowers bloom.",
      options: [
        { id: "tree", emoji: "🌸", label: "Blossom Tree", safe: true },
        { id: "cave", emoji: "🕳️", label: "Dark Cave", safe: false },
      ],
    },
    {
      clue: "Cross the water on something colorful, not the broken bridge.",
      options: [
        { id: "broken", emoji: "🪵", label: "Broken Bridge", safe: false },
        { id: "rainbow", emoji: "🌈", label: "Rainbow Bridge", safe: true },
      ],
    },
    {
      clue: "Enter through the bright gate, away from the shadow.",
      options: [
        { id: "shadow", emoji: "👤", label: "Shadow Gate", safe: false },
        { id: "bright", emoji: "✨", label: "Bright Gate", safe: true },
      ],
    },
  ],
};

// ---------- WRITING ----------
const writingEarly = [
  { hint: "Shining brightly like the sun ☀️", answer: "radiant" },
  { hint: "Full of tiny sparkles ✨", answer: "sparkling" },
  { hint: "Very beautiful and graceful 💃", answer: "elegant" },
];
const writingLate = [
  {
    prompt: "Write a full sentence about the princess using the word 'radiant'.",
    required: "radiant",
  },
  {
    prompt: "Write a full sentence about the castle using the word 'sparkling'.",
    required: "sparkling",
  },
  {
    prompt: "Write a full sentence about the unicorn using the word 'magical'.",
    required: "magical",
  },
];

// ---------- DAY 7 RAID ----------
export const RAID = {
  listening: [
    {
      audio: "Quick! Click the crown!",
      options: [
        { id: "a", emoji: "👑", label: "crown", correct: true },
        { id: "b", emoji: "🗡️", label: "sword" },
        { id: "c", emoji: "🛡️", label: "shield" },
      ],
    },
    {
      audio: "Quick! Click the magic wand!",
      options: [
        { id: "a", emoji: "👗", label: "dress" },
        { id: "b", emoji: "🪄", label: "wand", correct: true },
        { id: "c", emoji: "💍", label: "ring" },
      ],
    },
    {
      audio: "Quick! Click the unicorn!",
      options: [
        { id: "a", emoji: "🦢", label: "swan" },
        { id: "b", emoji: "🐉", label: "dragon" },
        { id: "c", emoji: "🦄", label: "unicorn", correct: true },
      ],
    },
  ],
  reading: [
    {
      text: "The mirror's frame is made of cold ice.",
      vulnerable: false,
    },
    {
      text: "A thin CRACK glows weakly at the mirror's heart.",
      vulnerable: true,
    },
    {
      text: "The mirror's glass shows only reflections.",
      vulnerable: false,
    },
  ],
  writing: [
    "The radiant princess is brave.",
    "My sparkling kingdom is safe.",
    "The magical light breaks the spell.",
  ],
  speaking: [
    "Who do you think is the fairest of all?",
    "Why are you not afraid of me?",
    "What will you do when I am gone?",
  ],
};

// ---------- selectors ----------
export function getDayContent(day) {
  const late = day >= 4;
  return {
    whisperLevel: Math.min(5, day), // Web Audio difficulty layer
    listening: late ? listeningLate : listeningEarly,
    listeningMode: late ? "preposition" : "match",
    speaking: late ? speakingLate : speakingEarly,
    speakingMode: late ? "conversation" : "read",
    reading: late ? readingLate : readingEarly,
    readingMode: late ? "map" : "story",
    writing: late ? writingLate : writingEarly,
    writingMode: late ? "sentence" : "spelling",
  };
}
