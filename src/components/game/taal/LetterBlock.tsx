"use client";

import { getLetterColor } from "@/lib/letterColors";

interface Props {
  letter: string;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  selected?: boolean;
  correct?: boolean;
  wrong?: boolean;
  animate?: boolean;
  className?: string;
}

const SIZES = {
  sm: { block: "w-10 h-10 text-xl rounded-xl border-[3px]",   face: "text-[8px]" },
  md: { block: "w-16 h-16 text-3xl rounded-2xl border-[3px]", face: "text-[10px]" },
  lg: { block: "w-20 h-20 text-4xl rounded-2xl border-4",     face: "text-xs" },
  xl: { block: "w-28 h-28 text-6xl rounded-3xl border-4",     face: "text-sm" },
};

export default function LetterBlock({
  letter, size = "md", onClick, selected, correct, wrong, animate, className = "",
}: Props) {
  const color  = getLetterColor(letter);
  const sz     = SIZES[size];
  const isVowel = "aeiou".includes(letter.toLowerCase());

  let ringClass = "";
  if (correct)  ringClass = "ring-4 ring-green-400";
  else if (wrong)    ringClass = "ring-4 ring-red-400";
  else if (selected) ringClass = "ring-4 ring-white/70";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-label={`Letter ${letter.toUpperCase()}`}
      className={`
        relative flex flex-col items-center justify-center select-none
        font-extrabold shadow-lg transition-transform
        ${sz.block} ${ringClass}
        ${onClick ? "cursor-pointer active:scale-95 hover:brightness-110" : "cursor-default"}
        ${animate ? "animate-pop-in" : ""}
        ${className}
      `}
      style={{
        backgroundColor: color.bg,
        color: color.text,
        borderColor: color.border,
        borderStyle: "solid",
      }}
    >
      {/* Gezichtje bovenin */}
      <span className={`absolute top-1 leading-none ${sz.face}`} aria-hidden="true">
        {isVowel ? "😊" : "🙂"}
      </span>
      {/* De letter zelf */}
      <span className="mt-2">{letter.toLowerCase()}</span>
    </button>
  );
}
