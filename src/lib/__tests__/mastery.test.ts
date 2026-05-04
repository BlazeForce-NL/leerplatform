import { describe, it, expect, beforeEach } from "vitest";
import { createLocalMasteryStore } from "../mastery";
import { SKILL_GRAPH } from "../skillGraph";

const PLAYER = "test-player-123";

beforeEach(() => {
  localStorage.clear();
});

// ── getRecord ─────────────────────────────────────────────────────────────────

describe("getRecord", () => {
  it("geeft leeg record terug voor nieuw level", () => {
    const store = createLocalMasteryStore(PLAYER);
    const rec = store.getRecord("plus-1");
    expect(rec.levelId).toBe("plus-1");
    expect(rec.answers).toEqual([]);
    expect(rec.mastered).toBe(false);
    expect(rec.skipped).toBe(false);
  });
});

// ── recordAnswer ──────────────────────────────────────────────────────────────

describe("recordAnswer", () => {
  it("voegt correct antwoord toe aan answers", () => {
    const store = createLocalMasteryStore(PLAYER);
    store.recordAnswer("plus-1", true);
    const rec = store.getRecord("plus-1");
    expect(rec.answers).toHaveLength(1);
    expect(rec.answers[0]).toBe(true);
  });

  it("houdt maximaal 40 antwoorden bij (sliding window)", () => {
    const store = createLocalMasteryStore(PLAYER);
    for (let i = 0; i < 50; i++) store.recordAnswer("plus-1", true);
    expect(store.getRecord("plus-1").answers.length).toBeLessThanOrEqual(40);
  });

  it("markeert level als beheerst na 20 vragen met ≥80% goed", () => {
    const store = createLocalMasteryStore(PLAYER);
    // 20 correcte antwoorden → mastery = 100% ≥ 80% → beheerst
    for (let i = 0; i < 20; i++) store.recordAnswer("plus-1", true);
    expect(store.getRecord("plus-1").mastered).toBe(true);
  });

  it("behoudt niet-beheerst bij <80% correct over 20 vragen", () => {
    const store = createLocalMasteryStore(PLAYER);
    // 12 goed + 8 fout = 60% < 80%
    for (let i = 0; i < 12; i++) store.recordAnswer("plus-1", true);
    for (let i = 0; i < 8; i++) store.recordAnswer("plus-1", false);
    expect(store.getRecord("plus-1").mastered).toBe(false);
  });

  it("behoudt mastered=true en negeert verdere antwoorden", () => {
    const store = createLocalMasteryStore(PLAYER);
    for (let i = 0; i < 20; i++) store.recordAnswer("plus-1", true);
    // Nadien foute antwoorden mogen de beheersing niet ongedaan maken
    for (let i = 0; i < 5; i++) store.recordAnswer("plus-1", false);
    expect(store.getRecord("plus-1").mastered).toBe(true);
  });

  it("signaleert shouldFallback bij <40% correct over 10 vragen", () => {
    const store = createLocalMasteryStore(PLAYER);
    // 3 goed + 7 fout = 30% < 40% over 10 vragen
    for (let i = 0; i < 3; i++) store.recordAnswer("plus-1", true);
    for (let i = 0; i < 7; i++) store.recordAnswer("plus-1", false);
    const rec = store.getRecord("plus-1");
    expect(rec.shouldFallback).toBe(true);
  });
});

// ── getMastery ────────────────────────────────────────────────────────────────

describe("getMastery", () => {
  it("geeft 0 terug voor onbekend level", () => {
    const store = createLocalMasteryStore(PLAYER);
    expect(store.getMastery("bestaat-niet")).toBe(0);
  });

  it("berekent correct percentage over sliding window", () => {
    const store = createLocalMasteryStore(PLAYER);
    for (let i = 0; i < 10; i++) store.recordAnswer("plus-2", true);
    for (let i = 0; i < 10; i++) store.recordAnswer("plus-2", false);
    // 10 goed van laatste 20 = 50%
    expect(store.getMastery("plus-2")).toBeCloseTo(0.5);
  });
});

// ── getUnlockedLevelIds ───────────────────────────────────────────────────────

describe("getUnlockedLevelIds", () => {
  it("geeft plus-1 terug voor een nieuwe speler (geen afhankelijkheden)", () => {
    const store = createLocalMasteryStore(PLAYER);
    const unlocked = store.getUnlockedLevelIds(SKILL_GRAPH);
    expect(unlocked).toContain("plus-1");
  });

  it("geeft plus-2 na behalen van plus-1", () => {
    const store = createLocalMasteryStore(PLAYER);
    for (let i = 0; i < 20; i++) store.recordAnswer("plus-1", true);
    const unlocked = store.getUnlockedLevelIds(SKILL_GRAPH);
    expect(unlocked).toContain("plus-2");
  });

  it("geeft min-1 niet vrij voor plus-1 beheerst is", () => {
    const store = createLocalMasteryStore(PLAYER);
    const unlocked = store.getUnlockedLevelIds(SKILL_GRAPH);
    expect(unlocked).not.toContain("min-1");
  });

  it("geeft tafel-1 pas vrij als plus-2 EN min-2 beheerst zijn", () => {
    const store = createLocalMasteryStore(PLAYER);
    // Beheerst: plus-1, plus-2, min-1, min-2
    for (const id of ["plus-1", "plus-2", "min-1", "min-2"]) {
      for (let i = 0; i < 20; i++) store.recordAnswer(id, true);
    }
    const unlocked = store.getUnlockedLevelIds(SKILL_GRAPH);
    expect(unlocked).toContain("tafel-1");
  });
});

// ── getActiveLevelId ──────────────────────────────────────────────────────────

describe("getActiveLevelId", () => {
  it("geeft plus-1 voor een nieuwe speler", () => {
    const store = createLocalMasteryStore(PLAYER);
    expect(store.getActiveLevelId(SKILL_GRAPH, "rekenen")).toBe("plus-1");
  });

  it("geeft plus-2 nadat plus-1 beheerst is", () => {
    const store = createLocalMasteryStore(PLAYER);
    for (let i = 0; i < 20; i++) store.recordAnswer("plus-1", true);
    expect(store.getActiveLevelId(SKILL_GRAPH, "rekenen")).toBe("plus-2");
  });

  it("geeft null voor onbekend domein", () => {
    const store = createLocalMasteryStore(PLAYER);
    expect(store.getActiveLevelId(SKILL_GRAPH, "taal")).toBeNull();
  });
});

// ── skipToLevel ───────────────────────────────────────────────────────────────

describe("skipToLevel", () => {
  it("markeert alle prerequisites als skipped", () => {
    const store = createLocalMasteryStore(PLAYER);
    store.skipToLevel("plus-3", SKILL_GRAPH);
    // plus-3 hangt af van plus-2, die afhangt van plus-1
    expect(store.getRecord("plus-1").skipped).toBe(true);
    expect(store.getRecord("plus-2").skipped).toBe(true);
    // plus-3 zelf niet (dat is het doel, niet het prereq)
    expect(store.getRecord("plus-3").skipped).toBe(false);
  });

  it("ontgrendelt het doeltype na skipToLevel", () => {
    const store = createLocalMasteryStore(PLAYER);
    store.skipToLevel("plus-3", SKILL_GRAPH);
    const unlocked = store.getUnlockedLevelIds(SKILL_GRAPH);
    expect(unlocked).toContain("plus-3");
  });
});
