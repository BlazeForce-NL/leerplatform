"use client";

import { useState } from "react";
import { LocaleContext, MESSAGES, type LocaleCtx } from "@/lib/i18n";
import { type Locale, DEFAULT_LOCALE } from "@/lib/i18n/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";

const STORAGE_KEY = "nb_locale";

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Lazy init: leest localStorage eenmalig bij mount (client-only)
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return DEFAULT_LOCALE;
    const saved = getStorageItem<string>(STORAGE_KEY, DEFAULT_LOCALE);
    return (saved === "nl" || saved === "en") ? (saved as Locale) : DEFAULT_LOCALE;
  });

  function setLocale(l: Locale) {
    setLocaleState(l);
    setStorageItem(STORAGE_KEY, l);
  }

  const value: LocaleCtx = { locale, t: MESSAGES[locale], setLocale };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}
