"use client";

import { useState } from "react";
import { getEarnedBadges, getAllBadgeDefs, type Badge } from "@/lib/mastery";
import { getPlayerId } from "@/lib/playerId";
import { useT } from "@/lib/i18n";

interface Props {
  onBack: () => void;
}

export default function BadgeGallery({ onBack }: Props) {
  const t = useT();
  const [earned] = useState<Badge[]>(
    () => typeof window !== "undefined" ? getEarnedBadges(getPlayerId()) : [],
  );
  const all = getAllBadgeDefs();

  const earnedIds = new Set(earned.map(b => b.id));
  const earnedCount = earned.length;

  return (
    <div className="min-h-dvh bg-level-bg font-sans px-4 py-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 max-w-xl mx-auto">
        <button
          type="button"
          onPointerUp={onBack}
          className="p-2 rounded-xl border-2 border-gray-200 bg-white text-gray-500 text-sm cursor-pointer hover:bg-gray-50"
          aria-label="Terug"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">{t.badges.title}</h1>
          <p className="text-xs text-gray-400">{earnedCount} {t.badges.earned} / {all.length}</p>
        </div>
      </div>

      {/* Voortgangs-balk */}
      <div className="max-w-xl mx-auto mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{earnedCount} {t.badges.earned}</span>
          <span>{all.length - earnedCount} {t.badges.toGo}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-yellow rounded-full transition-all duration-700 [width:var(--p)]"
            style={{ "--p": `${Math.round((earnedCount / all.length) * 100)}%` } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Badge grid */}
      <div className="max-w-xl mx-auto grid grid-cols-2 gap-3 sm:grid-cols-3">
        {all.map(def => {
          const isEarned = earnedIds.has(def.id);
          const earnedBadge = earned.find(b => b.id === def.id);
          return (
            <BadgeCard
              key={def.id}
              emoji={def.emoji}
              name={def.name}
              description={def.description}
              isEarned={isEarned}
              earnedAt={earnedBadge?.earnedAt}
            />
          );
        })}
      </div>
    </div>
  );
}

interface CardProps {
  emoji: string;
  name: string;
  description: string;
  isEarned: boolean;
  earnedAt?: number;
}

function BadgeCard({ emoji, name, description, isEarned, earnedAt }: CardProps) {
  const t = useT();
  const locale = t.locale === "en" ? "en-GB" : "nl-NL";
  const date = earnedAt
    ? new Date(earnedAt).toLocaleDateString(locale, { day: "numeric", month: "short" })
    : null;

  return (
    <div
      className={`rounded-2xl border-2 p-4 flex flex-col items-center text-center gap-2 transition-all ${
        isEarned
          ? "bg-white border-brand-yellow shadow-md"
          : "bg-gray-50 border-gray-200 opacity-60"
      }`}
      aria-label={`${name}${isEarned ? ` — ${earnedAt ? date : ""}` : ""}`}
    >
      {/* Emoji */}
      <div className={`text-4xl ${isEarned ? "animate-pop-in" : "grayscale"}`}>
        {isEarned ? emoji : "🔒"}
      </div>

      {/* Naam */}
      <div className={`font-bold text-sm leading-tight ${isEarned ? "text-gray-800" : "text-gray-400"}`}>
        {name}
      </div>

      {/* Omschrijving */}
      <div className="text-xs text-gray-400 leading-snug">
        {isEarned ? description : t.badges.notYet}
      </div>

      {/* Datum */}
      {isEarned && date && (
        <div className="text-[10px] font-semibold text-brand-blue bg-blue-50 rounded-full px-2 py-0.5">
          {date}
        </div>
      )}
    </div>
  );
}
