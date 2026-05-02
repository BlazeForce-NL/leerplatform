"use client";

import { useEffect, useRef, useState } from "react";
import { ScoreEntry, catLabel } from "@/lib/gameLogic";

const MEDALS = ["🥇", "🥈", "🥉"];
const HEADING_ID = "scoreboard-heading";

function entryClass(i: number): string {
  if (i === 0) return "bg-amber-50 border-amber-300";
  if (i === 1) return "bg-gray-100 border-gray-300";
  if (i === 2) return "bg-orange-50 border-orange-300";
  return "bg-gray-50 border-gray-200";
}

interface Props {
  allScores: Record<string, ScoreEntry[]>;
  onClose: () => void;
}

export default function Scoreboard({ allScores, onClose }: Props) {
  const cats = Object.keys(allScores).sort();
  const [cat, setCat] = useState(cats[0] ?? "");
  const entries = (allScores[cat] ?? []).slice().sort((a, b) => b.score - a.score).slice(0, 10);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap + Escape key
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/55 z-[1000] flex items-center justify-center p-3"
      role="dialog"
      aria-modal="true"
      aria-labelledby={HEADING_ID}
    >
      <div ref={modalRef} className="bg-white rounded-3xl px-4 py-5 w-full max-w-[440px] max-h-[80vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-3.5">
          <div id={HEADING_ID} className="text-xl font-bold">🏆 Highscores</div>
          <button type="button"
            onPointerUp={onClose}
            className="border-none bg-transparent text-[22px] cursor-pointer text-gray-400 hover:text-gray-700 min-h-touch min-w-[44px]"
            aria-label="Scorebord sluiten"
          >✕</button>
        </div>

        {cats.length === 0 && (
          <div className="text-gray-400 text-center py-5">Nog geen scores opgeslagen.</div>
        )}

        {cats.length > 0 && (
          <>
            <div role="group" aria-label="Categorie kiezen" className="flex flex-wrap gap-1.5 mb-3">
              {cats.map(c => (
                <button type="button"
                  key={c}
                  onPointerUp={() => setCat(c)}
                  aria-pressed={cat === c ? "true" : "false"}
                  className={`px-3 py-1 min-h-touch rounded-2xl border-2 font-semibold text-xs cursor-pointer transition-colors ${
                    cat === c
                      ? "border-brand-blue bg-brand-blue text-white"
                      : "border-gray-300 bg-white text-gray-600"
                  }`}
                >
                  {catLabel(c)}
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-gray-500 mb-2" aria-live="polite">{catLabel(cat)}</div>

            {entries.length === 0 && (
              <div className="text-gray-400 text-sm">Nog geen scores.</div>
            )}

            <ol aria-label={`Scores voor ${catLabel(cat)}`}>
              {entries.map((e, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl border mb-1.5 ${entryClass(i)}`}
                >
                  <span className="text-xl w-7 text-center" aria-label={MEDALS[i] ? ["Goud","Zilver","Brons"][i] : `Positie ${i + 1}`}>
                    {MEDALS[i] ?? `${i + 1}`}
                  </span>
                  <div className="flex-1">
                    <div className="font-bold text-[15px]">{e.player}</div>
                    <div className="text-[11px] text-gray-500">{e.correct}/{e.total} goed · {e.date}</div>
                  </div>
                  <div className="text-[22px] font-extrabold text-brand-blue" aria-label={`${e.score} punten`}>{e.score}</div>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
