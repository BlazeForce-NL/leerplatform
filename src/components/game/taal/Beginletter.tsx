"use client";

import { useCallback, useEffect, useState } from "react";
import { speakPhoneme, speakWord } from "@/lib/tts";
import { NL_WORDS } from "@/content/nl/words";
import { ri } from "@/lib/gameLogic";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import type { TaalWord } from "@/lib/taalContent";

interface Props {
  onAnswer: (correct: boolean) => void;
  onStop: () => void;
  autoAdvance?: number;
}

interface Round {
  targetLetter: string;
  choices: TaalWord[];   // 4 woorden, één begint met targetLetter
  correctIdx: number;
}

const KNOWN_WORDS = NL_WORDS.filter(w => w.emoji);

function makeRound(exclude?: string): Round {
  const targetWord = KNOWN_WORDS.filter(w => w.id !== exclude)[ri(0, KNOWN_WORDS.length - 1)];
  const targetLetter = targetWord.word[0];

  // 3 distractors die NIET beginnen met targetLetter
  const distractors = KNOWN_WORDS
    .filter(w => !w.word.startsWith(targetLetter) && w.id !== targetWord.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const all = [...distractors, targetWord].sort(() => Math.random() - 0.5);
  const correctIdx = all.findIndex(w => w.id === targetWord.id);

  return { targetLetter, choices: all, correctIdx };
}

export default function Beginletter({ onAnswer, onStop, autoAdvance = 3 }: Props) {
  const [round,    setRound]    = useState<Round>(() => makeRound());
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const next = useCallback(() => {
    setRound(r => makeRound(r.choices[r.correctIdx].id));
    setSelected(null);
    setAnswered(false);
  }, []);

  const countdown = useAutoAdvance(answered, autoAdvance, next);

  useEffect(() => {
    const t = setTimeout(() => speakPhoneme(round.targetLetter), 350);
    return () => clearTimeout(t);
  }, [round.targetLetter]);

  function handleAnswer(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    speakWord(round.choices[idx].word);
    onAnswer(idx === round.correctIdx);
  }

  const isCorrect = (i: number) => answered && i === round.correctIdx;
  const isWrong   = (i: number) => answered && i === selected && i !== round.correctIdx;

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-md mx-auto">
      <p className="text-sm font-semibold text-gray-500">Welk woord begint met deze letter?</p>

      {/* Luister-knop voor de doelletter */}
      <button type="button" onPointerUp={() => speakPhoneme(round.targetLetter)}
        className="w-24 h-24 rounded-full bg-brand-blue border-none text-white text-4xl shadow-lg cursor-pointer active:scale-95 transition-transform"
        aria-label={`Speel klank opnieuw`}>
        🔊
      </button>

      {/* 4 woord-opties met emoji */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm" role="group" aria-label="Welk woord begint met de klank?">
        {round.choices.map((word, i) => (
          <button key={word.id} type="button" onPointerUp={() => handleAnswer(i)} disabled={answered}
            aria-label={`${word.emoji} ${word.word}`}
            className={`p-4 rounded-2xl border-[3px] flex flex-col items-center gap-2 cursor-pointer transition-all disabled:cursor-default
              ${isCorrect(i) ? "bg-green-50 border-green-400" : isWrong(i) ? "bg-red-50 border-red-400" : "bg-white border-gray-300 hover:border-brand-blue"}`}>
            <span className="text-4xl">{word.emoji}</span>
            {answered && (
              <span className={`text-sm font-bold ${isCorrect(i) ? "text-green-700" : isWrong(i) ? "text-red-700" : "text-gray-500"}`}>
                {word.word}
              </span>
            )}
          </button>
        ))}
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
