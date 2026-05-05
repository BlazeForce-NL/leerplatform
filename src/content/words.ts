// Locale-bewuste entry point voor woordenlijsten.
// Importeer altijd via dit bestand, niet direct uit nl/words of en/words.

import { getWordsByDifficulty as getNL } from "./nl/words";
import { getWordsByDifficulty as getEN } from "./en/words";
import type { TaalWord } from "@/lib/taalContent";
import type { Locale } from "@/lib/i18n/types";

export function getWords(locale: Locale, difficulty: 1 | 2 | 3 | 4): TaalWord[] {
  return locale === "en" ? getEN(difficulty) : getNL(difficulty);
}

// Re-export voor backward-compat (NL is default)
export { getWordsByDifficulty, getWordsForLevel, NL_WORDS } from "./nl/words";
