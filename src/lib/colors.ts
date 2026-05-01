// Design tokens for SVG-rendered number blocks. Tailwind cannot style SVG fill/stroke
// attributes, so these live here as JS constants — the single source of truth for all
// block and brand colours used across components.

export const ONES_C: Record<number, { bg: string; bd: string }> = {
  0: { bg: "#fff",    bd: "#ddd"    },
  1: { bg: "#FF4040", bd: "#CC0000" },
  2: { bg: "#FF9933", bd: "#CC6600" },
  3: { bg: "#FFD700", bd: "#B8960C" },
  4: { bg: "#44CC44", bd: "#228822" },
  5: { bg: "#4488FF", bd: "#0044CC" },
  6: { bg: "#5533CC", bd: "#331188" },
  7: { bg: "#DD44BB", bd: "#882277" },
  8: { bg: "#FF66AA", bd: "#CC2277" },
  9: { bg: "#888888", bd: "#444444" },
};

export const TENS_C: Record<number, { bg: string; bd: string }> = {
  1: { bg: "#FFFFFF", bd: "#FF2222" },
  2: { bg: "#FFD9A0", bd: "#CC6600" },
  3: { bg: "#FFF5AA", bd: "#B8960C" },
  4: { bg: "#AAFFAA", bd: "#228822" },
  5: { bg: "#AACCFF", bd: "#0044CC" },
  6: { bg: "#C5AAFF", bd: "#331188" },
  7: { bg: "#F5AAEE", bd: "#882277" },
  8: { bg: "#FFB8D9", bd: "#CC2277" },
  9: { bg: "#CCCCCC", bd: "#444444" },
};

// Brand colours — also declared in tailwind.config.js for use in HTML elements.
// SVG elements import from here directly.
export const BRAND = {
  blue:      "#4488FF",
  red:       "#FF4040",
  orange:    "#FF9933",
  yellow:    "#FFD700",
  green:     "#44CC44",
  darkgreen: "#228822",
  purple:    "#9944CC",
} as const;

export function lum(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export function textOn(hex: string): string {
  return lum(hex) > 160 ? "#333" : "#fff";
}
