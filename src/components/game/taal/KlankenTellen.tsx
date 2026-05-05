"use client";

import { useCallback, useEffect, useState } from "react";
import { speakWord } from "@/lib/tts";
import { getWordsByDifficulty } from "@/content/nl/words";
import { ri } from "@/lib/gameLogic";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import type { TaalWord } from "@/lib/taalContent";

interface Props {
  wordDifficulty: 1 | 2 | 3 | 4;
  onAnswer: (correct: boolean) => void;
  onStop: () => void;
  autoAdvance?: number;
}

function pickWord(d: 1 | 2 | 3 | 4, exclude?: string): TaalWord {
  const pool = getWordsByDifficulty(d).filter(w => w.id !== exclude);
  return pool[ri(0, pool.length - 1)];
}

function makeChoices(correct: number): number[] {
  const set = new Set([correct]);
  while (set.size < 4) {
    const v = Math.max(1, correct + ri(-2, 2));
    if (v !== correct) set.add(v);
  }
  return [...set].sort(() => Math.random() - 0.5);
}

export default function KlankenTellen({ wordDifficulty, onAnswer, onStop, autoAdvance = 3 }: Props) {
  const [word,     setWord]     = useState<TaalWord>(() => pickWord(wordDifficulty));
  const [choices,  setChoices]  = useState<number[]>(() => makeChoices(pickWord(wordDifficulty).segments.length));
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const correct = word.segments.length;

  const next = useCallback(() => {
    const w = pickWord(wordDifficulty, word.id);
    setWord(w);
    setChoices(makeChoices(w.segments.length));
    setSelected(null);
    setAnswered(false);
  }, [wordDifficulty, word.id]);

  const countdown = useAutoAdvance(answered, autoAdvance, next);

  useEffect(() => {
    const t = setTimeout(() => speakWord(word.word), 350);
    return () => clearTimeout(t);
  }, [word.word]);

  // Keyboard: press 1-6
  useEffect(() => {
    if (answered) return;
    function onKey(e: KeyboardEvent) {
      const n = parseInt(e.key);
      if (!isNaN(n) && choices.includes(n)) handleAnswer(n);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, choices]);

  function handleAnswer(n: number) {
    if (answered) return;
    setSelected(n);
    setAnswered(true);
    onAnswer(n === correct);
  }

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-md mx-auto">
      <div className="text-5xl">{word.emoji ?? "📝"}</div>

      <button type="button" onPointerUp={() => speakWord(word.word)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue text-white font-bold text-sm cursor-pointer shadow-md">
        🔊 Luisteren
      </button>

      <p className="text-sm font-semibold text-gray-500">Hoeveel klanken hoor je?</p>

      {/* Segmenten-visualisatie na antwoord */}
      {answered && (
        <div className="flex gap-2 items-center">
          {word.segments.map((seg, i) => (
            <div key={i} className="px-3 py-2 rounded-xl bg-brand-blue text-white font-bold text-lg">{seg}</div>
          ))}
          <span className="text-gray-400 text-sm ml-1">= {correct}</span>
        </div>
      )}

      {/* Getal-keuzes */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs" role="group" aria-label="Hoeveel klanken?">
        {choices.map(n => {
          const isC = answered && n === correct;
          const isW = answered && n === selected && n !== correct;
          return (
            <button key={n} type="button" onPointerUp={() => handleAnswer(n)} disabled={answered}
              aria-label={`${n} klanken`}
              className={`py-5 rounded-2xl text-3xl font-extrabold border-[3px] transition-all disabled:cursor-default
                ${isC ? "bg-green-50 border-green-400 text-green-700"
                : isW ? "bg-red-50 border-red-400 text-red-700"
                : "bg-white border-gray-300 text-gray-800 cursor-pointer hover:border-brand-blue"}`}>
              {n}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="flex gap-3">
          <button type="button" onPointerUp={next}
            className="py-3 px-8 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer shadow-md flex items-center gap-2">
            Volgende →
            {countdown > 0 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-brand-blue text-sm font-extrabold tabular-nums">{countdown}</span>}
          </button>
          <button type="button" onPointerUp={onStop} className="py-3 px-5 rounded-full border-2 border-gray-300 bg-white text-gray-600 text-sm font-semibold cursor-pointer">Stop 🏁</button>
        </div>
      )}
    </div>
  );
}
