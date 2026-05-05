"use client";

import { useEffect, useState } from "react";
import type { Badge } from "@/lib/mastery";

interface Props {
  badges: Badge[];
  onDone: () => void;
}

export default function BadgeUnlocked({ badges, onDone }: Props) {
  const [idx, setIdx]         = useState(0);
  const [visible, setVisible] = useState(true);

  const badge = badges[idx];

  // Start hide-timer wanneer badge wisselt; setVisible(false) zit in de callback — geen sync setState
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, [idx]);

  // Na fade-out: volgende badge tonen of afsluiten
  useEffect(() => {
    if (visible) return;
    const t = setTimeout(() => {
      if (idx + 1 < badges.length) {
        setVisible(true);   // reset vóór setIdx zodat volgende badge zichtbaar begint
        setIdx(i => i + 1);
      } else {
        onDone();
      }
    }, 350);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!badge) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Badge behaald: ${badge.name}`}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Achtergrond-klik sluit */}
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-pointer"
        aria-label="Sluiten"
        onPointerUp={onDone}
      />

      {/* Card */}
      <div className={`relative z-10 bg-white rounded-3xl shadow-2xl px-8 py-9 mx-4 max-w-sm w-full text-center transition-transform duration-300 ${visible ? "scale-100" : "scale-90"}`}>
        {/* Burst achter emoji */}
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full bg-brand-yellow/20 animate-ping" style={{ animationDuration: "1s" }} />
          <div className="relative text-7xl animate-pop-in">{badge.emoji}</div>
        </div>

        <div className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-1">
          Badge behaald! 🎉
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{badge.name}</h2>
        <p className="text-gray-500 text-sm mb-6">{badge.description}</p>

        {/* Sterren decoratie */}
        <div className="flex justify-center gap-1 mb-6" aria-hidden="true">
          {["⭐", "⭐", "⭐"].map((s, i) => (
            <span
              key={i}
              className="text-2xl animate-pop-in"
              style={{ animationDelay: `${i * 0.12}s` }}
            >{s}</span>
          ))}
        </div>

        <button
          type="button"
          onPointerUp={onDone}
          className="w-full py-3 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer shadow-md"
        >
          {idx + 1 < badges.length ? `Volgende (${idx + 1}/${badges.length}) →` : "Top! Verder spelen 🚀"}
        </button>

        {/* Voortgang bij meerdere badges */}
        {badges.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {badges.map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full ${i <= idx ? "bg-brand-blue" : "bg-gray-200"}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
