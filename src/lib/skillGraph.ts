import type { Mode } from "./gameLogic";

// ── Types ─────────────────────────────────────────────────────────────────────

export type TaalSkill =
  | "letters"
  | "plakken"
  | "missende-letter"
  | "schrijven"
  | "eindletter"
  | "beginletter"
  | "rijmwoord"
  | "klanken-tellen"
  | "woordtypist"
  | "woordvolgorde"
  | "woordsoort";

export interface ContentConfig {
  // Discriminator
  domain?: "rekenen" | "taal"; // undefined = rekenen (backward compat)

  // Rekenen
  mode?: Mode;
  maxVal?: number;
  allowedTables?: number[];
  specificTable?: number;
  tableOrder?: "volgorde" | "mix";

  // Taal
  taalSkill?: TaalSkill;
  letterSet?: string[];      // voor letterherkenning
  wordDifficulty?: 1 | 2 | 3 | 4;

  // Gedeeld
  timerSetting: number;
}

export interface SkillLevel {
  id: string;
  name: string;
  unlock_threshold: number; // bijv. 0.8 = 80% goed
  mastery_window: number;   // sliding window grootte (bijv. 20 vragen)
  fallback_threshold: number; // bijv. 0.4 = terugvallen bij <40% over 10 vragen
  fallback_window: number;
  depends_on: string[];     // level-IDs die beheerst moeten zijn
  can_skip: boolean;
  content_config: ContentConfig;
}

export interface Skill {
  id: string;
  name: string;
  levels: SkillLevel[];
}

export interface Domain {
  id: string;
  name: string;
  emoji: string;
  skills: Skill[];
}

export interface SkillGraph {
  domains: Domain[];
}

// ── Helper ────────────────────────────────────────────────────────────────────

export function getLevelById(graph: SkillGraph, id: string): SkillLevel | undefined {
  for (const domain of graph.domains) {
    for (const skill of domain.skills) {
      const found = skill.levels.find(l => l.id === id);
      if (found) return found;
    }
  }
  return undefined;
}

export function getAllLevels(graph: SkillGraph): SkillLevel[] {
  return graph.domains.flatMap(d => d.skills.flatMap(s => s.levels));
}

export function getDomainLevels(graph: SkillGraph, domainId: string): SkillLevel[] {
  const domain = graph.domains.find(d => d.id === domainId);
  return domain ? domain.skills.flatMap(s => s.levels) : [];
}

// ── Reken skill graph ─────────────────────────────────────────────────────────

const DEFAULT: Pick<SkillLevel, "unlock_threshold" | "mastery_window" | "fallback_threshold" | "fallback_window" | "can_skip"> = {
  unlock_threshold:   0.80,
  mastery_window:     20,
  fallback_threshold: 0.40,
  fallback_window:    10,
  can_skip: true,
};

