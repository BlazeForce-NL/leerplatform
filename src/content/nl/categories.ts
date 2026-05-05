export interface WordCategory {
  id: string;
  label: string;
  emoji: string;
  words: string[];
}

export const WORD_CATEGORIES: WordCategory[] = [
  {
    id: "dieren",
    label: "Dieren",
    emoji: "🐾",
    words: ["kat", "vis", "kip", "krab", "wolf", "slak", "spin", "hond", "koe", "geit", "beer", "haas"],
  },
  {
    id: "kleuren",
    label: "Kleuren",
    emoji: "🎨",
    words: ["blauw", "groen", "rood", "geel", "paars", "wit", "zwart", "oranje", "roze", "bruin"],
  },
  {
    id: "voertuigen",
    label: "Voertuigen",
    emoji: "🚗",
    words: ["bus", "tram", "trein", "boot", "fiets", "auto", "vliegtuig", "tank", "tractor"],
  },
  {
    id: "eten",
    label: "Eten & drinken",
    emoji: "🍎",
    words: ["brood", "melk", "appel", "vis", "soep", "sap", "koek", "drop", "kaas", "ei"],
  },
  {
    id: "lichaam",
    label: "Lichaamsdelen",
    emoji: "👁️",
    words: ["oog", "oor", "neus", "lip", "nek", "rug", "arm", "knie", "teen", "hand"],
  },
];

// Niet-woorden die NIET in een categorie zitten (distractors)
export const DISTRACTORS: Record<string, string[]> = {
  dieren:     ["bus", "lamp", "dag", "ring", "pot"],
  kleuren:    ["kat", "bus", "dag", "ring", "pot"],
  voertuigen: ["kat", "oog", "dag", "ring", "appel"],
  eten:       ["kat", "bus", "dag", "ring", "lamp"],
  lichaam:    ["kat", "bus", "dag", "ring", "appel"],
};
