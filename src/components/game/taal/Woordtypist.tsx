"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speakWord, speakPhoneme } from "@/lib/tts";
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

function pickWord(d: 1 | 2 | 3 | 4, exclude?: string): TaalWord {
  const pool = getWordsByDifficulty(d).filter(w => w.id !== exclude);
  return pool[ri(0, pool.length - 1)];
}

const KEYBOARD_ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m","⌫"],
];

export default function Woordtypist({
wordDifficulty, onAnswer, onStop, autoAdvance = 3 }: Props) {
  const t = useT();
  const [word,    setWord]    = useState<TaalWord>(() => pickWord(wordDifficulty));
  const [typed,   setTyped]   = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const next = useCallback(() => {
    setWord(w => pickWord(wordDifficulty, w.id));
    setTyped([]);
    setChecked(false);
    setCorrect(false);
  }, [wordDifficulty]);

  const countdown = useAutoAdvance(checked, autoAdvance, next);

  useEffect(() => {
    const t = setTimeout(() => speakWord(word.word), 350);
    return () => clearTimeout(t);
  }, [word.word]);

  // Fysiek toetsenbord (PC)
  useEffect(() => {
    if (checked) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Backspace") { setTyped(t => t.slice(0, -1)); return; }
      if (e.key === "Enter" && typed.length === word.word.length) { check(); return; }
      const k = e.key.toLowerCase();
      if (/^[a-z]$/.test(k) && typed.length < word.word.length) {
        setTyped(t => { speakPhoneme(k); return [...t, k]; });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, typed, word.word.length]);

  function pressKey(k: string) {
    if (checked) return;
    if (k === "⌫") { setTyped(t => t.slice(0, -1)); return; }
    if (typed.length < word.word.length) {
      speakPhoneme(k);
      setTyped(t => [...t, k]);
    }
  }

  function check() {
    const isCorrect = typed.join("") === word.word;
    setCorrect(isCorrect);
    setChecked(true);
    onAnswer(isCorrect);
    if (isCorrect) speakWord(word.word);
  }

  const letters = word.word.split("");

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-5 max-w-md mx-auto">
      <div className="text-5xl">{word.emoji ?? "📝"}</div>

      <button type="button" onPointerUp={() => speakWord(word.word)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue text-white font-bold text-sm cursor-pointer shadow-md">
        🔊 Luisteren
      </button>

      <p className="text-sm font-semibold text-gray-500">Typ het woord dat je hoort</p>

      {/* Invulvakjes */}
      <div className="flex gap-2 justify-center flex-wrap">
        {letters.map((correctLetter, i) => {
          const typedLetter = typed[i];
          const isFilled   = typedLetter !== undefined;
          const isCorrectL = checked && typedLetter === correctLetter;
          const isWrongL   = checked && typedLetter !== correctLetter;
          const isCurrent  = !checked && i === typed.length;

          return (
            <div key={i}
              className={`w-12 h-14 rounded-xl border-[3px] flex items-center justify-center text-2xl font-extrabold transition-all
                ${isCorrectL ? "border-green-400 bg-green-50 text-green-700"
                : isWrongL   ? "border-red-400 bg-red-50 text-red-700"
                : isCurrent  ? "border-brand-blue bg-blue-50 text-brand-blue animate-pulse"
                : isFilled   ? "border-gray-400 bg-gray-50 text-gray-800"
                : "border-gray-200 bg-white text-gray-200"}`}>
              {checked
                ? (isWrongL
                  ? <><s className="text-red-400 text-lg">{typedLetter ?? "_"}</s><span className="text-green-600 text-sm">{correctLetter}</span></>
                  : typedLetter ?? correctLetter)
                : typedLetter ?? ""}
            </div>
          );
        })}
      </div>

      {/* Schermtoetsenbord */}
      {!checked && (
        <div className="flex flex-col gap-1.5 w-full max-w-sm">
          {KEYBOARD_ROWS.map((row, ri2) => (
            <div key={ri2} className="flex gap-1 justify-center">
              {row.map(k => (
                <button key={k} type="button" onPointerUp={() => pressKey(k)}
                  className={`h-11 rounded-lg font-semibold text-sm cursor-pointer transition-colors active:scale-95
                    ${k === "⌫" ? "bg-red-100 text-red-700 px-3 border border-red-200" : "bg-white border border-gray-300 text-gray-700 w-9 hover:bg-gray-50"}`}>
                  {k}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Controleer / LetterBlocks na antwoord */}
      {!checked ? (
        <button type="button" onPointerUp={check} disabled={typed.length !== letters.length}
          className="py-3 px-8 rounded-full bg-brand-darkgreen border-none text-white text-base font-bold cursor-pointer shadow-md disabled:opacity-40">
          Controleer ✓
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {correct
            ? <div className="text-brand-darkgreen font-bold text-lg">Goed! 🎉</div>
            : (
              <>
                <div className="text-brand-red font-bold">Het woord is:</div>
                <div className="flex gap-1">
                  {letters.map((l, i) => <LetterBlock key={i} letter={l} size="sm" />)}
                </div>
              </>
            )}
          <div className="flex gap-3">
            <button type="button" onPointerUp={next}
              className="py-3 px-8 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer shadow-md flex items-center gap-2">
              Volgende →
              {countdown > 0 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-brand-blue text-sm font-extrabold tabular-nums">{countdown}</span>}
            </button>
            <button type="button" onPointerUp={onStop} className="py-3 px-5 rounded-full border-2 border-gray-300 bg-white text-gray-600 text-sm font-semibold cursor-pointer">{t.general.stop}</button>
          </div>
        </div>
      )}

      {/* Hidden input om mobiel toetsenbord te triggeren op iOS */}
      <input ref={inputRef} type="text" aria-hidden="true" className="sr-only" readOnly />
    </div>
  );
}




