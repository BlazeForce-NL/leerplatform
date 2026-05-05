"use client";

import { useState } from "react";
import { getLevelById, SKILL_GRAPH } from "@/lib/skillGraph";
import { knownLetters, LETTER_SETS } from "@/lib/taalContent";
import type { TaalSkill } from "@/lib/skillGraph";
import { createLocalMasteryStore } from "@/lib/mastery";
import LetterHerkenning from "./LetterHerkenning";
import WoordPlakken from "./WoordPlakken";
import MissendeLetter from "./MissendeLetter";
import Eindletter from "./Eindletter";
import Beginletter from "./Beginletter";
import Rijmwoord from "./Rijmwoord";
import KlankenTellen from "./KlankenTellen";
import Woordtypist from "./Woordtypist";
import Woordvolgorde from "./Woordvolgorde";
import Woordsoort from "./Woordsoort";
import LocaleSwitcher from "@/components/LocaleSwitcher";

interface Props {
  levelId: string;
  playerId: string;
  onStop: () => void;
  onGoToLevels: () => void;
}

const AUTO_OPTS = [
  { l: "Geen", v: 0 },
  { l: "3s",   v: 3 },
  { l: "5s",   v: 5 },
  { l: "10s",  v: 10 },
];

const SKILL_LABELS: Partial<Record<TaalSkill, string>> = {
  letters:         "🔤 Letters",
  plakken:         "🔗 Plakken",
  "missende-letter": "🔲 Missende letter",
  eindletter:      "🔚 Eindletter",
  beginletter:     "🔛 Beginletter",
  rijmwoord:       "🎵 Rijmwoord",
  "klanken-tellen": "🔢 Klanken tellen",
  woordtypist:     "⌨️ Woordtypist",
  woordvolgorde:   "🔀 Woordvolgorde",
  woordsoort:      "🗂️ Woordsoort",
};

const SKILLS_ORDER: TaalSkill[] = [
  "letters", "eindletter", "beginletter", "klanken-tellen",
  "plakken", "missende-letter", "rijmwoord",
  "woordtypist", "woordvolgorde", "woordsoort",
];

const BTN  = "px-3 py-1.5 min-h-touch rounded-full border-2 font-semibold text-sm cursor-pointer";
const B_ON = `${BTN} border-brand-blue bg-brand-blue text-white`;
const B_OF = `${BTN} border-gray-300 bg-white text-gray-600`;

