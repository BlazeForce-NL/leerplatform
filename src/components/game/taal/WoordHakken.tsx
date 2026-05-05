"use client";

import { useEffect, useState, useCallback } from "react";
import LetterBlock from "./LetterBlock";
import { speakWord, speakSegment } from "@/lib/tts";
import { getWordsByDifficulty } from "@/content/nl/words";
import { ri } from "@/lib/gameLogic";
import type { TaalWord } from "@/lib/taalContent";

interface Props {
  wordDifficulty: 1 | 2 | 3 | 4;
  onAnswer: (correct: boolean) => void;
  onStop: () => void;
}

type Phase = "listen" | "hak" | "done";

function pickWord(difficulty: 1 | 2 | 3 | 4, exclude?: string): TaalWord {
  const pool = getWordsByDifficulty(difficulty).filter(w => w.id !== exclude);
  return pool[ri(0, pool.length - 1)];
}

export default function WoordHakken({ wordDifficulty, onAnswer, onStop }: Props) {
  const [word,    setWord]    = useState<TaalWord>(() => pickWord(wordDifficulty));
  const [phase,   setPhase]   = useState<Phase>("listen");
  const [cuts,    setCuts]    = useState<Set<number>>(new Set()); // indices AFTER which a cut exists
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => speakWord(word.word), 300);
    return () => clearTimeout(t);
  }, [word.word]);

  const nextWord = useCallback(() => {
    const next = pickWord(wordDifficulty, word.id);
    setWord(next);
    setPhase("listen");
    setCuts(new Set());
    setChecked(false);
    setCorrect(false);
  }, [wordDifficulty, word.id]);

  function toggleCut(afterIdx: number) {
    if (phase !== "hak" || checked) return;
    setCuts(prev => {
      const next = new Set(prev);
      if (next.has(afterIdx)) next.delete(afterIdx);
      else next.add(afterIdx);
      return next;
    });
  }

  function checkAnswer() {
    // Correcte snijpunten: na elk segment behalve het laatste
    let pos = 0;
    const correctCuts = new Set<number>();
    for (let i = 0; i < word.segments.length - 1; i++) {
      pos += word.segments[i].length;
      correctCuts.add(pos - 1);
    }
    const isCorrect = [...correctCuts].every(c => cuts.has(c)) && cuts.size === correctCuts.size;
    setCorrect(isCorrect);
    setChecked(true);
    onAnswer(isCorrect);
  }

  const letters = word.word.split("");

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-lg mx-auto">
      {/* Emoji + woord */}
      <div className="text-6xl">{word.emoji ?? "📝"}</div>

      {/* Luister-knop */}
      <button
        type="button"
        onPointerUp={() => speakWord(word.word)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue text-white font-bold text-sm cursor-pointer shadow-md"
        aria-label="Hoor het woord"
      >
        🔊 Luisteren
      </button>

      {phase === "listen" && (
        <button
          type="button"
          onPointerUp={() => setPhase("hak")}
          className="py-3 px-8 rounded-full bg-brand-orange border-none text-white text-base font-bold cursor-pointer shadow-md"
        >
          Hakken! ✂️
        </button>
      )}

      {phase === "hak" && (
        <>
          <p className="text-sm font-semibold text-gray-500">
            Tik tussen de letters om het woord te hakken
          </p>

          {/* Letterrij met snijpunten */}
          <div className="flex items-center gap-0 flex-wrap justify-center">
            {letters.map((letter, i) => {
              const hasCut = cuts.has(i);
              return (
                <div key={i} className="flex items-center">
                  <LetterBlock
                    letter={letter}
                    size="md"
                    onClick={() => speakSegment(letter)}
                  />
                  {i < letters.length - 1 && (
                    <button
                      type="button"
                      onPointerUp={() => toggleCut(i)}
                      aria-label={hasCut ? "Snijpunt verwijderen" : "Hier hakken"}
                      className={`w-7 h-14 flex items-center justify-center text-xl font-black transition-all cursor-pointer rounded-sm
                        ${hasCut ? "text-brand-red bg-red-50" : "text-gray-200 hover:text-gray-400"}`}
                    >
                      {hasCut ? "✂️" : "│"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hak-resultaat preview */}
          {cuts.size > 0 && (
            <div className="flex gap-2 flex-wrap justify-center text-sm text-gray-500">
              {(() => {
                const parts: string[] = [];
                let current = "";
                letters.forEach((l, i) => {
                  current += l;
                  if (cuts.has(i) || i === letters.length - 1) {
                    parts.push(current);
                    current = "";
                  }
                });
                return parts.map((p, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-gray-100 font-semibold">{p}</span>
                ));
              })()}
            </div>
          )}

          {!checked ? (
            <button
              type="button"
              onPointerUp={checkAnswer}
              disabled={cuts.size === 0}
              className="py-3 px-8 rounded-full bg-brand-darkgreen border-none text-white text-base font-bold cursor-pointer shadow-md disabled:opacity-40"
            >
              Controleer ✓
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className={`text-lg font-bold ${correct ? "text-brand-darkgreen" : "text-brand-red"}`}>
                {correct ? "Goed gedaan! 🎉" : `Niet helemaal. Het zijn: ${word.segments.join(" — ")}`}
              </div>
              {/* Toon correcte segmenten als klank-knoppen */}
              <div className="flex gap-2 flex-wrap justify-center">
                {word.segments.map((seg, i) => (
                  <button
                    key={i}
                    type="button"
                    onPointerUp={() => speakSegment(seg)}
                    className="px-3 py-2 rounded-xl bg-gray-100 border-2 border-gray-300 font-bold text-gray-700 cursor-pointer hover:bg-gray-200"
                    aria-label={`Klank ${seg}`}
                  >
                    {seg} 🔊
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="button" onPointerUp={nextWord}
                  className="py-3 px-8 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer shadow-md">
                  Volgend woord →
                </button>
                <button type="button" onPointerUp={onStop}
                  className="py-3 px-5 rounded-full border-2 border-gray-300 bg-white text-gray-600 text-sm font-semibold cursor-pointer">
                  Stop 🏁
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
