"use client";

import { createContext, useContext } from "react";
import { nl } from "./nl";
import { en } from "./en";
import { DEFAULT_LOCALE, type Locale, type Messages } from "./types";

export { type Locale, type Messages, LOCALES, LOCALE_LABELS, DEFAULT_LOCALE } from "./types";
export { nl } from "./nl";
export { en } from "./en";

export const MESSAGES: Record<Locale, Messages> = { nl, en };

// ── Context ───────────────────────────────────────────────────────────────────

export interface LocaleCtx {
  locale: Locale;
  t: Messages;
  setLocale: (l: Locale) => void;
}

export const LocaleContext = createContext<LocaleCtx>({
  locale: DEFAULT_LOCALE,
  t: nl,
  setLocale: () => {},
});

export function useLocale(): LocaleCtx {
  return useContext(LocaleContext);
}

export function useT(): Messages {
  return useContext(LocaleContext).t;
}
