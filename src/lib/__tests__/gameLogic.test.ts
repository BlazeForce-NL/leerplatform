import { describe, it, expect } from "vitest";
import {
  ri, catLabel, scoreCat, makeQ, makeChoices, calcScore,
  ANON, STORAGE_KEY,
} from "../gameLogic";

// ── ri ────────────────────────────────────────────────────────────────────────
describe("ri", () => {
  it("returns an integer within [a, b]", () => {
    for (let i = 0; i < 200; i++) {
      const v = ri(3, 9);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(9);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it("returns the only possible value when min === max", () => {
    expect(ri(7, 7)).toBe(7);
  });
});

// ── catLabel ──────────────────────────────────────────────────────────────────
describe("catLabel", () => {
  it("formats plus without timer", () => {
    expect(catLabel("plus_t0")).toBe("Optellen");
  });

  it("appends timer suffix when timer > 0", () => {
    expect(catLabel("min_t30")).toBe("Aftrekken (30s)");
    expect(catLabel("mix_t15")).toBe("+ en − (15s)");
  });

  it("formats tafel_N correctly", () => {
    expect(catLabel("tafel_3_t0")).toBe("Tafel van 3");
    expect(catLabel("tafel_10_t20")).toBe("Tafel van 10 (20s)");
  });

  it("formats alle tafels", () => {
    expect(catLabel("tafel_t0")).toBe("Alle tafels");
  });

  it("formats alles mix", () => {
    expect(catLabel("alles_t0")).toBe("Alles mix");
  });
});

// ── scoreCat ──────────────────────────────────────────────────────────────────
describe("scoreCat", () => {
  it("builds key for standard modes", () => {
    expect(scoreCat("plus",  0, 0)).toBe("plus_t0");
    expect(scoreCat("min",   0, 30)).toBe("min_t30");
    expect(scoreCat("mix",   0, 0)).toBe("mix_t0");
    expect(scoreCat("tafel", 0, 20)).toBe("tafel_t20");
    expect(scoreCat("alles", 0, 0)).toBe("alles_t0");
  });

  it("encodes tafel_specific as tafel_N", () => {
    expect(scoreCat("tafel_specific", 3, 0)).toBe("tafel_3_t0");
    expect(scoreCat("tafel_specific", 10, 15)).toBe("tafel_10_t15");
  });
});

// ── calcScore ─────────────────────────────────────────────────────────────────
describe("calcScore", () => {
  it("+1 per correct answer (no combo)", () => {
    expect(calcScore(0, 0)).toMatchObject({ score: 1, newStreak: 1, isCombo: false });
    expect(calcScore(5, 1)).toMatchObject({ score: 6, newStreak: 2, isCombo: false });
    expect(calcScore(8, 0)).toMatchObject({ score: 9, newStreak: 1, isCombo: false });
  });

  it("+2 (combo) when new streak reaches 3", () => {
    expect(calcScore(4, 2)).toMatchObject({ score: 6, newStreak: 3, isCombo: true });
  });

  it("+2 (combo) for every answer with streak >= 3", () => {
    expect(calcScore(10, 4)).toMatchObject({ score: 12, newStreak: 5, isCombo: true });
    expect(calcScore(12, 9)).toMatchObject({ score: 14, newStreak: 10, isCombo: true });
  });

  it("streak increments by exactly 1", () => {
    const { newStreak } = calcScore(0, 5);
    expect(newStreak).toBe(6);
  });
});

// ── makeQ ─────────────────────────────────────────────────────────────────────
describe("makeQ (plus)", () => {
  it("generates addition question with correct answer", () => {
    for (let i = 0; i < 50; i++) {
      const { q } = makeQ("plus", 0, "mix", 0);
      expect(q.op).toBe("+");
      expect(q.answer).toBe(q.a + q.b);
      expect(q.a).toBeGreaterThanOrEqual(1);
      expect(q.b).toBeGreaterThanOrEqual(1);
      expect(q.a + q.b).toBeLessThanOrEqual(100);
    }
  });
});

describe("makeQ (min)", () => {
  it("generates subtraction question with non-negative answer", () => {
    for (let i = 0; i < 50; i++) {
      const { q } = makeQ("min", 0, "mix", 0);
      expect(q.op).toBe("−");
      expect(q.answer).toBe(q.a - q.b);
      expect(q.answer).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("makeQ (tafel — random)", () => {
  it("generates multiplication question with correct answer", () => {
    for (let i = 0; i < 50; i++) {
      const { q } = makeQ("tafel", 0, "mix", 0);
      expect(q.op).toBe("×");
      expect(q.answer).toBe(q.a * q.b);
      expect(q.a).toBeGreaterThanOrEqual(1);
      expect(q.b).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("makeQ (tafel_specific — volgorde)", () => {
  it("uses the specific table and increments index sequentially", () => {
    const { q: q0, nextIdx: ni0 } = makeQ("tafel_specific", 5, "volgorde", 0);
    expect(q0.a).toBe(5);
    expect(q0.b).toBe(1);
    expect(ni0).toBe(1);

    const { q: q1, nextIdx: ni1 } = makeQ("tafel_specific", 5, "volgorde", 9);
    expect(q1.b).toBe(10);
    expect(ni1).toBe(0); // wraps around
  });

  it("uses the specific table with random b when order is mix", () => {
    for (let i = 0; i < 30; i++) {
      const { q } = makeQ("tafel_specific", 7, "mix", 0);
      expect(q.a).toBe(7);
      expect(q.b).toBeGreaterThanOrEqual(1);
      expect(q.b).toBeLessThanOrEqual(10);
    }
  });
});

describe("makeQ (mix)", () => {
  it("generates only plus or min questions", () => {
    const ops = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const { q } = makeQ("mix", 0, "mix", 0);
      ops.add(q.op);
    }
    expect(ops.has("+") || ops.has("−")).toBe(true);
    expect(ops.has("×")).toBe(false);
  });
});

describe("makeQ (alles)", () => {
  it("generates plus, min, and tafel questions across many runs", () => {
    const ops = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const { q } = makeQ("alles", 0, "mix", 0);
      ops.add(q.op);
    }
    expect(ops.has("+")).toBe(true);
    expect(ops.has("−")).toBe(true);
    expect(ops.has("×")).toBe(true);
  });
});

// ── makeChoices ───────────────────────────────────────────────────────────────
describe("makeChoices", () => {
  it("always includes the correct answer", () => {
    for (let i = 0; i < 50; i++) {
      const correct = ri(0, 100);
      const choices = makeChoices(correct, "+");
      expect(choices).toContain(correct);
    }
  });

  it("returns exactly 4 choices", () => {
    expect(makeChoices(12, "+")).toHaveLength(4);
    expect(makeChoices(5, "×")).toHaveLength(4);
  });

  it("all choices are non-negative", () => {
    for (let i = 0; i < 50; i++) {
      const choices = makeChoices(ri(0, 100), "+");
      choices.forEach(c => expect(c).toBeGreaterThanOrEqual(0));
    }
  });

  it("all choices are unique", () => {
    for (let i = 0; i < 30; i++) {
      const choices = makeChoices(ri(5, 95), "+");
      expect(new Set(choices).size).toBe(4);
    }
  });
});

// ── constants ─────────────────────────────────────────────────────────────────
describe("constants", () => {
  it("ANON is a non-empty string", () => {
    expect(typeof ANON).toBe("string");
    expect(ANON.length).toBeGreaterThan(0);
  });

  it("STORAGE_KEY is a non-empty string", () => {
    expect(typeof STORAGE_KEY).toBe("string");
    expect(STORAGE_KEY.length).toBeGreaterThan(0);
  });
});
