"use client";

import { useCallback, useEffect, useState } from "react";
import { speakWord } from "@/lib/tts";

import { getWordsByDifficulty } from "@/content/nl/words";
import { ri } from "@/lib/gameLogic";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import { useT } from "@/lib/i18n";

import LetterBlock from "./LetterBlock";
import type { TaalWord } from "@/lib/taalContent";

interface Props {
  wordDifficulty: 1 | 2 | 3 | 4;
  onAnswer: (correct: boolean) => void;
  onStop: () => void;
  autoAdvance?: number;
}

const VOWELS = ["a", "e", "i", "o", "u"];

interface Round {
  word: TaalWord;
  missingIdx: number;   // index in word.word
  missingLetter: string;
  choices: string[];
  isVowelRound: boolean;
}

function makeRound(difficulty: 1 | 2 | 3 | 4, exclude?: string): Round {
  const pool = getWordsByDifficulty(difficulty).filter(w => w.id !== exclude);
  const word  = pool[ri(0, pool.length - 1)];
  const letters = word.word.split("");

  // Kies welke letter weg valt
  let missingIdx: number;
  let isVowelRound: boolean;

  if (difficulty === 1) {
    // Altijd de klinker (midden van MKM)
    const vowelIdxs = letters.map((l, i) => ({ l, i })).filter(x => VOWELS.includes(x.l));
    const pick = vowelIdxs[ri(0, vowelIdxs.length - 1)];
    missingIdx = pick.i;
    isVowelRound = true;
  } else if (difficulty === 2) {
    // Altijd een medeklinker
    const consIdxs = letters.map((l, i) => ({ l, i })).filter(x => !VOWELS.includes(x.l));
    const pick = consIdxs[ri(0, consIdxs.length - 1)];
    missingIdx = pick.i;
    isVowelRound = false;
  } else {
    // Willekeurig
    missingIdx = ri(0, letters.length - 1);
    isVowelRound = VOWELS.includes(letters[missingIdx]);
  }

  const missingLetter = letters[missingIdx];

  // Bouw 4 keuzes
  const pool2 = isVowelRound
    ? VOWELS.filter(v => v !== missingLetter)
    : "bcdfghjklmnprstvwz".split("").filter(c => c !== missingLetter);
  const distractors = [...pool2].sort(() => Math.random() - 0.5).slice(0, 3);
  const choices = [missingLetter, ...distractors].sort(() => Math.random() - 0.5);

  return { word, missingIdx, missingLetter, choices, isVowelRound };
}

export default function MissendeLetter({
wordDifficulty, onAnswer, onStop, autoAdvance = 3 }: Props) {
  const t = useT();
  const [round,    setRound]    = useState<Round>(() => makeRound(wordDifficulty));
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const next = useCallback(() => {
    setRound(r => makeRound(wordDifficulty, r.word.id));
    setSelected(null);
    setAnswered(false);
  }, [wordDifficulty]);

  const countdown = useAutoAdvance(answered, autoAdvance, next);

  // Spreek het woord uit bij elke nieuwe ronde
  useEffect(() => {
    const t = setTimeout(() => speakWord(round.word.word), 350);
    return () => clearTimeout(t);
  }, [round.word.word]);

  // Keyboard input (PC)
  useEffect(() => {
    if (answered) return;
    function onKey(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if (round.choices.includes(k)) handleAnswer(k);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, round.choices]);

  function handleAnswer(letter: string) {
    if (answered) return;
    setSelected(letter);
    setAnswered(true);
    onAnswer(letter === round.missingLetter);
  }

  const letters = round.word.word.split("");

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-md mx-auto">
      <div className="text-5xl">{round.word.emoji ?? "📝"}</div>

      <button type="button" onPointerUp={() => speakWord(round.word.word)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue text-white font-bold text-sm cursor-pointer shadow-md"
        aria-label="Hoor het woord">
        🔊 Hoor het woord
      </button>

      <p className="text-sm font-semibold text-gray-500">
        {round.isVowelRound ? "Welke klinker past hier?" : "Welke medeklinker past hier?"}
      </p>

      {/* Woord met gat */}
      <div className="flex items-center gap-1 flex-wrap justify-center" aria-label={`Woord met missende letter op positie ${round.missingIdx + 1}`}>
        {letters.map((l, i) => (
          i === round.missingIdx
            ? (
              <div key={i}
                className={`w-16 h-16 rounded-2xl border-4 border-dashed flex items-center justify-center text-3xl font-extrabold transition-all
                  ${answered
                    ? selected === round.missingLetter
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-red-400 bg-red-50 text-red-700"
                    : "border-gray-300 bg-gray-50 text-gray-300"}`}
              >
                {answered ? round.missingLetter : "?"}
              </div>
            )
            : <LetterBlock key={i} letter={l} size="md" />
        ))}
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`text-base font-bold ${selected === round.missingLetter ? "text-brand-darkgreen" : "text-brand-red"}`}>
          {selected === round.missingLetter
            ? `Ja! "${round.word.word}" 🎉`
            : `Het is de "${round.missingLetter}": ${round.word.word}`}
        </div>
      )}

      {/* Keuze-letters */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs" role="group" aria-label="Kies de missende letter">
        {round.choices.map(l => {
          const isCorrect = answered && l === round.missingLetter;
          const isWrong   = answered && l === selected && l !== round.missingLetter;
          return (
            <LetterBlock
              key={l}
              letter={l}
              size="lg"
              onClick={answered ? undefined : () => handleAnswer(l)}
              correct={isCorrect}
              wrong={isWrong}
              className="mx-auto"
            />
          );
        })}
      </div>

      {answered && (
        <div className="flex gap-3">
          <button type="button" onPointerUp={next}
            className="py-3 px-8 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer shadow-md flex items-center gap-2">
            Volgende →
            {countdown > 0 && (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-brand-blue text-sm font-extrabold tabular-nums">
                {countdown}
              </span>
            )}
          </button>
          <button type="button" onPointerUp={onStop}
            className="py-3 px-5 rounded-full border-2 border-gray-300 bg-white text-gray-600 text-sm font-semibold cursor-pointer">
            Stop 🏁
          </button>
        </div>
      )}
    </div>
  );
}




