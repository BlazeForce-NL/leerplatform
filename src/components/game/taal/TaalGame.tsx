"use client";

import { useState } from "react";
import { getLevelById, SKILL_GRAPH } from "@/lib/skillGraph";
import { knownLetters, LETTER_SETS } from "@/lib/taalContent";
import type { TaalSkill } from "@/lib/skillGraph";
import { createLocalMasteryStore } from "@/lib/mastery";
import LetterHerkenning from "./LetterHerkenning";
import WoordHakken from "./WoordHakken";
import WoordPlakken from "./WoordPlakken";

interface Props {
  levelId: string;
  playerId: string;
  onStop: () => void;
  onGoToLevels: () => void;
}

const AUTO_OPTS = [
  { l: "Geen",  v: 0 },
  { l: "3s",    v: 3 },
  { l: "5s",    v: 5 },
  { l: "10s",   v: 10 },
];

const SKILL_LABELS: Record<TaalSkill, string> = {
  letters:   "Letters herkennen",
  hakken:    "Woordjes hakken",
  plakken:   "Woordjes plakken",
  schrijven: "Woordjes schrijven",
};

const BTN = "px-3 py-1.5 min-h-touch rounded-full border-2 font-semibold text-sm cursor-pointer";
const BTN_OFF = `${BTN} border-gray-300 bg-white text-gray-600`;
const BTN_ON  = `${BTN} border-brand-blue bg-brand-blue text-white`;

export default function TaalGame({ levelId, playerId, onStop, onGoToLevels }: Props) {
  const level = getLevelById(SKILL_GRAPH, levelId);

  // Instellingen — overrides op de level-config
  const [activeSkill, setActiveSkill] = useState<TaalSkill>(
    level?.content_config.taalSkill ?? "letters",
  );
  const [wordDifficulty, setWordDifficulty] = useState<1 | 2 | 3 | 4>(
    (level?.content_config.wordDifficulty as 1 | 2 | 3 | 4) ?? 1,
  );
  const [letterSetIdx, setLetterSetIdx] = useState(
    LETTER_SETS.findIndex(s => s.levelId === levelId) === -1
      ? 0
      : LETTER_SETS.findIndex(s => s.levelId === levelId),
  );
  const [autoAdvance, setAutoAdvance] = useState(3);
  const [settingsOpen, setSettingsOpen] = useState(true);

  // Score
  const [score,  setScore]  = useState(0);
  const [streak, setStreak] = useState(0);
  const [total,  setTotal]  = useState(0);

  if (!level) return null;

  const store = createLocalMasteryStore(playerId);

  function handleAnswer(correct: boolean) {
    setTotal(t => t + 1);
    if (correct) { setScore(s => s + 1); setStreak(s => s + 1); }
    else         { setStreak(0); }
    store.recordAnswer(levelId, correct);
  }

  const letterSet = LETTER_SETS[letterSetIdx]?.letters ?? ["s","a","m","r","e","i"];
  const diffUp    = LETTER_SETS[letterSetIdx]?.difficulty ?? 1;
  const known     = knownLetters(diffUp);

  return (
    <div className="min-h-dvh bg-level-bg font-sans md:flex md:h-dvh md:overflow-hidden">

      {/* ── Hoofdinhoud ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <button type="button" onPointerUp={onGoToLevels}
            className="px-2.5 py-1.5 rounded-xl border-2 border-gray-200 bg-white text-gray-500 text-xs font-semibold cursor-pointer"
            aria-label="Terug naar niveaukaart">
            🗺️ Kaart
          </button>

          <div className="text-center">
            <div className="text-sm font-bold text-gray-700">{SKILL_LABELS[activeSkill]}</div>
            <div className="text-xs text-gray-400">
              {score}/{total} goed
              {streak > 0 && <span className="ml-1 text-brand-yellow">{"⭐".repeat(Math.min(streak, 5))}</span>}
            </div>
          </div>

          <div className="flex gap-1.5">
            {/* Instellingen toggle (mobiel) */}
            <button type="button" onPointerUp={() => setSettingsOpen(v => !v)}
              className="md:hidden px-2.5 py-1.5 rounded-xl border-2 border-gray-200 bg-white text-gray-500 text-xs font-semibold cursor-pointer"
              aria-label="Instellingen">
              ⚙️
            </button>
            <button type="button" onPointerUp={onStop}
              className="px-2.5 py-1.5 rounded-xl border-2 border-gray-200 bg-white text-gray-500 text-xs font-semibold cursor-pointer">
              Stop 🏁
            </button>
          </div>
        </div>

        {/* Mobiel instellingen-paneel */}
        {settingsOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex flex-col gap-3">
            <Settings
              activeSkill={activeSkill}        onSkill={setActiveSkill}
              wordDifficulty={wordDifficulty}  onWordDifficulty={setWordDifficulty}
              letterSetIdx={letterSetIdx}      onLetterSetIdx={setLetterSetIdx}
              autoAdvance={autoAdvance}        onAutoAdvance={setAutoAdvance}
            />
          </div>
        )}

        {/* Game content */}
        <div className="flex-1 overflow-y-auto">
          {activeSkill === "letters" && (
            <LetterHerkenning
              key={`${letterSetIdx}`}
              letterSet={letterSet}
              allKnownLetters={known}
              onAnswer={handleAnswer}
              onStop={onStop}
              autoAdvance={autoAdvance}
            />
          )}
          {activeSkill === "hakken" && (
            <WoordHakken
              key={`hakken-${wordDifficulty}`}
              wordDifficulty={wordDifficulty}
              onAnswer={handleAnswer}
              onStop={onStop}
              autoAdvance={autoAdvance}
            />
          )}
          {activeSkill === "plakken" && (
            <WoordPlakken
              key={`plakken-${wordDifficulty}`}
              wordDifficulty={wordDifficulty}
              onAnswer={handleAnswer}
              onStop={onStop}
              autoAdvance={autoAdvance}
            />
          )}
        </div>
      </div>

      {/* ── Desktop instellingen-zijbalk ─────────────────────────────── */}
      <aside className={`hidden md:flex md:flex-col md:border-l md:border-gray-200 md:bg-white md:overflow-y-auto md:transition-all md:duration-200 ${settingsOpen ? "md:w-72" : "md:w-12"}`}>
        <div className="p-2 border-b border-gray-100 flex items-center">
          {settingsOpen && <span className="text-xs font-semibold text-gray-500 flex-1">Instellingen</span>}
          <button type="button" onPointerUp={() => setSettingsOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 text-base cursor-pointer hover:bg-gray-50 flex-none"
            aria-label={settingsOpen ? "Inklappen" : "Uitklappen"}>
            {settingsOpen ? "›" : "‹"}
          </button>
        </div>
        {settingsOpen && (
          <div className="p-3 flex flex-col gap-4">
            <Settings
              activeSkill={activeSkill}        onSkill={setActiveSkill}
              wordDifficulty={wordDifficulty}  onWordDifficulty={setWordDifficulty}
              letterSetIdx={letterSetIdx}      onLetterSetIdx={setLetterSetIdx}
              autoAdvance={autoAdvance}        onAutoAdvance={setAutoAdvance}
            />
          </div>
        )}
      </aside>
    </div>
  );
}

