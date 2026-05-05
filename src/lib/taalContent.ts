// ── Taal content types ────────────────────────────────────────────────────────

export type WordStructure = "MKM" | "MMKM" | "MKMM" | "MMKMM" | "MKKM";
export type Locale = "nl" | "en";

export interface TaalWord {
  id: string;
  word: string;
  locale: Locale;
  segments: string[];     // fonetische klanken, bijv. ["k", "a", "t"]
  structure: WordStructure;
  difficulty: 1 | 2 | 3 | 4;
  skillLevel: string;     // bijv. "hakken-1"
  emoji?: string;         // visuele hint (fallback voor afbeelding)
}

export interface PhonemeSet {
  letters: string[];      // bijv. ["s", "a", "m", "r", "e", "i"]
  levelId: string;        // bijv. "letter-1"
  difficulty: 1 | 2 | 3 | 4;
}

// ── Fonetische klanken per letter (NL) ───────────────────────────────────────

export const NL_PHONEMES: Record<string, string> = {
  a: "aaa", b: "buh", c: "kuh", d: "duh", e: "eee",
  f: "fuh", g: "guh", h: "huh", i: "iii", j: "yuh",
  k: "kuh", l: "luh", m: "muh", n: "nuh", o: "ooo",
  p: "puh", q: "kwuh", r: "ruh", s: "sss", t: "tuh",
  u: "uuu", v: "vuh", w: "wuh", x: "ksuh", y: "yuh",
  z: "zzz",
};

// ── Letter-sets per herkenningsniveau ─────────────────────────────────────────

export const LETTER_SETS: PhonemeSet[] = [
  { levelId: "letter-1", difficulty: 1, letters: ["s", "a", "m", "r", "e", "i"] },
  { levelId: "letter-2", difficulty: 2, letters: ["o", "n", "t", "d", "l", "p"] },
  { levelId: "letter-3", difficulty: 3, letters: ["k", "b", "g", "v", "w", "j"] },
  { levelId: "letter-4", difficulty: 4, letters: ["h", "u", "z", "f", "c", "x", "q", "y"] },
];

// ── Helper: letters die tot en met dit niveau bekend zijn ────────────────────

export function knownLetters(upToDifficulty: number): string[] {
  return LETTER_SETS
    .filter(s => s.difficulty <= upToDifficulty)
    .flatMap(s => s.letters);
}

// ── Content validatie ─────────────────────────────────────────────────────────

export function validateWord(word: TaalWord): string[] {
  const errors: string[] = [];
  if (!word.id)      errors.push("id missing");
  if (!word.word)    errors.push("word missing");
  if (word.segments.length < 2) errors.push("segments must have ≥2 items");
  if (word.segments.join("") !== word.word && word.segments.join("") !== word.word.replace(/[^a-z]/g, ""))
    errors.push(`segments don't spell word: [${word.segments}] ≠ ${word.word}`);
  return errors;
}
