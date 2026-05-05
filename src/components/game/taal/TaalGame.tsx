"use client";

import { useState } from "react";
import { getLevelById } from "@/lib/skillGraph";
import { SKILL_GRAPH } from "@/lib/skillGraph";
import { knownLetters } from "@/lib/taalContent";
import { LETTER_SETS } from "@/lib/taalContent";
import { createLocalMasteryStore } from "@/lib/mastery";
import LetterHerkenning from "./LetterHerkenning";
import WoordHakken from "./WoordHakken";
import WoordPlakken from "./WoordPlakken";

interface Props {
  levelId: string;
  playerId: string;
  onStop: () => void;       // eindigt de sessie
  onGoToLevels: () => void; // terug naar niveaukaart
}

export default function TaalGame({ levelId, playerId, onStop, onGoToLevels }: Props) {
  const [score,  setScore]  = useState(0);
  const [streak, setStreak] = useState(0);
  const [total,  setTotal]  = useState(0);

  const level = getLevelById(SKILL_GRAPH, levelId);
  if (!level) return null;

  const { taalSkill, letterSet, wordDifficulty } = level.content_config;
  const store = createLocalMasteryStore(playerId);

  function handleAnswer(correct: boolean) {
    setTotal(t => t + 1);
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    store.recordAnswer(levelId, correct);
  }

  // Bepaal welke letters al bekend zijn voor distractors in letterherkenning
  const thisSet = LETTER_SETS.find(s => s.levelId === levelId);
  const difficultyUpTo = (thisSet?.difficulty ?? 1);
  const known = knownLetters(difficultyUpTo);

  return (
    <div className="min-h-dvh bg-level-bg font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <button
          type="button"
          onPointerUp={onGoToLevels}
          className="px-2.5 py-1.5 rounded-xl border-2 border-gray-200 bg-white text-gray-500 text-xs font-semibold cursor-pointer"
          aria-label="Terug naar niveaukaart"
        >
          🗺️ Kaart
        </button>

        <div className="text-center">
          <div className="text-sm font-bold text-gray-700">{level.name}</div>
          <div className="text-xs text-gray-400">
            {score}/{total} goed &nbsp;·&nbsp;
            {streak > 0 && <span className="text-brand-yellow">{"⭐".repeat(Math.min(streak, 5))}</span>}
          </div>
        </div>

        <button
          type="button"
          onPointerUp={onStop}
          className="px-2.5 py-1.5 rounded-xl border-2 border-gray-200 bg-white text-gray-500 text-xs font-semibold cursor-pointer"
        >
          Stop 🏁
        </button>
      </div>

      {/* Game content */}
      <div className="flex-1 overflow-y-auto">
        {taalSkill === "letters" && letterSet && (
          <LetterHerkenning
            letterSet={letterSet}
            allKnownLetters={known}
            onAnswer={handleAnswer}
            onStop={onStop}
          />
        )}
        {taalSkill === "hakken" && wordDifficulty && (
          <WoordHakken
            wordDifficulty={wordDifficulty}
            onAnswer={handleAnswer}
            onStop={onStop}
          />
        )}
        {taalSkill === "plakken" && wordDifficulty && (
          <WoordPlakken
            wordDifficulty={wordDifficulty}
            onAnswer={handleAnswer}
            onStop={onStop}
          />
        )}
        {!taalSkill && (
          <div className="p-8 text-center text-gray-400">
            Onbekende taal-activiteit voor level {levelId}.
          </div>
        )}
      </div>
    </div>
  );
}
