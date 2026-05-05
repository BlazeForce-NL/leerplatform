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

// Klankwaarden zoals in Nederlandse fonetiek.
// Aanhoudende klanken (frikativen, nasalen, lateralen) worden verlengd.
// Plosieven (b,d,g,k,p,t) krijgen een neutrale Nederlandse klinker erna.
// Gebruik IPA-nader Nederlands: schwa = "uh" klinkt Engels → gebruik "e" (de).
export const NL_PHONEMES: Record<string, string> = {
  // Klinkers
  a: "a",     // korte a (kat)
  e: "e",     // korte e (bed)
  i: "i",     // korte i (vis)
  o: "o",     // korte o (pot)
  u: "u",     // korte u (bus)

  // Aanhoudende medeklinkers — verleng de klank zodat TTS duidelijk is
  f: "fff",   // frikatief
  l: "lll",   // lateraal
  m: "mmm",   // nasaal
  n: "nnn",   // nasaal
  r: "rrr",   // vibrant/rollend
  s: "sss",   // sibilant
  v: "vvv",   // stemhebbend frikatief
  z: "zzz",   // sibilant stemhebbend

  // Plosieven — korte neutrale klinker erna (NL schwa)
  b: "be",    // stemhebbend labiaal
  d: "de",    // stemhebbend dentaal
  g: "ge",    // NL "g" (velaire frikatief) — TTS doet best moeite
  h: "he",    // laryngaal
  j: "je",    // palatale approximant (NL j = y-klank)
  k: "ke",    // stemloze velaar
  p: "pe",    // stemloze labiaal
  t: "te",    // stemloze dentaal
  w: "we",    // labiodentale approximant

  // Overige
  c: "se",    // in NL vaak s-klank
  q: "kwe",
  x: "ks",
  y: "ie",    // NL y als in "baby" = ie-klank
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
