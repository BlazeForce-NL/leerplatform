"use client";

import { useCallback, useEffect, useState } from "react";
import { speakWord } from "@/lib/tts";

import { RHYME_GROUPS } from "@/content/nl/rhymes";
import { ri } from "@/lib/gameLogic";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import { useT } from "@/lib/i18n";


interface Props {
  onAnswer: (correct: boolean) => void;
  onStop: () => void;
  autoAdvance?: number;
}

interface Round {
  target: string;
  correct: string;
  choices: string[];
}

function makeRound(excludeTarget?: string): Round {
  const group = RHYME_GROUPS.filter(g => g.length >= 4 && !g.includes(excludeTarget ?? ""))[ri(0, RHYME_GROUPS.length - 1)];
  const shuffled = [...group].sort(() => Math.random() - 0.5);
  const target  = shuffled[0];
  const correct = shuffled[1];

  // 3 distractors van andere groepen (rijmen NIET)
  const others = RHYME_GROUPS.flatMap(g => (g === group ? [] : g))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const choices = [correct, ...others].sort(() => Math.random() - 0.5);
  return { target, correct, choices };
}

export default function Rijmwoord({
onAnswer, onStop, autoAdvance = 3 }: Props) {
  const t = useT();
  const [round,    setRound]    = useState<Round>(() => makeRound());
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const next = useCallback(() => {
    setRound(r => makeRound(r.target));
    setSelected(null);
    setAnswered(false);
  }, []);

  const countdown = useAutoAdvance(answered, autoAdvance, next);

  useEffect(() => {
    const t = setTimeout(() => speakWord(round.target), 350);
    return () => clearTimeout(t);
  }, [round.target]);

  function handleAnswer(word: string) {
    if (answered) return;
    setSelected(word);
    setAnswered(true);
    speakWord(word);
    onAnswer(word === round.correct);
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-md mx-auto">
      <p className="text-sm font-semibold text-gray-500">Welk woord rijmt op…</p>

      <button type="button" onPointerUp={() => speakWord(round.target)}
        className="px-8 py-4 rounded-2xl bg-brand-purple text-white text-2xl font-extrabold shadow-lg cursor-pointer hover:brightness-110">
        {round.target} 🔊
      </button>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm" role="group" aria-label="Rijmwoord kiezen">
        {round.choices.map(w => {
          const isC = answered && w === round.correct;
          const isW = answered && w === selected && w !== round.correct;
          return (
            <button key={w} type="button" onPointerUp={() => handleAnswer(w)} disabled={answered}
              aria-label={w}
              className={`py-4 rounded-2xl border-[3px] text-xl font-bold transition-all disabled:cursor-default cursor-pointer
                ${isC ? "bg-green-50 border-green-400 text-green-700"
                : isW ? "bg-red-50 border-red-400 text-red-700"
                : "bg-white border-gray-300 text-gray-800 hover:border-brand-purple"}`}>
              {w}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`text-base font-bold ${selected === round.correct ? "text-brand-darkgreen" : "text-brand-red"}`}>
          {selected === round.correct ? `✅ "${round.target}" rijmt op "${round.correct}"!` : `❌ Nee, "${round.correct}" rijmt op "${round.target}"`}
        </div>
      )}

      {answered && (
        <div className="flex gap-3">
          <button type="button" onPointerUp={next}
            className="py-3 px-8 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer shadow-md flex items-center gap-2">
            Volgende →
            {countdown > 0 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-brand-blue text-sm font-extrabold tabular-nums">{countdown}</span>}
          </button>
          <button type="button" onPointerUp={onStop} className="py-3 px-5 rounded-full border-2 border-gray-300 bg-white text-gray-600 text-sm font-semibold cursor-pointer">{t.general.stop}</button>
        </div>
      )}
    </div>
  );
}




