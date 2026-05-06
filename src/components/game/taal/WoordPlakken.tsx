"use client";

import { useEffect, useState, useCallback } from "react";
import LetterBlock from "./LetterBlock";
import { speakWord, speakSegment } from "@/lib/tts";

import { getWordsByDifficulty } from "@/content/nl/words";
import { ri } from "@/lib/gameLogic";
import type { TaalWord } from "@/lib/taalContent";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import { useT } from "@/lib/i18n";


interface Props {
  wordDifficulty: 1 | 2 | 3 | 4;
  onAnswer: (correct: boolean) => void;
  onStop: () => void;
  autoAdvance?: number;
}

function pickWord(difficulty: 1 | 2 | 3 | 4, exclude?: string): TaalWord {
  const pool = getWordsByDifficulty(difficulty).filter(w => w.id !== exclude);
  return pool[ri(0, pool.length - 1)];
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Outer: beheert welk woord actief is ──────────────────────────────────────

export default function WoordPlakken({
wordDifficulty, onAnswer, onStop, autoAdvance = 3 }: Props) {
  const t = useT();
  const [word, setWord] = useState<TaalWord>(() => pickWord(wordDifficulty));

  const nextWord = useCallback(() => {
    setWord(w => pickWord(wordDifficulty, w.id));
  }, [wordDifficulty]);

  return (
    <PlakkenRound
      key={word.id}
      word={word}
      autoAdvance={autoAdvance}
      onAnswer={onAnswer}
      onNext={nextWord}
      onStop={onStop}
    />
  );
}

// ── Inner: game-state per woord (remount = reset) ─────────────────────────────

interface RoundProps {
  word: TaalWord;
  autoAdvance: number;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  onStop: () => void;
}

function PlakkenRound({ word, autoAdvance, onAnswer, onNext, onStop }: RoundProps) {
  const t = useT();
  const [bank,    setBank]    = useState<string[]>(() => shuffle([...word.segments]));
  const [placed,  setPlaced]  = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  const countdown = useAutoAdvance(checked, autoAdvance, onNext);

  useEffect(() => {
    const t = setTimeout(() => speakWord(word.word), 300);
    return () => clearTimeout(t);
  }, [word.word]);

  function pickSegment(seg: string, bankIdx: number) {
    if (checked) return;
    setBank(b => b.filter((_, i) => i !== bankIdx));
    setPlaced(p => [...p, seg]);
    speakSegment(seg);
  }

  function removeSegment(placedIdx: number) {
    if (checked) return;
    const seg = placed[placedIdx];
    setPlaced(p => p.filter((_, i) => i !== placedIdx));
    setBank(b => [...b, seg]);
  }

  function checkAnswer() {
    const isCorrect = placed.join("") === word.word;
    setCorrect(isCorrect);
    setChecked(true);
    onAnswer(isCorrect);
    if (isCorrect) speakWord(word.word);
  }

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-lg mx-auto">
      {/* Emoji + luisterknop */}
      <div className="text-6xl">{word.emoji ?? "📝"}</div>
      <button
        type="button"
        onPointerUp={() => speakWord(word.word)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue text-white font-bold text-sm cursor-pointer shadow-md"
        aria-label="Hoor het woord"
      >
        🔊 Luisteren
      </button>

      <p className="text-sm font-semibold text-gray-500">
        Plak de klanken in de juiste volgorde
      </p>

      {/* Plaatsingsrij */}
      <div
        className={`min-h-[72px] w-full max-w-sm flex items-center justify-center gap-2 flex-wrap
          rounded-2xl border-2 border-dashed p-3 transition-colors
          ${checked ? (correct ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50") : "border-gray-300 bg-gray-50"}`}
        aria-label="Geplaatste klanken"
      >
        {placed.length === 0 && (
          <span className="text-gray-300 text-sm">Tik een klank hieronder om te plaatsen</span>
        )}
        {placed.map((seg, i) => (
          <button
            key={`${seg}-${i}`}
            type="button"
            onPointerUp={() => removeSegment(i)}
            disabled={checked}
            aria-label={`Klank ${seg} — tik om te verwijderen`}
            className="px-3 py-2 rounded-xl bg-white border-2 border-brand-blue font-bold text-brand-blue text-lg cursor-pointer hover:bg-blue-50 disabled:cursor-default shadow-sm"
          >
            {seg}
          </button>
        ))}
      </div>

      {/* Letter-bank */}
      <div className="flex gap-3 flex-wrap justify-center" role="group" aria-label="Beschikbare klanken">
        {bank.map((seg, i) => (
          <button
            key={`${seg}-${i}`}
            type="button"
            onPointerUp={() => pickSegment(seg, i)}
            disabled={checked}
            aria-label={`Klank ${seg}`}
            className="px-4 py-3 rounded-2xl bg-white border-2 border-gray-300 font-bold text-gray-800 text-xl cursor-pointer hover:border-brand-blue hover:bg-blue-50 disabled:cursor-default shadow-sm transition-all"
          >
            {seg}
          </button>
        ))}
        {bank.length === 0 && !checked && (
          <span className="text-gray-400 text-sm italic">Alle klanken geplaatst</span>
        )}
      </div>

      {/* Letter-preview — alleen tonen NADAT gecheckt is (geen spoiler) */}
      {checked && (
        <div className="flex gap-1 flex-wrap justify-center" aria-hidden="true">
          {word.word.split("").map((l, i) => (
            <LetterBlock key={i} letter={l} size="sm" />
          ))}
        </div>
      )}

      {/* Acties */}
      {!checked ? (
        <button
          type="button"
          onPointerUp={checkAnswer}
          disabled={bank.length > 0}
          className="py-3 px-8 rounded-full bg-brand-darkgreen border-none text-white text-base font-bold cursor-pointer shadow-md disabled:opacity-40"
        >
          Controleer ✓
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className={`text-lg font-bold ${correct ? "text-brand-darkgreen" : "text-brand-red"}`}>
            {correct ? `Ja! "${word.word}" — goed geplakt! 🎉` : `Het woord is "${word.word}"`}
          </div>
          <div className="flex gap-3">
            <button type="button" onPointerUp={onNext}
              className="py-3 px-8 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer shadow-md flex items-center gap-2">
              {t.taal.nextWord}
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
        </div>
      )}
    </div>
  );
}




