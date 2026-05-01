import { ONES_C, TENS_C, lum, textOn } from "@/lib/colors";

const BS = 26;

export default function NumberBlock({ value, scale = 1 }: { value: number; scale?: number }) {
  const s = Math.round(BS * scale);
  if (value <= 0) return null;

  if (value <= 9) {
    const c = ONES_C[value];
    const w = s * 1.15, h = s * value + s * 0.5;
    const cx = w / 2;
    const eyeR = s * 0.13, eyeY = s * 0.37;
    const mY = s * 0.63, mW = s * 0.28;
    return (
      <svg width={w} height={h} style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.18))" }}>
        {Array.from({ length: value }).map((_, i) => (
          <rect key={i} x={2} y={i * s + 2} width={w - 4} height={s - 4} rx={s * 0.18}
            fill={c.bg} stroke={c.bd} strokeWidth={2.5} />
        ))}
        {value === 1 ? (
          <>
            <circle cx={cx} cy={eyeY} r={eyeR * 1.4} fill="white" />
            <circle cx={cx} cy={eyeY + eyeR * 0.1} r={eyeR * 0.7} fill="#222" />
            <circle cx={cx - eyeR * 0.3} cy={eyeY - eyeR * 0.3} r={eyeR * 0.28} fill="white" />
            <path d={`M${cx - mW} ${mY} Q${cx} ${mY + s * 0.13} ${cx + mW} ${mY}`}
              fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx={cx - s * 0.22} cy={eyeY} rx={eyeR * 1.1} ry={eyeR * 1.3} fill="white" />
            <circle cx={cx - s * 0.22} cy={eyeY + eyeR * 0.1} r={eyeR * 0.65} fill="#222" />
            <circle cx={cx - s * 0.22 - eyeR * 0.3} cy={eyeY - eyeR * 0.3} r={eyeR * 0.27} fill="white" />
            <ellipse cx={cx + s * 0.22} cy={eyeY} rx={eyeR * 1.1} ry={eyeR * 1.3} fill="white" />
            <circle cx={cx + s * 0.22} cy={eyeY + eyeR * 0.1} r={eyeR * 0.65} fill="#222" />
            <circle cx={cx + s * 0.22 - eyeR * 0.3} cy={eyeY - eyeR * 0.3} r={eyeR * 0.27} fill="white" />
            <path d={`M${cx - mW} ${mY} Q${cx} ${mY + s * 0.13} ${cx + mW} ${mY}`}
              fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" />
          </>
        )}
        <circle cx={cx} cy={-s * 0.2} r={s * 0.3} fill={c.bg} stroke={c.bd} strokeWidth={2} />
        <text x={cx} y={-s * 0.19} textAnchor="middle" dominantBaseline="middle"
          fontSize={s * 0.28} fontWeight="bold" fill={textOn(c.bg)}>{value}</text>
      </svg>
    );
  }

  const td = Math.floor(value / 10), od = value % 10;
  const tc = TENS_C[td] ?? TENS_C[1];
  const oc = ONES_C[od];
  const tensH = s * 10 + s * 0.4;
  const tw = s * 1.3, ow = od > 0 ? s * 1.1 : 0;
  const gap = od > 0 ? 5 : 0;
  const totalW = tw + gap + ow;
  const tcx = tw / 2;
  const eyeR = s * 0.12, eyeY = s * 0.37;
  const mY = s * 0.63, mW = s * 0.27;
  const cellH = tensH / td;

  return (
    <svg width={totalW} height={tensH + s * 0.3} style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.18))" }}>
      <rect x={2} y={2} width={tw - 4} height={tensH - 4} rx={s * 0.18}
        fill={tc.bg} stroke={tc.bd} strokeWidth={3} />
      {Array.from({ length: td }).map((_, i) => (
        <rect key={i} x={5} y={i * cellH + 5} width={tw - 10} height={cellH - 10} rx={s * 0.1}
          fill={tc.bg} stroke={tc.bd} strokeWidth={1} opacity={0.4} />
      ))}
      <ellipse cx={tcx - s * 0.2} cy={eyeY} rx={eyeR * 1.1} ry={eyeR * 1.3} fill="white" />
      <circle cx={tcx - s * 0.2} cy={eyeY + eyeR * 0.1} r={eyeR * 0.65} fill="#222" />
      <circle cx={tcx - s * 0.2 - eyeR * 0.3} cy={eyeY - eyeR * 0.3} r={eyeR * 0.27} fill="white" />
      <ellipse cx={tcx + s * 0.2} cy={eyeY} rx={eyeR * 1.1} ry={eyeR * 1.3} fill="white" />
      <circle cx={tcx + s * 0.2} cy={eyeY + eyeR * 0.1} r={eyeR * 0.65} fill="#222" />
      <circle cx={tcx + s * 0.2 - eyeR * 0.3} cy={eyeY - eyeR * 0.3} r={eyeR * 0.27} fill="white" />
      <path d={`M${tcx - mW} ${mY} Q${tcx} ${mY + s * 0.13} ${tcx + mW} ${mY}`}
        fill="none" stroke={lum(tc.bg) > 160 ? "#555" : "#fff"} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={tcx} cy={-s * 0.2} r={s * 0.32} fill={tc.bg} stroke={tc.bd} strokeWidth={2} />
      <text x={tcx} y={-s * 0.19} textAnchor="middle" dominantBaseline="middle"
        fontSize={s * 0.25} fontWeight="bold" fill={textOn(tc.bg)}>{value}</text>
      {od > 0 && Array.from({ length: od }).map((_, i) => (
        <rect key={i} x={tw + gap + 1} y={i * s + 2} width={ow - 3} height={s - 4} rx={s * 0.15}
          fill={oc.bg} stroke={oc.bd} strokeWidth={2} />
      ))}
    </svg>
  );
}
