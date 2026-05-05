import type { TaalWord } from "@/lib/taalContent";

// English phonics content
// Level 1 — CVC words (consonant-vowel-consonant), most common letters

const L1: TaalWord[] = [
  { id: "en-cat",  word: "cat",  locale: "en", segments: ["c","a","t"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🐱" },
  { id: "en-dog",  word: "dog",  locale: "en", segments: ["d","o","g"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🐕" },
  { id: "en-hat",  word: "hat",  locale: "en", segments: ["h","a","t"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🎩" },
  { id: "en-run",  word: "run",  locale: "en", segments: ["r","u","n"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🏃" },
  { id: "en-big",  word: "big",  locale: "en", segments: ["b","i","g"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🐘" },
  { id: "en-sit",  word: "sit",  locale: "en", segments: ["s","i","t"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🪑" },
  { id: "en-hop",  word: "hop",  locale: "en", segments: ["h","o","p"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🐸" },
  { id: "en-red",  word: "red",  locale: "en", segments: ["r","e","d"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🔴" },
  { id: "en-sun",  word: "sun",  locale: "en", segments: ["s","u","n"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "☀️" },
  { id: "en-net",  word: "net",  locale: "en", segments: ["n","e","t"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🕸️" },
  { id: "en-map",  word: "map",  locale: "en", segments: ["m","a","p"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🗺️" },
  { id: "en-lip",  word: "lip",  locale: "en", segments: ["l","i","p"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "👄" },
  { id: "en-top",  word: "top",  locale: "en", segments: ["t","o","p"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🔝" },
  { id: "en-bed",  word: "bed",  locale: "en", segments: ["b","e","d"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🛏️" },
  { id: "en-rug",  word: "rug",  locale: "en", segments: ["r","u","g"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🪱" },
  { id: "en-fit",  word: "fit",  locale: "en", segments: ["f","i","t"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "💪" },
  { id: "en-gap",  word: "gap",  locale: "en", segments: ["g","a","p"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🕳️" },
  { id: "en-den",  word: "den",  locale: "en", segments: ["d","e","n"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🐻" },
  { id: "en-mop",  word: "mop",  locale: "en", segments: ["m","o","p"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🧹" },
  { id: "en-pin",  word: "pin",  locale: "en", segments: ["p","i","n"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "📌" },
];

// Level 2 — CCVC / CVCC words (4-letter)

const L2: TaalWord[] = [
  { id: "en-frog",  word: "frog",  locale: "en", segments: ["f","r","o","g"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🐸" },
  { id: "en-crab",  word: "crab",  locale: "en", segments: ["c","r","a","b"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🦀" },
  { id: "en-slip",  word: "slip",  locale: "en", segments: ["s","l","i","p"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🛝" },
  { id: "en-flag",  word: "flag",  locale: "en", segments: ["f","l","a","g"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🚩" },
  { id: "en-trip",  word: "trip",  locale: "en", segments: ["t","r","i","p"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "✈️" },
  { id: "en-drum",  word: "drum",  locale: "en", segments: ["d","r","u","m"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🥁" },
  { id: "en-snap",  word: "snap",  locale: "en", segments: ["s","n","a","p"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "👏" },
  { id: "en-step",  word: "step",  locale: "en", segments: ["s","t","e","p"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "👣" },
  { id: "en-mask",  word: "mask",  locale: "en", segments: ["m","a","s","k"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "🎭" },
  { id: "en-nest",  word: "nest",  locale: "en", segments: ["n","e","s","t"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "🐦" },
  { id: "en-lamp",  word: "lamp",  locale: "en", segments: ["l","a","m","p"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "💡" },
  { id: "en-hand",  word: "hand",  locale: "en", segments: ["h","a","n","d"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "✋" },
  { id: "en-sand",  word: "sand",  locale: "en", segments: ["s","a","n","d"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "🏖️" },
  { id: "en-ring",  word: "ring",  locale: "en", segments: ["r","i","n","g"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "💍" },
  { id: "en-film",  word: "film",  locale: "en", segments: ["f","i","l","m"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "🎬" },
];

// Level 3 — 5-letter words

const L3: TaalWord[] = [
  { id: "en-plant",  word: "plant",  locale: "en", segments: ["p","l","a","n","t"],  structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "🌱" },
  { id: "en-frown",  word: "frown",  locale: "en", segments: ["f","r","o","w","n"],  structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "😠" },
  { id: "en-smile",  word: "smile",  locale: "en", segments: ["s","m","i","l","e"],  structure: "MMKMK", difficulty: 3, skillLevel: "plakken-3", emoji: "😊" },
  { id: "en-grass",  word: "grass",  locale: "en", segments: ["g","r","a","s","s"],  structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "🌿" },
  { id: "en-clock",  word: "clock",  locale: "en", segments: ["c","l","o","c","k"],  structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "🕐" },
  { id: "en-train",  word: "train",  locale: "en", segments: ["t","r","a","i","n"],  structure: "MMKKM", difficulty: 3, skillLevel: "plakken-3", emoji: "🚂" },
  { id: "en-green",  word: "green",  locale: "en", segments: ["g","r","e","e","n"],  structure: "MMKKM", difficulty: 3, skillLevel: "plakken-3", emoji: "💚" },
  { id: "en-queen",  word: "queen",  locale: "en", segments: ["q","u","e","e","n"],  structure: "MMKKM", difficulty: 3, skillLevel: "plakken-3", emoji: "👑" },
];

export const EN_WORDS: TaalWord[] = [...L1, ...L2, ...L3];

export function getWordsByDifficulty(d: 1 | 2 | 3 | 4): TaalWord[] {
  return EN_WORDS.filter(w => w.difficulty === d);
}
