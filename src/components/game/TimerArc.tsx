import { BRAND } from "@/lib/colors";

export default function TimerArc({ timeLeft, total }: { timeLeft: number; total: number }) {
  const r = 26, cx = 32, cy = 32, circ = 2 * Math.PI * r;
  const pct = total > 0 ? timeLeft / total : 1;
  const col = pct < 0.25 ? BRAND.red : pct < 0.5 ? BRAND.orange : BRAND.green;
  return (
    <svg width={64} height={64}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#eee" strokeWidth={5} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth={5}
        strokeDasharray={`${pct * circ} ${circ}`} strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.9s linear, stroke 0.3s" }} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize={17} fontWeight={700} fill={col}>{timeLeft}</text>
    </svg>
  );
}