export default function TaalGame({ levelId, playerId, onStop, onGoToLevels }: Props) {
  const level = getLevelById(SKILL_GRAPH, levelId);

  const [activeSkill,    setActiveSkill]    = useState<TaalSkill>(level?.content_config.taalSkill ?? "letters");
  const [wordDifficulty, setWordDifficulty] = useState<1|2|3|4>((level?.content_config.wordDifficulty as 1|2|3|4) ?? 1);
  const [letterSetIdx,   setLetterSetIdx]   = useState(Math.max(0, LETTER_SETS.findIndex(s => s.levelId === levelId)));
  const [autoAdvance,    setAutoAdvance]    = useState(3);
  const [settingsOpen,   setSettingsOpen]   = useState(true);
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
  const known     = knownLetters(LETTER_SETS[letterSetIdx]?.difficulty ?? 1);

  // Herstart subgame bij wisseling van activiteit of moeilijkheid
  const gameKey = `${activeSkill}-${wordDifficulty}-${letterSetIdx}`;

  const settingsPanel = (
    <>
      {/* Domein-switcher */}
      <div>
        <div className="text-xs font-semibold text-gray-400 mb-1.5">Wereld</div>
        <div className="flex gap-1.5">
          <button type="button" onPointerUp={onGoToLevels}
            className={B_OF}>🔢 Rekenen</button>
          <button type="button" className={B_ON}>📖 Taal</button>
        </div>
      </div>

      {/* Activiteit */}
      <div>
        <div className="text-xs font-semibold text-gray-400 mb-1.5">Activiteit</div>
        <div className="flex flex-wrap gap-1.5">
          {SKILLS_ORDER.map(s => (
            <button key={s} type="button" onPointerUp={() => setActiveSkill(s)}
              className={activeSkill === s ? B_ON : B_OF}>
              {SKILL_LABELS[s] ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Letter-set (alleen bij letterherkenning/beginletter/eindletter) */}
      {(activeSkill === "letters" || activeSkill === "eindletter" || activeSkill === "beginletter") && (
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-1.5">Letter-set</div>
          <div className="flex flex-wrap gap-1.5">
            {LETTER_SETS.map((s, i) => (
              <button key={s.levelId} type="button" onPointerUp={() => setLetterSetIdx(i)}
                className={letterSetIdx === i ? B_ON : B_OF}>
                L{s.difficulty}: {s.letters.slice(0,4).join("")}…
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Moeilijkheid woorden */}
      {["plakken","missende-letter","eindletter","klanken-tellen","woordtypist"].includes(activeSkill) && (
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-1.5">Moeilijkheid</div>
          <div className="flex flex-wrap gap-1.5">
            {([1,2,3] as const).map(d => (
              <button key={d} type="button" onPointerUp={() => setWordDifficulty(d)}
                className={wordDifficulty === d ? B_ON : B_OF}>
                {d === 1 ? "3 letters" : d === 2 ? "4 letters" : "5 letters"}
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
            <button key={o.v} type="button" onPointerUp={() => setAutoAdvance(o.v)}
              className={autoAdvance === o.v ? B_ON : B_OF}>{o.l}</button>
          ))}
        </div>
      </div>

      {/* Taalwisselaar */}
      <LocaleSwitcher />
    </>
  );

  function renderGame() {
    const shared = { key: gameKey, onAnswer: handleAnswer, onStop, autoAdvance };
    switch (activeSkill) {
      case "letters":          return <LetterHerkenning {...shared} letterSet={letterSet} allKnownLetters={known} />;
      case "plakken":          return <WoordPlakken {...shared} wordDifficulty={wordDifficulty} />;
      case "missende-letter":  return <MissendeLetter {...shared} wordDifficulty={wordDifficulty} />;
      case "eindletter":       return <Eindletter {...shared} wordDifficulty={wordDifficulty} />;
      case "beginletter":      return <Beginletter {...shared} />;
      case "rijmwoord":        return <Rijmwoord {...shared} />;
      case "klanken-tellen":   return <KlankenTellen {...shared} wordDifficulty={wordDifficulty} />;
      case "woordtypist":      return <Woordtypist {...shared} wordDifficulty={wordDifficulty} />;
      case "woordvolgorde":    return <Woordvolgorde {...shared} />;
      case "woordsoort":       return <Woordsoort {...shared} />;
      default:                 return <div className="p-8 text-center text-gray-400">Onbekende activiteit</div>;
    }
  }

  return (
    <div className="min-h-dvh bg-level-bg font-sans md:flex md:h-dvh md:overflow-hidden">
      <div className="flex-1 flex flex-col md:overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <button type="button" onPointerUp={onGoToLevels}
            className="px-2.5 py-1.5 rounded-xl border-2 border-gray-200 bg-white text-gray-500 text-xs font-semibold cursor-pointer"
            aria-label="Naar niveaukaart">
            🗺️ Kaart
          </button>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-700">{SKILL_LABELS[activeSkill] ?? activeSkill}</div>
            <div className="text-xs text-gray-400">
              {score}/{total} goed
              {streak > 0 && <span className="ml-1 text-brand-yellow">{"⭐".repeat(Math.min(streak, 5))}</span>}
            </div>
          </div>
          <div className="flex gap-1.5">
            <button type="button" onPointerUp={() => setSettingsOpen(v => !v)}
              className="md:hidden px-2.5 py-1.5 rounded-xl border-2 border-gray-200 bg-white text-gray-500 text-xs font-semibold cursor-pointer"
              aria-label="Instellingen">⚙️</button>
            <button type="button" onPointerUp={onStop}
              className="px-2.5 py-1.5 rounded-xl border-2 border-gray-200 bg-white text-gray-500 text-xs font-semibold cursor-pointer">
              Stop 🏁
            </button>
          </div>
        </div>

        {/* Mobiel instellingen */}
        {settingsOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex flex-col gap-3">
            {settingsPanel}
          </div>
        )}

        {/* Game */}
        <div className="flex-1 overflow-y-auto">{renderGame()}</div>
      </div>

      {/* Desktop zijbalk */}
      <aside className={`hidden md:flex md:flex-col md:border-l md:border-gray-200 md:bg-white md:overflow-y-auto md:transition-all md:duration-200 ${settingsOpen ? "md:w-72" : "md:w-12"}`}>
        <div className="p-2 border-b border-gray-100 flex items-center">
          {settingsOpen && <span className="text-xs font-semibold text-gray-500 flex-1">Instellingen</span>}
          <button type="button" onPointerUp={() => setSettingsOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 text-base cursor-pointer hover:bg-gray-50 flex-none"
            aria-label={settingsOpen ? "Inklappen" : "Uitklappen"}>
            {settingsOpen ? "›" : "‹"}
          </button>
        </div>
        {settingsOpen && <div className="p-3 flex flex-col gap-4">{settingsPanel}</div>}
      </aside>
    </div>
  );
}
