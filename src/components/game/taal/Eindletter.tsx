"use client";

import { useCallback, useEffect, useState } from "react";
import { speakWord, speakPhoneme } from "@/lib/tts";
import { getWordsByDifficulty } from "@/content/nl/words";
import { ri } from "@/lib/gameLogic";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import LetterBlock from "./LetterBlock";
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

function makeChoices(correct: string, allLetters: string[]): string[] {
  const others = allLetters.filter(l => l !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
  return [correct, ...others].sort(() => Math.random() - 0.5);
}

const ALL_LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

export default function Eindletter({ wordDifficulty, onAnswer, onStop, autoAdvance = 3 }: Props) {
  const [word,     setWord]     = useState<TaalWord>(() => pickWord(wordDifficulty));
  const [choices,  setChoices]  = useState<string[]>(() => { const w = pickWord(wordDifficulty); return makeChoices(w.word.slice(-1), ALL_LETTERS); });
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const correct = word.word.slice(-1);

  const next = useCallback(() => {
    const w = pickWord(wordDifficulty, word.id);
    setWord(w);
    setChoices(makeChoices(w.word.slice(-1), ALL_LETTERS));
    setSelected(null);
    setAnswered(false);
  }, [wordDifficulty, word.id]);

  const countdown = useAutoAdvance(answered, autoAdvance, next);

  useEffect(() => {
    const t = setTimeout(() => speakWord(word.word), 350);
    return () => clearTimeout(t);
  }, [word.word]);

  useEffect(() => {
    if (answered) return;
    function onKey(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if (choices.includes(k)) handleAnswer(k);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, choices]);

  function handleAnswer(letter: string) {
    if (answered) return;
    setSelected(letter);
    setAnswered(true);
    speakPhoneme(letter);
    onAnswer(letter === correct);
  }

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-md mx-auto">
      <div className="text-5xl">{word.emoji ?? "📝"}</div>

      <button type="button" onPointerUp={() => speakWord(word.word)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue text-white font-bold text-sm cursor-pointer shadow-md">
        🔊 Luisteren
      </button>

      <p className="text-sm font-semibold text-gray-500">Welke letter hoor je als <strong>laatste</strong>?</p>

      {answered && (
        <div className="text-2xl font-extrabold tracking-widest text-gray-700">
          {word.word.split("").map((l, i, arr) => (
            <span key={i} className={i === arr.length - 1 ? "text-brand-blue underline" : ""}>{l}</span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs" role="group" aria-label="Welke laatste letter?">
        {choices.map(l => (
          <div key={l} className="flex justify-center">
            <LetterBlock letter={l} size="lg"
              onClick={answered ? undefined : () => handleAnswer(l)}
              correct={answered && l === correct}
              wrong={answered && l === selected && l !== correct}
            />
          </div>
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
