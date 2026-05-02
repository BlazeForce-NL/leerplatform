"use client";

import { useRef } from "react";

export function useAudio() {
  const ctx = useRef<AudioContext | null>(null);

  function get(): AudioContext | null {
    try {
      if (!ctx.current) {
        const Ctor =
          window.AudioContext ??
          (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        ctx.current = new Ctor();
      }
      // iOS Safari suspends AudioContext until a user gesture resumes it.
      if (ctx.current.state === "suspended") ctx.current.resume();
      return ctx.current;
    } catch {
      return null;
    }
  }

  function tone(freq: number, type: OscillatorType, dur: number, vol = 0.26, delay = 0) {
    try {
      const ac = get();
      if (!ac) return;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.connect(g);
      g.connect(ac.destination);
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ac.currentTime + delay);
      g.gain.linearRampToValueAtTime(vol, ac.currentTime + delay + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + dur);
      o.start(ac.currentTime + delay);
      o.stop(ac.currentTime + delay + dur + 0.05);
    } catch { /* ignore in browsers without audio support */ }
  }

  return {
    correct:    () => { tone(523,"sine",.15); tone(659,"sine",.15,.26,.12); tone(784,"sine",.25,.26,.24); },
    wrong:      () => { tone(300,"sawtooth",.15,.2); tone(220,"sawtooth",.25,.2,.15); },
    tick:       () => tone(880, "sine", .04, .07),
    urgentTick: () => tone(1100,"sine", .05, .11),
    timeUp:     () => { tone(400,"sawtooth",.1,.26); tone(300,"sawtooth",.15,.26,.12); tone(200,"sawtooth",.3,.26,.28); },
    fanfare:    () => { [523,659,784,1047].forEach((f,i) => tone(f,"sine",.2,.26,i*.1)); },
    newHigh:    () => { [784,880,1047,1175].forEach((f,i) => tone(f,"sine",.25,.3,i*.12)); },
  };
}
