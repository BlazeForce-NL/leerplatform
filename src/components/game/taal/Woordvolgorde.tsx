"use client";

import { useCallback, useEffect, useState } from "react";
import { speakWord } from "@/lib/tts";
import { ZINNEN } from "@/content/nl/sentences";
import { ri } from "@/lib/gameLogic";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import type { Zin } from "@/content/nl/sentences";

interface Props {
  onAnswer: (correct: boolean) => void;
  onStop: () => void;
  autoAdvance?: number;
}

export default function Woordvolgorde({ onAnswer, onStop, autoAdvance = 3 }: Props) {
  const [zin,     setZin]     = useState<Zin>(() => ZINNEN[ri(0, ZINNEN.length - 1)]);
  const [bank,    setBank]    = useState<string[]>(() => [...ZINNEN[ri(0, ZINNEN.length - 1)].words].sort(() => Math.random() - 0.5));
  const [placed,  setPlaced]  = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  const reset = useCallback((z: Zin) => {
    setZin(z);
    setBank([...z.words].sort(() => Math.random() - 0.5));
    setPlaced([]);
    setChecked(false);
    setCorrect(false);
  }, []);

  const next = useCallback(() => {
    const available = ZINNEN.filter(z => z.emoji !== zin.emoji);
    reset(available[ri(0, available.length - 1)]);
  }, [zin.emoji, reset]);

  const countdown = useAutoAdvance(checked, autoAdvance, next);

  useEffect(() => {
    const t = setTimeout(() => zin.words.forEach((w, i) => setTimeout(() => speakWord(w), i * 400)), 400);
    return () => clearTimeout(t);
  }, [zin]);

  function pickWord(bankIdx: number) {
    if (checked) return;
    const w = bank[bankIdx];
    setBank(b => b.filter((_, i) => i !== bankIdx));
    setPlaced(p => [...p, w]);
  }

  function removeWord(placedIdx: number) {
    if (checked) return;
    const w = placed[placedIdx];
    setPlaced(p => p.filter((_, i) => i !== placedIdx));
    setBank(b => [...b, w]);
  }

  function check() {
    const isCorrect = placed.join(" ") === zin.words.join(" ");
    setCorrect(isCorrect);
    setChecked(true);
    onAnswer(isCorrect);
    if (isCorrect) zin.words.forEach((w, i) => setTimeout(() => speakWord(w), i * 350));
  }

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-md mx-auto">
      <div className="text-5xl">{zin.emoji}</div>
      <p className="text-sm font-semibold text-gray-500">Zet de woorden in de goede volgorde</p>

      {/* Plaatsingsrij */}
      <div className={`min-h-[60px] w-full max-w-sm flex items-center gap-2 flex-wrap justify-center
        rounded-2xl border-2 border-dashed p-3 transition-colors
        ${checked ? (correct ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50") : "border-gray-300 bg-gray-50"}`}>
        {placed.length === 0 && <span className="text-gray-300 text-sm">Tik een woord hieronder</span>}
        {placed.map((w, i) => (
          <button key={`${w}-${i}`} type="button" onPointerUp={() => removeWord(i)} disabled={checked}
            className="px-3 py-1.5 rounded-xl bg-white border-2 border-brand-blue text-brand-blue font-bold text-base cursor-pointer hover:bg-blue-50 disabled:cursor-default">
            {w}
          </button>
        ))}
      </div>

      {/* Woordbank */}
      <div className="flex gap-2 flex-wrap justify-center">
        {bank.map((w, i) => (
          <button key={`${w}-${i}`} type="button" onPointerUp={() => pickWord(i)} disabled={checked}
            className="px-3 py-2 rounded-xl bg-white border-2 border-gray-300 font-semibold text-gray-700 text-base cursor-pointer hover:border-brand-blue disabled:cursor-default">
            {w}
          </button>
        ))}
      </div>

      {/* Correcte zin als feedback */}
      {checked && !correct && (
        <div className="text-center text-sm text-gray-600">
          <span className="font-semibold text-brand-darkgreen">{zin.words.join(" ")}</span>
        </div>
      )}

      {!checked ? (
        <button type="button" onPointerUp={check} disabled={bank.length > 0}
          className="py-3 px-8 rounded-full bg-brand-darkgreen border-none text-white text-base font-bold cursor-pointer shadow-md disabled:opacity-40">
          Controleer ✓
        </button>
      ) : (
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
