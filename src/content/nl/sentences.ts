export interface Zin {
  words: string[];
  emoji: string;
}

// Eenvoudige zinnen voor de Woordvolgorde-oefening.
// Geordend van makkelijk (3 woorden) naar moeilijker (4-5 woorden).
export const ZINNEN: Zin[] = [
  // 3-woord zinnen
  { words: ["De",  "kat",   "slaapt"],      emoji: "🐱" },
  { words: ["Een", "vis",   "zwemt"],        emoji: "🐟" },
  { words: ["De",  "bus",   "rijdt"],        emoji: "🚌" },
  { words: ["De",  "zon",   "schijnt"],      emoji: "☀️" },
  { words: ["De",  "hond",  "blaft"],        emoji: "🐕" },
  { words: ["Het", "kind",  "lacht"],        emoji: "😄" },
  { words: ["De",  "kip",   "kakelt"],       emoji: "🐔" },
  { words: ["Een", "spin",  "kruipt"],       emoji: "🕷️" },
  { words: ["De",  "slak",  "sluipt"],       emoji: "🐌" },

  // 4-woord zinnen
  { words: ["De",  "kat",   "drinkt", "melk"],    emoji: "🥛" },
  { words: ["De",  "zon",   "is",     "warm"],     emoji: "☀️" },
  { words: ["Een", "vis",   "eet",    "wormen"],   emoji: "🐛" },
  { words: ["De",  "hond",  "rent",   "hard"],     emoji: "🐕" },
  { words: ["Het", "kind",  "tekent", "graag"],    emoji: "✏️" },
  { words: ["De",  "slak",  "is",     "langzaam"], emoji: "🐌" },

  // 5-woord zinnen
  { words: ["De", "kat", "zit", "op", "dak"],        emoji: "🏠" },
  { words: ["De", "bus", "rijdt", "naar", "school"], emoji: "🏫" },
];
