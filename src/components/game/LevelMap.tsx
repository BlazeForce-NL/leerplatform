"use client";

import { useState } from "react";
import { SKILL_GRAPH, type SkillLevel } from "@/lib/skillGraph";
import { createLocalMasteryStore, levelStars } from "@/lib/mastery";
import { getPlayerId } from "@/lib/playerId";

interface Props {
  onSelectLevel: (levelId: string) => void;
  onVrijSpelen: () => void;
}

type LevelStatus = "locked" | "unlocked" | "active" | "mastered";

interface LevelWithStatus {
  level: SkillLevel;
  status: LevelStatus;
  mastery: number; // 0-1
}

function buildLevelData(domainId: string): Record<string, LevelWithStatus> {
  if (typeof window === "undefined") return {};
  const store = createLocalMasteryStore(getPlayerId());
  const unlocked = new Set(store.getUnlockedLevelIds(SKILL_GRAPH));
  const activeId = store.getActiveLevelId(SKILL_GRAPH, domainId);
  const domain = SKILL_GRAPH.domains.find(d => d.id === domainId);
  if (!domain) return {};
  const result: Record<string, LevelWithStatus> = {};
  for (const skill of domain.skills) {
    for (const level of skill.levels) {
      const record = store.getRecord(level.id);
      let status: LevelStatus = "locked";
      if (record.mastered || record.skipped) status = "mastered";
      else if (level.id === activeId) status = "active";
      else if (unlocked.has(level.id)) status = "unlocked";
      result[level.id] = { level, status, mastery: store.getMastery(level.id) };
    }
  }
  return result;
}

export default function LevelMap({ onSelectLevel, onVrijSpelen }: Props) {
  const activeDomain = "rekenen";
  // Lazy initialisatie: leest localStorage eenmalig bij mount (client-only)
  const [levelData, setLevelData] = useState<Record<string, LevelWithStatus>>(
    () => buildLevelData(activeDomain),
  );

  const domain = SKILL_GRAPH.domains.find(d => d.id === activeDomain);
  if (!domain) return null;

  return (
    <div className="min-h-dvh bg-game-bg font-sans px-3 py-4 md:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-gray-800">{domain.emoji} {domain.name}</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onPointerUp={() => setLevelData(buildLevelData(activeDomain))}
            className="px-2.5 py-1.5 rounded-full border-2 border-gray-200 bg-white text-gray-400 text-xs font-semibold cursor-pointer"
            aria-label="Kaart vernieuwen"
          >↺</button>
          <button
            type="button"
            onPointerUp={onVrijSpelen}
            className="px-3 py-1.5 rounded-full border-2 border-gray-300 bg-white text-gray-600 text-xs font-semibold cursor-pointer"
          >
            Vrij spelen
          </button>
        </div>
      </div>

      {/* Skills */}
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {domain.skills.map(skill => (
          <div key={skill.id}>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">
              {skill.name}
            </h2>
            <div className="flex flex-col gap-2">
              {skill.levels.map(level => {
                const d = levelData[level.id];
                if (!d) return null;
                return (
                  <LevelCard
                    key={level.id}
                    data={d}
                    onSelect={() => d.status !== "locked" && onSelectLevel(level.id)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="flex justify-center gap-4 mt-8 text-xs text-gray-400">
        <span>🔒 Vergrendeld</span>
        <span>▶ Ontgrendeld</span>
        <span>⭐ Actief niveau</span>
        <span>✅ Beheerst</span>
      </div>
    </div>
  );
}

function LevelCard({ data, onSelect }: { data: LevelWithStatus; onSelect: () => void }) {
  const { level, status, mastery } = data;

  const styles: Record<LevelStatus, string> = {
    locked:   "bg-gray-100 border-gray-200 text-gray-400 cursor-default",
    unlocked: "bg-white border-gray-300 text-gray-700 cursor-pointer hover:border-blue-400 hover:shadow-sm",
    active:   "bg-white border-blue-500 text-gray-800 cursor-pointer shadow-md ring-2 ring-blue-200",
    mastered: "bg-green-50 border-green-300 text-green-800 cursor-pointer",
  };

  const icons: Record<LevelStatus, string> = {
    locked:   "🔒",
    unlocked: "▶",
    active:   "⭐",
    mastered: "✅",
  };

  const masteryPct = Math.round(mastery * 100);
  const stars = levelStars(mastery);

  return (
    <button
      type="button"
      onPointerUp={onSelect}
      disabled={status === "locked"}
      aria-label={`${level.name} — ${status === "locked" ? "vergrendeld" : status === "mastered" ? `beheerst, ${stars} ster${stars !== 1 ? "ren" : ""}` : "actief"}`}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${styles[status]}`}
    >
      <span className="text-xl w-7 flex-none" aria-hidden="true">{icons[status]}</span>
      <div className="flex-1 text-left">
        <div className="font-semibold text-sm">{level.name}</div>
        {status !== "locked" && (
          <div className="text-xs text-gray-400 mt-0.5">
            {level.content_config.allowedTables
              ? `Tafels: ${level.content_config.allowedTables.join(", ")}`
              : `t/m ${level.content_config.maxVal}`}
          </div>
        )}
      </div>
      <div className="flex-none text-right">
        {status === "mastered" && (
          <div className="flex gap-0.5 mb-1" aria-hidden="true">
            {[1, 2, 3].map(s => (
              <span key={s} className={s <= stars ? "text-brand-yellow" : "text-gray-200"}>★</span>
            ))}
          </div>
        )}
        {(status === "active") && (
          <>
            <div className="text-xs font-bold">{masteryPct}%</div>
            <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all [width:var(--p)]"
                style={{ "--p": `${masteryPct}%` } as React.CSSProperties}
              />
            </div>
          </>
        )}
      </div>
    </button>
  );
}
