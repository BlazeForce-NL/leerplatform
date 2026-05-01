import { describe, it, expect, beforeEach } from "vitest";
import { isClientStorageAvailable, getStorageItem, setStorageItem } from "../storage";

beforeEach(() => {
  localStorage.clear();
});

// ── isClientStorageAvailable ──────────────────────────────────────────────────
describe("isClientStorageAvailable", () => {
  it("returns true in jsdom environment", () => {
    expect(isClientStorageAvailable()).toBe(true);
  });
});

// ── getStorageItem ────────────────────────────────────────────────────────────
describe("getStorageItem", () => {
  it("returns fallback when key is absent", () => {
    expect(getStorageItem("missing-key", 42)).toBe(42);
    expect(getStorageItem("missing-key", "default")).toBe("default");
    expect(getStorageItem("missing-key", null)).toBe(null);
  });

  it("returns the stored value when key exists", () => {
    localStorage.setItem("my-key", JSON.stringify({ x: 1 }));
    expect(getStorageItem("my-key", {})).toEqual({ x: 1 });
  });

  it("returns fallback when stored value is invalid JSON", () => {
    localStorage.setItem("bad-json", "not-json{{{");
    expect(getStorageItem("bad-json", 99)).toBe(99);
  });

  it("handles stored array correctly", () => {
    localStorage.setItem("arr", JSON.stringify([1, 2, 3]));
    expect(getStorageItem("arr", [])).toEqual([1, 2, 3]);
  });

  it("handles stored boolean correctly", () => {
    localStorage.setItem("flag", JSON.stringify(false));
    expect(getStorageItem("flag", true)).toBe(false);
  });
});

// ── setStorageItem ────────────────────────────────────────────────────────────
describe("setStorageItem", () => {
  it("persists a value that can be read back", () => {
    setStorageItem("score", 123);
    expect(getStorageItem("score", 0)).toBe(123);
  });

  it("persists an object", () => {
    const data = { player: "Bart", score: 42 };
    setStorageItem("entry", data);
    expect(getStorageItem("entry", {})).toEqual(data);
  });

  it("overwrites a previously stored value", () => {
    setStorageItem("val", "first");
    setStorageItem("val", "second");
    expect(getStorageItem("val", "")).toBe("second");
  });

  it("persists an empty array without error", () => {
    setStorageItem("empty", []);
    expect(getStorageItem("empty", null)).toEqual([]);
  });

  it("persists nested objects correctly", () => {
    const scores = { plus_t0: [{ player: "A", score: 10, correct: 5, total: 6, date: "1-1-2026" }] };
    setStorageItem("nb_scores_v1", scores);
    expect(getStorageItem("nb_scores_v1", {})).toEqual(scores);
  });
});
