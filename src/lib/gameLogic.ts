export type Mode = "plus" | "min" | "mix" | "tafel" | "tafel_specific" | "alles";

export interface Q {
  label: string;
  answer: number;
  a: number;
  b: number;
  op: string;
}

export interface ScoreEntry {
  player: string;
  score: number;
  correct: number;
  total: number;
  date: string;
}

export const MSGS = [
  "Super!", "Goed zo!", "Wauw!", "Top!",
  "Bravo!", "Knap!", "Fantastisch!", "Geweldig!",
];

export const TIMER_OPT = [
  { l: "Geen", v: 0  },
  { l: "30s",  v: 30 },
  { l: "20s",  v: 20 },
  { l: "15s",  v: 15 },
  { l: "10s",  v: 10 },
];

export const CAT_LABELS: Record<string, string> = {
  plus:  "Optellen",
  min:   "Aftrekken",
  mix:   "+ en −",
  tafel: "Alle tafels",
  alles: "Alles mix",
};

export const STORAGE_KEY = "nb_scores_v1";
export const ANON = "Anoniem";

export function ri(a: number, b: number): number {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function catLabel(k: string): string {
  const parts = k.split("_t");
  const timer = parts[1] ?? "0";
  const mk = parts[0];
  let name = CAT_LABELS[mk] ?? mk;
  if (mk.startsWith("tafel_")) name = `Tafel van ${mk.split("_")[1]}`;
  return name + (timer !== "0" ? ` (${timer}s)` : "");
}

export function scoreCat(mode: Mode, st: number, timer: number): string {
  const m = mode === "tafel_specific" ? `tafel_${st}` : mode;
  return `${m}_t${timer}`;
}

export function makeQ(
  mode: Mode,
  st: number,
  to: "volgorde" | "mix",
  tIdx: number,
): { q: Q; nextIdx: number } {
  let which = mode as string;
  if (mode === "alles")                                   which = ["plus", "min", "tafel"][ri(0, 2)];
  else if (mode === "mix")                                which = Math.random() < 0.5 ? "plus" : "min";
  else if (mode === "tafel" || mode === "tafel_specific") which = "tafel";

  if (which === "tafel") {
    let a: number, b: number, ni = tIdx;
    if (mode === "tafel_specific") {
      a = st;
      if (to === "volgorde") { b = tIdx + 1; ni = (tIdx + 1) % 10; }
      else b = ri(1, 10);
    } else {
      a = ri(1, 10); b = ri(1, 10);
    }
    return { q: { label: `${a} × ${b} = ?`, answer: a * b, a, b, op: "×" }, nextIdx: ni };
  }

  if (which === "plus") {
    const a = ri(1, 99), b = ri(1, 100 - a);
    return { q: { label: `${a} + ${b} = ?`, answer: a + b, a, b, op: "+" }, nextIdx: tIdx };
  }

  const a = ri(2, 100), b = ri(1, a);
  return { q: { label: `${a} − ${b} = ?`, answer: a - b, a, b, op: "−" }, nextIdx: tIdx };
}

export interface ScoreResult {
  score: number;
  newStreak: number;
  isCombo: boolean;
}

export function calcScore(currentScore: number, currentStreak: number): ScoreResult {
  const newStreak = currentStreak + 1;
  const isCombo = newStreak >= 3;
  return { score: currentScore + (isCombo ? 2 : 1), newStreak, isCombo };
}

export function makeChoices(correct: number, op: string): number[] {
  const s = new Set<number>([correct]);
  let att = 0;
  while (s.size < 4 && att < 300) {
    att++;
    const d = op === "×"
      ? ri(1, 5)  * (Math.random() < 0.5 ? 1 : -1)
      : ri(1, 15) * (Math.random() < 0.5 ? 1 : -1);
    const v = correct + d;
    if (v >= 0) s.add(v);
  }
  return [...s].sort(() => Math.random() - 0.5);
}
