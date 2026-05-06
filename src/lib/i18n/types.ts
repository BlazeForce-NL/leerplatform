export type Locale = "nl" | "en";

export const LOCALES: Locale[] = ["nl", "en"];
export const DEFAULT_LOCALE: Locale = "nl";

export const LOCALE_LABELS: Record<Locale, string> = {
  nl: "🇳🇱 Nederlands",
  en: "🇬🇧 English",
};

export interface Messages {
  locale: Locale;

  // ── Game (rekenen) ────────────────────────────────────────────────────────
  game: {
    title: string;
    modes: { plus: string; min: string; mix: string; alles: string; tafel: string };
    timer: string;
    level: string;
    stop: string;
    next: string;
    score: string;
    streak: string;
    feedback: {
      correct: string[];
      wrong: string;
      timeUp: string;
      combo: string;
    };
    settings: string;
    world: string;
    levelMap: string;
    difficulty: string;
    autoNext: string;
    modeLabel: string;
    whichTable: string;
    orderLabel: string;
    allRandom: string;
    inOrder: string;
    random: string;
    nextLabel: string;
    correct: string;
    of: string;
    points: string;
    anonymous: string;
  };

  // ── Taal ─────────────────────────────────────────────────────────────────
  taal: {
    skills: {
      letters: string;
      plakken: string;
      "missende-letter": string;
      eindletter: string;
      beginletter: string;
      rijmwoord: string;
      "klanken-tellen": string;
      woordtypist: string;
      woordvolgorde: string;
      woordsoort: string;
      schrijven: string;
    };
    instructions: {
      letters: string;
      plakken: string;
      "missende-letter-vowel": string;
      "missende-letter-consonant": string;
      eindletter: string;
      beginletter: string;
      rijmwoord: string;
      "klanken-tellen": string;
      woordtypist: string;
      woordvolgorde: string;
      woordsoort: string;
    };
    listen: string;
    check: string;
    correct: string;
    wrong: string;
    nextWord: string;
  };

  // ── Level map ─────────────────────────────────────────────────────────────
  levels: {
    math: string;
    language: string;
    locked: string;
    unlocked: string;
    active: string;
    mastered: string;
    freePlay: string;
    badges: string;
    refresh: string;
  };

  // ── Name screen ───────────────────────────────────────────────────────────
  name: {
    title: string;
    subtitle: string;
    placeholder: string;
    play: string;
    playAs: string;
    anonymous: string;
    levelMap: string;
  };

  // ── Auth ─────────────────────────────────────────────────────────────────
  auth: {
    login: string;
    loginFor: string;
    emailLabel: string;
    emailPlaceholder: string;
    sendLink: string;
    sending: string;
    checkEmail: string;
    checkEmailText: string;
    otherEmail: string;
    studentLogin: string;
    register: string;
    freePlay: string;
    errors: {
      expired: string;
      missingToken: string;
      notFound: string;
      generic: string;
    };
  };

  // ── Badges ───────────────────────────────────────────────────────────────
  badges: {
    title: string;
    earned: string;
    toGo: string;
    unlocked: string;
    notYet: string;
  };

  // ── Session summary ───────────────────────────────────────────────────────
  summary: {
    title: string;
    newHigh: string;
    correct: string;
    of: string;
    play: string;
    leaderboard: string;
    levelMap: string;
  };

  // ── Scoreboard ────────────────────────────────────────────────────────────
  scoreboard: {
    title: string;
    noScores: string;
    close: string;
  };

  // ── General ──────────────────────────────────────────────────────────────
  general: {
    stop: string;
    back: string;
    close: string;
    auto: string;
    none: string;
    difficulty: { easy: string; medium: string; hard: string };
    timer: { none: string };
    letterSet: string;
    activity: string;
    world: string;
  };
}
