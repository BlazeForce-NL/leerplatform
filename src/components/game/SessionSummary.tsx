"use client";

import { useT } from "@/lib/i18n";

interface Props {
  player: string;
  score: number;
  correct: number;
  total: number;
  isNewHigh: boolean;
  onPlay: () => void;
  onBoard: () => void;
}

export default function SessionSummary({ player, score, correct, total, isNewHigh, onPlay, onBoard }: Props) {
  const t = useT();
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const emoji = pct >= 90 ? "🌟" : pct >= 70 ? "😄" : pct >= 50 ? "🙂" : "💪";

  return (
    <div className="text-center py-8 px-2.5">
      <div className="text-5xl mb-2">{emoji}</div>
      {isNewHigh && (
        <div className="text-base font-bold text-amber-500 mb-2">{t.summary.newHigh} {player}!</div>
      )}
      <div className="text-[28px] font-extrabold text-brand-blue mb-1">{score} {t.game.points}</div>
      <div className="text-sm text-gray-500 mb-5">{correct} {t.summary.of} {total} {t.summary.correct} ({pct}%)</div>
      <div className="flex gap-2.5 justify-center flex-wrap">
        <button type="button" onPointerUp={onPlay} className="py-3 px-7 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer">
          {t.summary.play}
        </button>
        <button type="button" onPointerUp={onBoard} className="py-3 px-7 rounded-full bg-brand-yellow border-none text-gray-800 text-base font-bold cursor-pointer">
          {t.summary.leaderboard} 🏆
        </button>
      </div>
    </div>
  );
}
