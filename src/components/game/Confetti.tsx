"use client";

import { useEffect, useRef } from "react";
import { ONES_C } from "@/lib/colors";
import { ri } from "@/lib/gameLogic";

const COLS = Object.entries(ONES_C)
  .filter(([k]) => Number(k) >= 1)
  .map(([, v]) => v.bg);

export default function Confetti({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pieces = useRef<{ x: number; y: number; r: number; c: string; vx: number; vy: number; rot: number; vr: number }[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d")!;

    pieces.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      r: ri(5, 12),
      c: COLS[ri(0, COLS.length - 1)],
      vx: (Math.random() - 0.5) * 6,
      vy: ri(3, 9),
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.2,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.current = pieces.current.filter(p => p.y < canvas.height + 20);
      pieces.current.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      });
      if (pieces.current.length > 0) raf.current = requestAnimationFrame(draw);
    }

    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full pointer-events-none z-[999]"
      style={{ display: active ? "block" : "none" }}
    />
  );
}
