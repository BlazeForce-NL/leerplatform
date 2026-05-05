"use client";

import { useLocale } from "@/lib/i18n";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/types";

interface Props {
  compact?: boolean; // vlaggen-only (voor in header), uitgebreid (voor in settings)
}

export default function LocaleSwitcher({ compact = false }: Props) {
  const { locale, setLocale } = useLocale();

  if (compact) {
    // Kleine vlag-knoppen voor in de header/settings
    return (
      <div className="flex gap-1" role="group" aria-label="Taal kiezen">
        {LOCALES.map(l => (
          <button
            key={l}
            type="button"
            onPointerUp={() => setLocale(l)}
            aria-pressed={locale === l}
            aria-label={LOCALE_LABELS[l]}
            title={LOCALE_LABELS[l]}
            className={`w-8 h-8 rounded-lg text-base cursor-pointer transition-all border-2
              ${locale === l
                ? "border-brand-blue bg-blue-50"
                : "border-gray-200 bg-white hover:bg-gray-50"}`}
          >
            {l === "nl" ? "🇳🇱" : "🇬🇧"}
          </button>
        ))}
      </div>
    );
  }

  // Volledige selector voor in de instellingen-sidebar
  return (
    <div>
      <div className="text-xs font-semibold text-gray-400 mb-1.5">
        {locale === "nl" ? "Taal" : "Language"}
      </div>
      <div className="flex gap-1.5" role="group" aria-label="Taal kiezen">
        {LOCALES.map(l => (
          <button
            key={l}
            type="button"
            onPointerUp={() => setLocale(l)}
            aria-pressed={locale === l}
            className={`px-3 py-1.5 rounded-full border-2 text-sm font-semibold cursor-pointer transition-colors
              ${locale === l
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-gray-300 bg-white text-gray-600"}`}
          >
            {LOCALE_LABELS[l]}
          </button>
        ))}
      </div>
    </div>
  );
}
