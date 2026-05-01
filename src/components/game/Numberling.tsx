import { ONES_C, TENS_C, textOn } from "@/lib/colors";

export default function Numberling({ value }: { value: number }) {
  const td = Math.floor(value / 10);
  const c = td > 0 ? (TENS_C[td] ?? TENS_C[1]) : ONES_C[value % 10];
  return (
    <span
      className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-full font-bold text-[13px] shrink-0"
      style={{ background: c.bg, border: `2px solid ${c.bd}`, color: textOn(c.bg) }}
    >
      {value}
    </span>
  );
}