export const SKILL_GRAPH: SkillGraph = {
  domains: [
    {
      id: "rekenen",
      name: "Rekenen",
      emoji: "🔢",
      skills: [
        {
          id: "optellen",
          name: "Optellen",
          levels: [
            {
              ...DEFAULT, id: "plus-1", name: "Optellen t/m 10",
              depends_on: [],
              content_config: { mode: "plus", maxVal: 10, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "plus-2", name: "Optellen t/m 20",
              depends_on: ["plus-1"],
              content_config: { mode: "plus", maxVal: 20, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "plus-3", name: "Optellen t/m 50",
              depends_on: ["plus-2"],
              content_config: { mode: "plus", maxVal: 50, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "plus-4", name: "Optellen t/m 100",
              depends_on: ["plus-3"],
              content_config: { mode: "plus", maxVal: 100, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "plus-5", name: "Optellen t/m 1000",
              depends_on: ["plus-4"],
              content_config: { mode: "plus", maxVal: 1000, timerSetting: 0 },
            },
          ],
        },
        {
          id: "aftrekken",
          name: "Aftrekken",
          levels: [
            {
              ...DEFAULT, id: "min-1", name: "Aftrekken t/m 10",
              depends_on: ["plus-1"],
              content_config: { mode: "min", maxVal: 10, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "min-2", name: "Aftrekken t/m 20",
              depends_on: ["min-1", "plus-2"],
              content_config: { mode: "min", maxVal: 20, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "min-3", name: "Aftrekken t/m 50",
              depends_on: ["min-2"],
              content_config: { mode: "min", maxVal: 50, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "min-4", name: "Aftrekken t/m 100",
              depends_on: ["min-3"],
              content_config: { mode: "min", maxVal: 100, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "min-5", name: "Aftrekken t/m 1000",
              depends_on: ["min-4"],
              content_config: { mode: "min", maxVal: 1000, timerSetting: 0 },
            },
          ],
        },
        {
          id: "tafels",
          name: "Tafels",
          levels: [
            {
              ...DEFAULT, id: "tafel-1", name: "Tafels 1, 2, 5 en 10",
              depends_on: ["plus-2", "min-2"],
              content_config: { mode: "tafel", maxVal: 100, timerSetting: 0, allowedTables: [1, 2, 5, 10] },
            },
            {
              ...DEFAULT, id: "tafel-2", name: "Tafels 3 en 4",
              depends_on: ["tafel-1"],
              content_config: { mode: "tafel", maxVal: 100, timerSetting: 0, allowedTables: [3, 4] },
            },
            {
              ...DEFAULT, id: "tafel-3", name: "Tafels 6, 7 en 8",
              depends_on: ["tafel-2"],
              content_config: { mode: "tafel", maxVal: 100, timerSetting: 0, allowedTables: [6, 7, 8] },
            },
            {
              ...DEFAULT, id: "tafel-4", name: "Tafel van 9",
              depends_on: ["tafel-3"],
              content_config: { mode: "tafel", maxVal: 100, timerSetting: 0, allowedTables: [9] },
            },
            {
              ...DEFAULT, id: "tafel-5", name: "Alle tafels",
              depends_on: ["tafel-4"],
              content_config: { mode: "tafel", maxVal: 100, timerSetting: 0 },
            },
          ],
        },
        {
          id: "mix",
          name: "Mix",
          levels: [
            {
              ...DEFAULT, id: "mix-1", name: "Optellen + aftrekken t/m 20",
              depends_on: ["plus-2", "min-2"],
              content_config: { mode: "mix", maxVal: 20, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "mix-2", name: "Optellen, aftrekken + tafels",
              depends_on: ["mix-1", "tafel-2"],
              content_config: { mode: "alles", maxVal: 100, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "mix-3", name: "Alles door elkaar",
              depends_on: ["mix-2", "min-5"],
              content_config: { mode: "alles", maxVal: 1000, timerSetting: 0 },
            },
          ],
        },
      ],
    },

    // ── Taal domein ───────────────────────────────────────────────────────────
    {
      id: "taal",
      name: "Taal",
      emoji: "📖",
      skills: [
        {
          id: "letters",
          name: "Letters herkennen",
          levels: [
            {
              ...DEFAULT, id: "letter-1", name: "Letters s, a, m, r, e, i",
              depends_on: [],
              content_config: { domain: "taal", taalSkill: "letters", letterSet: ["s","a","m","r","e","i"], timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "letter-2", name: "Letters o, n, t, d, l, p",
              depends_on: ["letter-1"],
              content_config: { domain: "taal", taalSkill: "letters", letterSet: ["o","n","t","d","l","p"], timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "letter-3", name: "Letters k, b, g, v, w, j",
              depends_on: ["letter-2"],
              content_config: { domain: "taal", taalSkill: "letters", letterSet: ["k","b","g","v","w","j"], timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "letter-4", name: "Letters h, u, z, f, c, x, q, y",
              depends_on: ["letter-3"],
              content_config: { domain: "taal", taalSkill: "letters", letterSet: ["h","u","z","f","c","x","q","y"], timerSetting: 0 },
            },
          ],
        },
        {
          id: "plakken",
          name: "Woordjes plakken",
          levels: [
            {
              ...DEFAULT, id: "plakken-1", name: "Plakken — 3-letter woorden",
              depends_on: ["letter-1"],
              content_config: { domain: "taal", taalSkill: "plakken", wordDifficulty: 1, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "plakken-2", name: "Plakken — 4-letter woorden",
              depends_on: ["plakken-1", "letter-2"],
              content_config: { domain: "taal", taalSkill: "plakken", wordDifficulty: 2, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "plakken-3", name: "Plakken — 5-letter woorden",
              depends_on: ["plakken-2"],
              content_config: { domain: "taal", taalSkill: "plakken", wordDifficulty: 3, timerSetting: 0 },
            },
          ],
        },
        {
          id: "eindletter",
          name: "Eindletter",
          levels: [
            { ...DEFAULT, id: "eindletter-1", name: "Welke letter als laatste? — 3 letters", depends_on: ["letter-1"],
              content_config: { domain: "taal", taalSkill: "eindletter", wordDifficulty: 1, timerSetting: 0 } },
            { ...DEFAULT, id: "eindletter-2", name: "Welke letter als laatste? — 4 letters", depends_on: ["eindletter-1", "letter-2"],
              content_config: { domain: "taal", taalSkill: "eindletter", wordDifficulty: 2, timerSetting: 0 } },
          ],
        },
        {
          id: "beginletter",
          name: "Beginletter",
          levels: [
            { ...DEFAULT, id: "beginletter-1", name: "Welk woord begint met deze klank?", depends_on: ["letter-1"],
              content_config: { domain: "taal", taalSkill: "beginletter", timerSetting: 0 } },
          ],
        },
        {
          id: "rijmwoord",
          name: "Rijmwoord",
          levels: [
            { ...DEFAULT, id: "rijmwoord-1", name: "Welk woord rijmt?", depends_on: ["letter-2"],
              content_config: { domain: "taal", taalSkill: "rijmwoord", timerSetting: 0 } },
          ],
        },
        {
          id: "klanken-tellen",
          name: "Klanken tellen",
          levels: [
            { ...DEFAULT, id: "klanken-1", name: "Hoeveel klanken? — 3 letters", depends_on: ["letter-1"],
              content_config: { domain: "taal", taalSkill: "klanken-tellen", wordDifficulty: 1, timerSetting: 0 } },
            { ...DEFAULT, id: "klanken-2", name: "Hoeveel klanken? — 4-5 letters", depends_on: ["klanken-1", "letter-2"],
              content_config: { domain: "taal", taalSkill: "klanken-tellen", wordDifficulty: 2, timerSetting: 0 } },
          ],
        },
        {
          id: "woordtypist",
          name: "Woordtypist",
          levels: [
            { ...DEFAULT, id: "typist-1", name: "Typ het woord — 3 letters", depends_on: ["plakken-1"],
              content_config: { domain: "taal", taalSkill: "woordtypist", wordDifficulty: 1, timerSetting: 0 } },
            { ...DEFAULT, id: "typist-2", name: "Typ het woord — 4 letters", depends_on: ["typist-1"],
              content_config: { domain: "taal", taalSkill: "woordtypist", wordDifficulty: 2, timerSetting: 0 } },
            { ...DEFAULT, id: "typist-3", name: "Typ het woord — 5 letters", depends_on: ["typist-2"],
              content_config: { domain: "taal", taalSkill: "woordtypist", wordDifficulty: 3, timerSetting: 0 } },
          ],
        },
        {
          id: "woordvolgorde",
          name: "Woordvolgorde",
          levels: [
            { ...DEFAULT, id: "volgorde-1", name: "Zet de zin in orde", depends_on: ["plakken-1"],
              content_config: { domain: "taal", taalSkill: "woordvolgorde", timerSetting: 0 } },
          ],
        },
        {
          id: "woordsoort",
          name: "Woordsoort",
          levels: [
            { ...DEFAULT, id: "soort-1", name: "Welke woorden horen erbij?", depends_on: ["letter-2"],
              content_config: { domain: "taal", taalSkill: "woordsoort", timerSetting: 0 } },
          ],
        },
        {
          id: "missende-letter",
          name: "Missende letter",
          levels: [
            {
              ...DEFAULT, id: "missend-1", name: "Missende klinker — 3 letters",
              depends_on: ["letter-1"],
              content_config: { domain: "taal", taalSkill: "missende-letter", wordDifficulty: 1, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "missend-2", name: "Missende medeklinker — 3 letters",
              depends_on: ["missend-1"],
              content_config: { domain: "taal", taalSkill: "missende-letter", wordDifficulty: 2, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "missend-3", name: "Missende letter — 4 letters",
              depends_on: ["missend-2", "letter-2"],
              content_config: { domain: "taal", taalSkill: "missende-letter", wordDifficulty: 3, timerSetting: 0 },
            },
            {
              ...DEFAULT, id: "missend-4", name: "Missende letter — 5 letters",
              depends_on: ["missend-3"],
              content_config: { domain: "taal", taalSkill: "missende-letter", wordDifficulty: 4, timerSetting: 0 },
            },
          ],
        },
      ],
    },
  ],
};
