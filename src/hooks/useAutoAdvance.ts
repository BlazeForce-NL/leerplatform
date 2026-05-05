"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Geeft een countdown (3→2→1→0) terug wanneer `answered` true wordt.
 * Bij 0 wordt `onAdvance` automatisch aangeroepen.
 * `delaySeconds=0` schakelt auto-advance uit.
 */
export function useAutoAdvance(
  answered: boolean,
  delaySeconds: number,
  onAdvance: () => void,
) {
  const [countdown, setCountdown] = useState(0);
  const onAdvanceRef = useRef(onAdvance);
  useEffect(() => { onAdvanceRef.current = onAdvance; });

  useEffect(() => {
    if (!answered || delaySeconds === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountdown(delaySeconds);
    const iv = setInterval(() => {
      setCountdown(n => {
        if (n <= 1) { clearInterval(iv); onAdvanceRef.current(); return 0; }
        return n - 1;
      });
    }, 1000);
    return () => {
      clearInterval(iv);
      setCountdown(0); // cleanup: reset zodat volgende ronde schoon begint
    };
  }, [answered, delaySeconds]);

  return countdown;
}
