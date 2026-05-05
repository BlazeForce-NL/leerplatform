// Elk letter krijgt een vaste kleur (consistent across the whole app).
// Klinkers zijn warm/helder; medeklinkers hebben koelere tinten.
export const LETTER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  a: { bg: "#FF6B6B", text: "#fff", border: "#cc3333" },
  e: { bg: "#FFD93D", text: "#444", border: "#c9a800" },
  i: { bg: "#6BCB77", text: "#fff", border: "#3a9946" },
  o: { bg: "#FF9F45", text: "#fff", border: "#cc6a00" },
  u: { bg: "#C77DFF", text: "#fff", border: "#8b3fd4" },

  b: { bg: "#4D96FF", text: "#fff", border: "#1a5fcc" },
  c: { bg: "#2EC4B6", text: "#fff", border: "#1a8a80" },
  d: { bg: "#FF595E", text: "#fff", border: "#c42030" },
  f: { bg: "#FFCA3A", text: "#444", border: "#c99000" },
  g: { bg: "#8AC926", text: "#fff", border: "#5a8a00" },
  h: { bg: "#1982C4", text: "#fff", border: "#0f5a8c" },
  j: { bg: "#FF99C8", text: "#555", border: "#cc5599" },
  k: { bg: "#6A4C93", text: "#fff", border: "#3d1f66" },
  l: { bg: "#F15BB5", text: "#fff", border: "#b02080" },
  m: { bg: "#00BBF9", text: "#fff", border: "#007ab3" },
  n: { bg: "#9BF6FF", text: "#333", border: "#4db8cc" },
  p: { bg: "#CAFFBF", text: "#333", border: "#5aaa66" },
  q: { bg: "#8338EC", text: "#fff", border: "#5010b8" },
  r: { bg: "#FB5607", text: "#fff", border: "#b33200" },
  s: { bg: "#3A86FF", text: "#fff", border: "#0050cc" },
  t: { bg: "#FF006E", text: "#fff", border: "#b30050" },
  v: { bg: "#43AA8B", text: "#fff", border: "#1a7060" },
  w: { bg: "#F8961E", text: "#fff", border: "#b36000" },
  x: { bg: "#577590", text: "#fff", border: "#2a4a66" },
  y: { bg: "#90E0EF", text: "#333", border: "#3390b3" },
  z: { bg: "#023E8A", text: "#fff", border: "#011a40" },
};

export function getLetterColor(letter: string) {
  return LETTER_COLORS[letter.toLowerCase()] ?? { bg: "#e5e7eb", text: "#374151", border: "#9ca3af" };
}
