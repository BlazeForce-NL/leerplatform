"use client";

import { useEffect, useState, useCallback } from "react";
import LetterBlock from "./LetterBlock";
import { speakPhoneme } from "@/lib/tts";
import { ri } from "@/lib/gameLogic";
import { useAutoAdvance } from "@/hooks/useAutoAdvance";
import { useT } from "@/lib/i18n";

interface Props {
  letterSet: string[];
  allKnownLetters: string[];
  onAnswer: (correct: boolean) => void;
  onStop: () => void;
  autoAdvance?: number; // seconden (0 = uit)
}

interface Round {
  target: string;   // de letter die gehoord/gezien wordt
  choices: string[]; // 4 opties (inclusief target)
}

function makeRound(letterSet: string[], known: string[]): Round {
  const target = letterSet[ri(0, letterSet.length - 1)];
  const pool = [...new Set([...known, ...letterSet])].filter(l => l !== target);
  const distractors: string[] = [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  for (const l of shuffled) {
    if (distractors.length === 3) break;
    distractors.push(l);
  }
  const choices = [target, ...distractors].sort(() => Math.random() - 0.5);
  return { target, choices };
}

export default function LetterHerkenning({ letterSet, allKnownLetters, onAnswer, onStop, autoAdvance = 3 }: Props) {
  const t = useT();
  const [round,    setRound]    = useState<Round>(() => makeRound(letterSet, allKnownLetters));
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");

  const nextRound = useCallback(() => {
    setRound(makeRound(letterSet, allKnownLetters));
    setSelected(null);
    setAnswered(false);
    setFeedback("");
  }, [letterSet, allKnownLetters]);

  const countdown = useAutoAdvance(answered, autoAdvance, nextRound);

  // Auto-play sound on mount and new round
  useEffect(() => {
    const t = setTimeout(() => speakPhoneme(round.target), 400);
    return () => clearTimeout(t);
  }, [round.target]);

  // Keyboard-input (PC): druk de letter-toets om te antwoorden
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
    const correct = letter === round.target;
    setFeedback(correct ? "Super! 🌟" : `Het was de ${round.target.toUpperCase()}`);
    onAnswer(correct);
  }

  const isCorrect = (l: string) => answered && l === round.target;
  const isWrong   = (l: string) => answered && l === selected && l !== round.target;

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-md mx-auto">
      {/* Instructie */}
      <p className="text-sm font-semibold text-gray-500">{t.taal.instructions.letters}</p>

      {/* Luister-knop */}
      <button
        type="button"
        onPointerUp={() => speakPhoneme(round.target)}
        className="w-24 h-24 rounded-full bg-brand-blue border-none text-white text-4xl shadow-lg cursor-pointer active:scale-95 transition-transform"
        aria-label={t.taal.listen}
      >
        🔊
      </button>

      {/* Feedback */}
      <div className={`min-h-7 text-lg font-bold text-center ${answered ? (selected === round.target ? "text-brand-darkgreen" : "text-brand-red") : "text-transparent"}`}>
        {feedback || "‎"}
      </div>

      {/* Antwoord-keuzes: 4 letter-blokken */}
      <div className="grid grid-cols-2 gap-4" role="group" aria-label="Kies de juiste letter">
        {round.choices.map(l => (
          <div key={l} className="flex justify-center">
            <LetterBlock
              letter={l}
              size="lg"
              onClick={answered ? undefined : () => handleAnswer(l)}
              correct={isCorrect(l)}
              wrong={isWrong(l)}
              animate
            />
          </div>
        ))}
      </div>

      {/* Volgende / stop */}
      {answered && (
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onPointerUp={nextRound}
            className="py-3 px-8 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer shadow-md flex items-center gap-2"
          >
            {t.taal.nextWord.replace(" woord", "").replace(" word", "")}
            {countdown > 0 && (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-brand-blue text-sm font-extrabold tabular-nums">
                {countdown}
              </span>
            )}
          </button>
          <button
            type="button"
            onPointerUp={onStop}
            className="py-3 px-5 rounded-full border-2 border-gray-300 bg-white text-gray-600 text-sm font-semibold cursor-pointer"
          >
            {t.general.stop}
          </button>
        </div>
      )}
    </div>
  );
}
