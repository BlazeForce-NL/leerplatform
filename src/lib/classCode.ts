const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // geen I, O, 0, 1

export function generateClassCode(): string {
  return Array.from(
    { length: 6 },
    () => CHARS[Math.floor(Math.random() * CHARS.length)],
  ).join("");
}
