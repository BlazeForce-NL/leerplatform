"use client";

import { useCallback, useEffect, useState } from "react";
import { speakWord } from "@/lib/tts";
import { WORD_CATEGORIES, DISTRACTORS } from "@/content/nl/categories";
import { ri } from "@/lib/gameLogic";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";

interface Props {
  onAnswer: (correct: boolean) => void;
  onStop: () => void;
  autoAdvance?: number;
}

interface Round {
  categoryId: string;
  categoryLabel: string;
  categoryEmoji: string;
  choices: string[];    // 4 woorden: 1 of 2 passen bij categorie
  correctWords: Set<string>;
}

function makeRound(excludeCategory?: string): Round {
  const cats = WORD_CATEGORIES.filter(c => c.id !== excludeCategory);
  const cat  = cats[ri(0, cats.length - 1)];

  // 2 woorden uit categorie + 2 distractors
  const correctPool = [...cat.words].sort(() => Math.random() - 0.5);
  const corrects    = correctPool.slice(0, 2);
  const distractors = (DISTRACTORS[cat.id] ?? []).sort(() => Math.random() - 0.5).slice(0, 2);
  const choices     = [...corrects, ...distractors].sort(() => Math.random() - 0.5);

  return {
    categoryId:    cat.id,
    categoryLabel: cat.label,
    categoryEmoji: cat.emoji,
    choices,
    correctWords:  new Set(corrects),
  };
}

export default function Woordsoort({ onAnswer, onStop, autoAdvance = 3 }: Props) {
  const [round,    setRound]    = useState<Round>(() => makeRound());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked,  setChecked]  = useState(false);
  const [correct,  setCorrect]  = useState(false);

  const next = useCallback(() => {
    setRound(r => makeRound(r.categoryId));
    setSelected(new Set());
    setChecked(false);
    setCorrect(false);
  }, []);

  const countdown = useAutoAdvance(checked, autoAdvance, next);

  useEffect(() => {
    const t = setTimeout(() => speakWord(round.categoryLabel), 300);
    return () => clearTimeout(t);
  }, [round.categoryLabel]);

  function toggle(word: string) {
    if (checked) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word); else next.add(word);
      return next;
    });
  }

  function check() {
    const isCorrect = [...round.correctWords].every(w => selected.has(w))
      && [...selected].every(w => round.correctWords.has(w));
    setCorrect(isCorrect);
    setChecked(true);
    onAnswer(isCorrect);
  }

  function wordClass(w: string): string {
    if (!checked) return selected.has(w)
      ? "bg-brand-blue border-brand-blue text-white"
      : "bg-white border-gray-300 text-gray-800 hover:border-brand-blue cursor-pointer";
    if (round.correctWords.has(w) && selected.has(w)) return "bg-green-50 border-green-400 text-green-700";
    if (round.correctWords.has(w))                    return "bg-green-50 border-green-400 text-green-700 ring-2 ring-green-300";
    if (selected.has(w))                              return "bg-red-50 border-red-400 text-red-700";
    return "bg-white border-gray-200 text-gray-400";
  }

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-md mx-auto">
      <p className="text-sm font-semibold text-gray-500">Klik alle woorden die horen bij:</p>

      {/* Categorie-display */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-5xl">{round.categoryEmoji}</span>
        <span className="text-xl font-extrabold text-gray-800">{round.categoryLabel}</span>
      </div>

      {/* Woord-keuzes */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm" role="group" aria-label="Kies de juiste woorden">
        {round.choices.map(w => (
          <button key={w} type="button" onPointerUp={() => { toggle(w); speakWord(w); }} disabled={checked}
            aria-pressed={selected.has(w)}
            className={`py-4 rounded-2xl border-[3px] text-lg font-bold transition-all disabled:cursor-default ${wordClass(w)}`}>
            {w}
          </button>
        ))}
      </div>

      {!checked ? (
        <button type="button" onPointerUp={check} disabled={selected.size === 0}
          className="py-3 px-8 rounded-full bg-brand-darkgreen border-none text-white text-base font-bold cursor-pointer shadow-md disabled:opacity-40">
          Controleer ✓
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className={`font-bold text-base ${correct ? "text-brand-darkgreen" : "text-brand-red"}`}>
            {correct ? "Goed! 🎉" : `De juiste woorden waren: ${[...round.correctWords].join(" en ")}`}
          </div>
          <div className="flex gap-3">
            <button type="button" onPointerUp={next}
              className="py-3 px-8 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer shadow-md flex items-center gap-2">
              Volgende →
              {countdown > 0 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-brand-blue text-sm font-extrabold tabular-nums">{countdown}</span>}
            </button>
            <button type="button" onPointerUp={onStop} className="py-3 px-5 rounded-full border-2 border-gray-300 bg-white text-gray-600 text-sm font-semibold cursor-pointer">Stop 🏁</button>
          </div>
        </div>
      )}
    </div>
  );
}
