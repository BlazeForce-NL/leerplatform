import { getStorageItem, setStorageItem } from "./storage";
import type { SkillGraph, SkillLevel } from "./skillGraph";
import { getAllLevels, getLevelById } from "./skillGraph";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MasteryRecord {
  levelId: string;
  answers: boolean[];   // sliding window (nieuwste achteraan)
  mastered: boolean;
  masteredAt?: number;  // timestamp ms
  skipped: boolean;     // via skipToLevel
}

type MasteryState = Record<string, MasteryRecord>; // levelId → record

// ── Interface ─────────────────────────────────────────────────────────────────

export interface MasteryStore {
  getRecord(levelId: string): MasteryRecord;
  recordAnswer(levelId: string, correct: boolean): MasteryRecord;
  skipToLevel(levelId: string, graph: SkillGraph): void;
  getUnlockedLevelIds(graph: SkillGraph): string[];
  getActiveLevelId(graph: SkillGraph, domainId: string): string | null;
  getMastery(levelId: string): number; // 0-1, % correct in window
}

// ── localStorage implementatie ────────────────────────────────────────────────

const STORAGE_KEY = "nb_mastery_v1";

function emptyRecord(levelId: string): MasteryRecord {
  return { levelId, answers: [], mastered: false, skipped: false };
}

function calcMastery(answers: boolean[], window: number): number {
  const slice = answers.slice(-window);
  if (slice.length === 0) return 0;
  return slice.filter(Boolean).length / slice.length;
}

function load(playerId: string): MasteryState {
  return getStorageItem<MasteryState>(`${STORAGE_KEY}_${playerId}`, {});
}

function save(playerId: string, state: MasteryState): void {
  setStorageItem(`${STORAGE_KEY}_${playerId}`, state);
}

function isUnlocked(level: SkillLevel, state: MasteryState): boolean {
  return level.depends_on.every(dep => {
    const r = state[dep];
    return r && (r.mastered || r.skipped);
  });
}

export function createLocalMasteryStore(playerId: string): MasteryStore {
  return {
    getRecord(levelId) {
      const state = load(playerId);
      return state[levelId] ?? emptyRecord(levelId);
    },

    recordAnswer(levelId, correct) {
      const state = load(playerId);
      const record = state[levelId] ?? emptyRecord(levelId);
      if (record.mastered || record.skipped) return record;

      // Voeg antwoord toe aan sliding window
      // Bewaar maximaal max(mastery_window, fallback_window) * 2 antwoorden
      const updated: MasteryRecord = {
        ...record,
        answers: [...record.answers, correct].slice(-40),
      };

      // Haal level config op voor drempelwaarden — gebruik defaults als niet gevonden
      // (drempelwaarden zijn in de SkillLevel, maar die hebben we hier niet direct;
      //  we gebruiken vaste defaults voor de localStorage store)
      const WINDOW = 20;
      const THRESHOLD = 0.80;
      const FALLBACK_WINDOW = 10;
      const FALLBACK_THRESHOLD = 0.40;

      const mastery = calcMastery(updated.answers, WINDOW);
      const recentMastery = calcMastery(updated.answers, FALLBACK_WINDOW);

      // Level beheerst?
      if (updated.answers.length >= WINDOW && mastery >= THRESHOLD) {
        updated.mastered = true;
        updated.masteredAt = Date.now();
      }

      // Terugvallen — signaleer alleen, de game beslist wat te doen
      updated.shouldFallback = updated.answers.length >= FALLBACK_WINDOW
        && recentMastery < FALLBACK_THRESHOLD
        && !updated.mastered;

      state[levelId] = updated;
      save(playerId, state);
      return updated;
    },

    skipToLevel(levelId, graph) {
      const state = load(playerId);
      const all = getAllLevels(graph);

      // Markeer alle prerequisites recursief als skipped
      function markSkipped(id: string) {
        if (state[id]?.mastered || state[id]?.skipped) return;
        const level = all.find(l => l.id === id);
        if (!level) return;
        level.depends_on.forEach(markSkipped);
        state[id] = { ...(state[id] ?? emptyRecord(id)), skipped: true, mastered: false };
      }

      const target = all.find(l => l.id === levelId);
      if (target) target.depends_on.forEach(markSkipped);
      save(playerId, state);
    },

    getUnlockedLevelIds(graph) {
      const state = load(playerId);
      return getAllLevels(graph)
        .filter(l => isUnlocked(l, state))
        .map(l => l.id);
    },

    getActiveLevelId(graph, domainId) {
      const state = load(playerId);
      const domain = graph.domains.find(d => d.id === domainId);
      if (!domain) return null;

      // Eerste ontgrendelde, niet-beheerste level per skill (in volgorde)
      for (const skill of domain.skills) {
        for (const level of skill.levels) {
          const r = state[level.id];
          if (r?.mastered || r?.skipped) continue;
          if (isUnlocked(level, state)) return level.id;
        }
      }
      return null;
    },

    getMastery(levelId) {
      const state = load(playerId);
      const record = state[levelId];
      if (!record) return 0;
      return calcMastery(record.answers, 20);
    },
  };
}

// ── Augment MasteryRecord voor fallback signaal ───────────────────────────────

declare module "./mastery" {
  interface MasteryRecord {
    shouldFallback?: boolean;
  }
}
