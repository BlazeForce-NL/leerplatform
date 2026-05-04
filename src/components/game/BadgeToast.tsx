"use client";

import { useEffect, useState } from "react";
import type { Badge } from "@/lib/mastery";

interface Props {
  badges: Badge[];
  onDone: () => void;
}

export default function BadgeToast({ badges, onDone }: Props) {
  const [idx, setIdx] = useState(0);
  const badge = badges[idx];

  useEffect(() => {
    if (!badge) { onDone(); return; }
    const t = setTimeout(() => {
      if (idx + 1 < badges.length) setIdx(i => i + 1);
      else onDone();
    }, 2800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, badge]);

  if (!badge) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-pop-in"
    >
      <div className="bg-white rounded-2xl shadow-xl border-2 border-brand-yellow px-5 py-4 flex items-center gap-3 max-w-xs">
        <span className="text-4xl">{badge.emoji}</span>
        <div>
          <div className="font-bold text-gray-800 text-sm">Badge behaald!</div>
          <div className="font-extrabold text-brand-blue">{badge.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{badge.description}</div>
        </div>
      </div>
    </div>
  );
}