// ── Settings component ────────────────────────────────────────────────────────

interface SettingsProps {
  activeSkill: TaalSkill;
  onSkill: (s: TaalSkill) => void;
  wordDifficulty: 1 | 2 | 3 | 4;
  onWordDifficulty: (d: 1 | 2 | 3 | 4) => void;
  letterSetIdx: number;
  onLetterSetIdx: (i: number) => void;
  autoAdvance: number;
  onAutoAdvance: (v: number) => void;
}

function Settings({ activeSkill, onSkill, wordDifficulty, onWordDifficulty, letterSetIdx, onLetterSetIdx, autoAdvance, onAutoAdvance }: SettingsProps) {
  return (
    <>
      {/* Activiteit */}
      <div>
        <div className="text-xs font-semibold text-gray-400 mb-1.5">Activiteit</div>
        <div className="flex flex-wrap gap-1.5">
          {(["letters", "hakken", "plakken"] as TaalSkill[]).map(s => (
            <button key={s} type="button" onPointerUp={() => onSkill(s)}
              className={activeSkill === s ? BTN_ON : BTN_OFF}>
              {s === "letters" ? "🔤 Letters" : s === "hakken" ? "✂️ Hakken" : "🔗 Plakken"}
            </button>
          ))}
        </div>
      </div>

      {/* Letter-set (alleen bij letterherkenning) */}
      {activeSkill === "letters" && (
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-1.5">Letter-set</div>
          <div className="flex flex-wrap gap-1.5">
            {LETTER_SETS.map((s, i) => (
              <button key={s.levelId} type="button" onPointerUp={() => onLetterSetIdx(i)}
                className={letterSetIdx === i ? BTN_ON : BTN_OFF}>
                L{s.difficulty}: {s.letters.join(", ")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Moeilijkheid woorden (bij hakken/plakken) */}
      {(activeSkill === "hakken" || activeSkill === "plakken") && (
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-1.5">Moeilijkheid</div>
          <div className="flex flex-wrap gap-1.5">
            {([1, 2] as const).map(d => (
              <button key={d} type="button" onPointerUp={() => onWordDifficulty(d)}
                className={wordDifficulty === d ? BTN_ON : BTN_OFF}>
                {d === 1 ? "Level 1 — MKM" : "Level 2 — MMKM"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Auto-advance */}
      <div>
        <div className="text-xs font-semibold text-gray-400 mb-1.5">Automatisch door</div>
        <div className="flex flex-wrap gap-1.5">
          {AUTO_OPTS.map(o => (
            <button key={o.v} type="button" onPointerUp={() => onAutoAdvance(o.v)}
              className={autoAdvance === o.v ? BTN_ON : BTN_OFF}>
              {o.l}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
