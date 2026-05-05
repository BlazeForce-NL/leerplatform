import type { TaalWord } from "@/lib/taalContent";

// ── Level 1 — MKM (meest voorkomende letters: s a m r e i n t o d l p) ──────

const L1: TaalWord[] = [
  { id: "nl-kat",  word: "kat",  locale: "nl", segments: ["k","a","t"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🐱" },
  { id: "nl-vis",  word: "vis",  locale: "nl", segments: ["v","i","s"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🐟" },
  { id: "nl-bus",  word: "bus",  locale: "nl", segments: ["b","u","s"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🚌" },
  { id: "nl-dag",  word: "dag",  locale: "nl", segments: ["d","a","g"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "☀️" },
  { id: "nl-man",  word: "man",  locale: "nl", segments: ["m","a","n"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🧑" },
  { id: "nl-lip",  word: "lip",  locale: "nl", segments: ["l","i","p"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "👄" },
  { id: "nl-pot",  word: "pot",  locale: "nl", segments: ["p","o","t"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🪴" },
  { id: "nl-zon",  word: "zon",  locale: "nl", segments: ["z","o","n"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "☀️" },
  { id: "nl-kip",  word: "kip",  locale: "nl", segments: ["k","i","p"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🐔" },
  { id: "nl-net",  word: "net",  locale: "nl", segments: ["n","e","t"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🕸️" },
  { id: "nl-mos",  word: "mos",  locale: "nl", segments: ["m","o","s"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🌿" },
  { id: "nl-pit",  word: "pit",  locale: "nl", segments: ["p","i","t"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🍑" },
  { id: "nl-dak",  word: "dak",  locale: "nl", segments: ["d","a","k"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🏠" },
  { id: "nl-rok",  word: "rok",  locale: "nl", segments: ["r","o","k"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "👗" },
  { id: "nl-mes",  word: "mes",  locale: "nl", segments: ["m","e","s"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🔪" },
  { id: "nl-bed",  word: "bed",  locale: "nl", segments: ["b","e","d"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🛏️" },
  { id: "nl-bal",  word: "bal",  locale: "nl", segments: ["b","a","l"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "⚽" },
  { id: "nl-dom",  word: "dom",  locale: "nl", segments: ["d","o","m"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🏰" },
  { id: "nl-rit",  word: "rit",  locale: "nl", segments: ["r","i","t"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🚗" },
  { id: "nl-kom",  word: "kom",  locale: "nl", segments: ["k","o","m"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🥣" },
  { id: "nl-nel",  word: "nel",  locale: "nl", segments: ["n","e","l"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "👩" },
  { id: "nl-pin",  word: "pin",  locale: "nl", segments: ["p","i","n"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "📌" },
  { id: "nl-los",  word: "los",  locale: "nl", segments: ["l","o","s"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "🔓" },
  { id: "nl-gas",  word: "gas",  locale: "nl", segments: ["g","a","s"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "💨" },
  { id: "nl-tip",  word: "tip",  locale: "nl", segments: ["t","i","p"],  structure: "MKM", difficulty: 1, skillLevel: "hakken-1", emoji: "💡" },
];

// ── Level 2 — MMKM en MKMM (4-letter woorden) ────────────────────────────────

const L2: TaalWord[] = [
  { id: "nl-lamp",  word: "lamp",  locale: "nl", segments: ["l","a","m","p"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "💡" },
  { id: "nl-mast",  word: "mast",  locale: "nl", segments: ["m","a","s","t"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "⛵" },
  { id: "nl-krab",  word: "krab",  locale: "nl", segments: ["k","r","a","b"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🦀" },
  { id: "nl-trap",  word: "trap",  locale: "nl", segments: ["t","r","a","p"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🪜" },
  { id: "nl-slak",  word: "slak",  locale: "nl", segments: ["s","l","a","k"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🐌" },
  { id: "nl-spin",  word: "spin",  locale: "nl", segments: ["s","p","i","n"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🕷️" },
  { id: "nl-gras",  word: "gras",  locale: "nl", segments: ["g","r","a","s"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🌱" },
  { id: "nl-brug",  word: "brug",  locale: "nl", segments: ["b","r","u","g"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🌉" },
  { id: "nl-vest",  word: "vest",  locale: "nl", segments: ["v","e","s","t"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "🧥" },
  { id: "nl-tram",  word: "tram",  locale: "nl", segments: ["t","r","a","m"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🚋" },
  { id: "nl-band",  word: "band",  locale: "nl", segments: ["b","a","n","d"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "🎸" },
  { id: "nl-golf",  word: "golf",  locale: "nl", segments: ["g","o","l","f"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "🏌️" },
  { id: "nl-wolf",  word: "wolf",  locale: "nl", segments: ["w","o","l","f"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "🐺" },
  { id: "nl-klad",  word: "klad",  locale: "nl", segments: ["k","l","a","d"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "📝" },
  { id: "nl-prop",  word: "prop",  locale: "nl", segments: ["p","r","o","p"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🔌" },
  { id: "nl-stam",  word: "stam",  locale: "nl", segments: ["s","t","a","m"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🌳" },
  { id: "nl-ring",  word: "ring",  locale: "nl", segments: ["r","i","n","g"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "💍" },
  { id: "nl-dorp",  word: "dorp",  locale: "nl", segments: ["d","o","r","p"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "🏘️" },
  { id: "nl-blik",  word: "blik",  locale: "nl", segments: ["b","l","i","k"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "👀" },
  { id: "nl-klok",  word: "klok",  locale: "nl", segments: ["k","l","o","k"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🕐" },
  { id: "nl-trek",  word: "trek",  locale: "nl", segments: ["t","r","e","k"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🧲" },
  { id: "nl-drop",  word: "drop",  locale: "nl", segments: ["d","r","o","p"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🍬" },
  { id: "nl-kruk",  word: "kruk",  locale: "nl", segments: ["k","r","u","k"],  structure: "MMKM", difficulty: 2, skillLevel: "hakken-2", emoji: "🦯" },
  { id: "nl-tank",  word: "tank",  locale: "nl", segments: ["t","a","n","k"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "⛽" },
  { id: "nl-film",  word: "film",  locale: "nl", segments: ["f","i","l","m"],  structure: "MKMM", difficulty: 2, skillLevel: "hakken-2", emoji: "🎬" },
];

// ── Level 3 — 5-letter woorden ───────────────────────────────────────────────

const L3: TaalWord[] = [
  { id: "nl-krant", word: "krant", locale: "nl", segments: ["k","r","a","n","t"], structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "📰" },
  { id: "nl-plant", word: "plant", locale: "nl", segments: ["p","l","a","n","t"], structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "🌱" },
  { id: "nl-brons", word: "brons", locale: "nl", segments: ["b","r","o","n","s"], structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "🥉" },
  { id: "nl-prent", word: "prent", locale: "nl", segments: ["p","r","e","n","t"], structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "🖼️" },
  { id: "nl-klamp", word: "klamp", locale: "nl", segments: ["k","l","a","m","p"], structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "🔧" },
  { id: "nl-trots", word: "trots", locale: "nl", segments: ["t","r","o","t","s"], structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "💪" },
  { id: "nl-strak", word: "strak", locale: "nl", segments: ["s","t","r","a","k"], structure: "MMMMK", difficulty: 3, skillLevel: "plakken-3", emoji: "📏" },
  { id: "nl-vrouw", word: "vrouw", locale: "nl", segments: ["v","r","o","u","w"], structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "👩" },
  { id: "nl-prins", word: "prins", locale: "nl", segments: ["p","r","i","n","s"], structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "🤴" },
  { id: "nl-blauw", word: "blauw", locale: "nl", segments: ["b","l","a","u","w"], structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "💙" },
  { id: "nl-groen", word: "groen", locale: "nl", segments: ["g","r","o","e","n"], structure: "MMKMM", difficulty: 3, skillLevel: "plakken-3", emoji: "💚" },
  { id: "nl-droom", word: "droom", locale: "nl", segments: ["d","r","o","o","m"], structure: "MMKKM", difficulty: 3, skillLevel: "plakken-3", emoji: "💭" },
  { id: "nl-steel", word: "steel", locale: "nl", segments: ["s","t","e","e","l"], structure: "MMKKM", difficulty: 3, skillLevel: "plakken-3", emoji: "🌹" },
  { id: "nl-spook", word: "spook", locale: "nl", segments: ["s","p","o","o","k"], structure: "MMKKM", difficulty: 3, skillLevel: "plakken-3", emoji: "👻" },
  { id: "nl-kleur", word: "kleur", locale: "nl", segments: ["k","l","e","u","r"], structure: "MMKKM", difficulty: 3, skillLevel: "plakken-3", emoji: "🎨" },
];

// ── Level 4 — 6-letter woorden ───────────────────────────────────────────────

const L4: TaalWord[] = [
  { id: "nl-strand", word: "strand", locale: "nl", segments: ["s","t","r","a","n","d"], structure: "MMKMM", difficulty: 4, skillLevel: "plakken-3", emoji: "🏖️" },
  { id: "nl-school", word: "school", locale: "nl", segments: ["s","c","h","o","o","l"], structure: "MMMKKM", difficulty: 4, skillLevel: "plakken-3", emoji: "🏫" },
  { id: "nl-bloem",  word: "bloem",  locale: "nl", segments: ["b","l","o","e","m"],    structure: "MMKKM",  difficulty: 4, skillLevel: "plakken-3", emoji: "🌸" },
  { id: "nl-zwaard", word: "zwaard", locale: "nl", segments: ["z","w","a","a","r","d"], structure: "MMKKM",  difficulty: 4, skillLevel: "plakken-3", emoji: "⚔️" },
  { id: "nl-sprong", word: "sprong", locale: "nl", segments: ["s","p","r","o","n","g"], structure: "MMMKMM", difficulty: 4, skillLevel: "plakken-3", emoji: "🐸" },
];

export const NL_WORDS: TaalWord[] = [...L1, ...L2, ...L3, ...L4];

export function getWordsByDifficulty(d: 1 | 2 | 3 | 4): TaalWord[] {
  return NL_WORDS.filter(w => w.difficulty === d);
}

export function getWordsForLevel(skillLevel: string): TaalWord[] {
  return NL_WORDS.filter(w => w.skillLevel === skillLevel);
}
