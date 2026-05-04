import { describe, it, expect } from "vitest";
import {
  SKILL_GRAPH,
  getLevelById,
  getAllLevels,
  getDomainLevels,
} from "../skillGraph";

// ── Graaf integriteit ─────────────────────────────────────────────────────────

describe("SKILL_GRAPH structuur", () => {
  const all = getAllLevels(SKILL_GRAPH);
  const allIds = new Set(all.map(l => l.id));

  it("bevat het domein 'rekenen'", () => {
    expect(SKILL_GRAPH.domains.map(d => d.id)).toContain("rekenen");
  });

  it("elk level heeft een uniek id", () => {
    expect(allIds.size).toBe(all.length);
  });

  it("alle depends_on verwijzen naar bestaande level-ids", () => {
    for (const level of all) {
      for (const dep of level.depends_on) {
        expect(allIds.has(dep), `Level '${level.id}' verwijst naar onbekend dep '${dep}'`).toBe(true);
      }
    }
  });

  it("elk level heeft geldige content_config", () => {
    for (const level of all) {
      const { mode, maxVal, timerSetting } = level.content_config;
      expect(mode).toBeTruthy();
      expect(maxVal).toBeGreaterThan(0);
      expect(timerSetting).toBeGreaterThanOrEqual(0);
    }
  });

  it("unlock_threshold ligt tussen 0 en 1", () => {
    for (const level of all) {
      expect(level.unlock_threshold).toBeGreaterThan(0);
      expect(level.unlock_threshold).toBeLessThanOrEqual(1);
    }
  });

  it("mastery_window is groter dan fallback_window", () => {
    for (const level of all) {
      expect(level.mastery_window).toBeGreaterThan(level.fallback_window);
    }
  });

  it("graaf bevat geen circulaire afhankelijkheden", () => {
    function hasCycle(id: string, visited: Set<string>, stack: Set<string>): boolean {
      visited.add(id);
      stack.add(id);
      const level = all.find(l => l.id === id);
      for (const dep of level?.depends_on ?? []) {
        if (!visited.has(dep) && hasCycle(dep, visited, stack)) return true;
        if (stack.has(dep)) return true;
      }
      stack.delete(id);
      return false;
    }
    for (const level of all) {
      expect(hasCycle(level.id, new Set(), new Set())).toBe(false);
    }
  });
});

// ── Rekenen skill graph inhoud ────────────────────────────────────────────────

describe("Reken skill graph — optellen", () => {
  it("heeft 5 optellen-levels (t/m 10, 20, 50, 100, 1000)", () => {
    const domain = SKILL_GRAPH.domains.find(d => d.id === "rekenen")!;
    const skill  = domain.skills.find(s => s.id === "optellen")!;
    expect(skill.levels).toHaveLength(5);
    expect(skill.levels.map(l => l.content_config.maxVal)).toEqual([10, 20, 50, 100, 1000]);
  });

  it("plus-1 heeft geen afhankelijkheden (startpunt)", () => {
    expect(getLevelById(SKILL_GRAPH, "plus-1")?.depends_on).toEqual([]);
  });

  it("elk volgend niveau hangt af van het vorige", () => {
    const ids = ["plus-1", "plus-2", "plus-3", "plus-4", "plus-5"];
    for (let i = 1; i < ids.length; i++) {
      expect(getLevelById(SKILL_GRAPH, ids[i])?.depends_on).toContain(ids[i - 1]);
    }
  });
});

describe("Reken skill graph — tafels", () => {
  it("tafel-1 beperkt tafels tot [1,2,5,10]", () => {
    const config = getLevelById(SKILL_GRAPH, "tafel-1")?.content_config;
    expect(config?.allowedTables).toEqual([1, 2, 5, 10]);
  });

  it("tafel-1 hangt af van plus-2 en min-2", () => {
    const deps = getLevelById(SKILL_GRAPH, "tafel-1")?.depends_on ?? [];
    expect(deps).toContain("plus-2");
    expect(deps).toContain("min-2");
  });

  it("tafel-5 (alle tafels) heeft geen allowedTables beperking", () => {
    const config = getLevelById(SKILL_GRAPH, "tafel-5")?.content_config;
    expect(config?.allowedTables).toBeUndefined();
  });
});

// ── getLevelById ──────────────────────────────────────────────────────────────

describe("getLevelById", () => {
  it("vindt een bestaand level", () => {
    const level = getLevelById(SKILL_GRAPH, "plus-1");
    expect(level).toBeDefined();
    expect(level?.id).toBe("plus-1");
  });

  it("geeft undefined voor onbekend id", () => {
    expect(getLevelById(SKILL_GRAPH, "bestaat-niet")).toBeUndefined();
  });
});

// ── getDomainLevels ───────────────────────────────────────────────────────────

describe("getDomainLevels", () => {
  it("geeft alle reken-levels terug", () => {
    const levels = getDomainLevels(SKILL_GRAPH, "rekenen");
    expect(levels.length).toBeGreaterThan(10);
  });

  it("geeft lege array voor onbekend domein", () => {
    expect(getDomainLevels(SKILL_GRAPH, "onbekend")).toEqual([]);
  });
});
