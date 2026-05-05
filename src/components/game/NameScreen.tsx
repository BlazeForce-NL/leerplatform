"use client";

import { useState } from "react";
import { ANON } from "@/lib/gameLogic";
import { useT } from "@/lib/i18n";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function NameScreen({ onStart, onLevels }: { onStart: (name: string) => void; onLevels?: () => void }) {
  const [name, setName] = useState("");
  const t = useT();

  function go(n: string) { onStart(n.trim() || ANON); }

  return (
    <div className="text-center py-8 px-5 relative">
      {/* Taalwisselaar */}
      <div className="absolute top-4 right-4">
        <LocaleSwitcher compact />
      </div>

      <div className="text-5xl mb-2" aria-hidden="true">🎮</div>
      <h1 className="text-2xl font-bold mb-1">{t.name.title}</h1>
      <p className="text-base text-gray-500 mb-6">{t.name.subtitle}</p>

      <form onSubmit={e => { e.preventDefault(); go(name); }} noValidate>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={t.name.placeholder}
          maxLength={20}
          aria-label={t.name.subtitle}
          className="text-xl py-2.5 px-4 rounded-2xl border-2 border-gray-300 w-full max-w-[280px] text-center mb-5 block mx-auto focus-visible:border-brand-blue transition-colors outline-none"
        />
        <div className="flex gap-2.5 justify-center flex-wrap">
          <button
            type="submit"
            className="py-3 px-7 min-h-touch rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer"
          >
            {name.trim() ? `${t.name.playAs} ${name.trim()}` : t.name.play}
          </button>
          <button
            type="button"
            onPointerUp={() => go("")}
            className="py-3 px-5 min-h-touch rounded-full bg-gray-100 border-none text-gray-600 text-[15px] font-semibold cursor-pointer"
          >
            {t.name.anonymous}
          </button>
        </div>
      </form>

      {onLevels && (
        <button
          type="button"
          onPointerUp={onLevels}
          className="mt-5 text-sm text-blue-600 underline cursor-pointer"
        >
          {t.name.levelMap}
        </button>
      )}
    </div>
  );
}
