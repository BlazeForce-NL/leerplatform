"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "@/lib/useAudio";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import {
  Mode, Q, ScoreEntry,
  MSGS, ANON, STORAGE_KEY,
  makeQ, makeChoices, scoreCat, calcScore, ri,
} from "@/lib/gameLogic";

export type Screen = "name" | "levels" | "game" | "summary" | "board";

export interface GameState {
  screen: Screen;
  player: string;
  mode: Mode;
  specificTable: number;
  tableOrder: "volgorde" | "mix";
  tableIdx: number;
  timerSetting: number;
  maxVal: number;
  question: Q | null;
  choices: number[];
  selected: number | null;
  answered: boolean;
  score: number;
  streak: number;
  correctCount: number;
  totalCount: number;
  confetti: boolean;
  feedback: string;
  timeLeft: number;
  timeUp: boolean;
  showTafelMenu: boolean;
  allScores: Record<string, ScoreEntry[]>;
  isNewHigh: boolean;
  showBoard: boolean;
  activeLevelId: string | null;
}

export interface GameHandlers {
  startGame: (name: string) => void;
  handleAnswer: (val: number) => void;
  handleNext: () => void;
  endSession: () => void;
  changeMode: (m: Mode) => void;
  resetGame: () => void;
  setScreen: (s: Screen) => void;
  setShowBoard: (v: boolean) => void;
  setShowTafelMenu: (v: boolean | ((prev: boolean) => boolean)) => void;
  setMode: (m: Mode) => void;
  setSpecificTable: (n: number) => void;
  setTableOrder: (o: "volgorde" | "mix") => void;
  setTimerSetting: (v: number) => void;
  setTimeLeft: (v: number) => void;
  setMaxVal: (v: number) => void;
  setActiveLevelId: (id: string | null) => void;
  newQ: (m: Mode, st: number, to: "volgorde" | "mix", tIdx: number, timer: number, mv?: number, allowedTables?: number[]) => void;
}

export function useGameState(): GameState & GameHandlers {
  const [screen,        setScreen]        = useState<Screen>("name");
  const [player,        setPlayer]        = useState(ANON);
  const [mode,          setMode]          = useState<Mode>("plus");
  const [specificTable, setSpecificTable] = useState(2);
  const [tableOrder,    setTableOrder]    = useState<"volgorde" | "mix">("mix");
  const [tableIdx,      setTableIdx]      = useState(0);
  const [timerSetting,  setTimerSetting]  = useState(0);
  const [maxVal,        setMaxVal]        = useState(100);
  const [question,      setQuestion]      = useState<Q | null>(null);
  const [choices,       setChoices]       = useState<number[]>([]);
  const [selected,      setSelected]      = useState<number | null>(null);
  const [answered,      setAnswered]      = useState(false);
  const [score,         setScore]         = useState(0);
  const [streak,        setStreak]        = useState(0);
  const [correctCount,  setCorrectCount]  = useState(0);
  const [totalCount,    setTotalCount]    = useState(0);
  const [confetti,      setConfetti]      = useState(false);
  const [feedback,      setFeedback]      = useState("");
  const [timeLeft,      setTimeLeft]      = useState(0);
  const [timeUp,        setTimeUp]        = useState(false);
  const [showTafelMenu, setShowTafelMenu] = useState(false);
  const [allScores,     setAllScores]     = useState<Record<string, ScoreEntry[]>>(
    () => getStorageItem<Record<string, ScoreEntry[]>>(STORAGE_KEY, {}),
  );
  const [isNewHigh,     setIsNewHigh]     = useState(false);
  const [showBoard,     setShowBoard]     = useState(false);
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);

  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTick  = useRef(0);
  const tIdxRef   = useRef(0);
  const maxValRef = useRef(100);
  const audio = useAudio();

  useEffect(() => { tIdxRef.current = tableIdx; }, [tableIdx]);
  useEffect(() => { maxValRef.current = maxVal; }, [maxVal]);

  const newQ = useCallback((
    m: Mode,
    st: number,
    to: "volgorde" | "mix",
    tIdx: number,
    timer: number,
    mv?: number,
    allowedTables?: number[],
  ) => {
    const effective = mv ?? maxValRef.current;
    const { q, nextIdx } = makeQ(m, st, to, tIdx, effective, allowedTables);
    setQuestion(q);
    setChoices(makeChoices(q.answer, q.op, effective));
    setSelected(null); setAnswered(false); setFeedback("");
    setConfetti(false); setTimeUp(false); setTableIdx(nextIdx);
    if (timer > 0) setTimeLeft(timer);
  }, []);

  function startGame(name: string) {
    setPlayer(name);
    setScore(0); setStreak(0); setCorrectCount(0); setTotalCount(0);
    setScreen("game"); setTableIdx(0);
    newQ(mode, specificTable, tableOrder, 0, timerSetting);
  }

  useEffect(() => {
    if (screen !== "game" || timerSetting === 0 || answered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1;
        const now = Date.now();
        if (now - lastTick.current > 850) {
          lastTick.current = now;
          if (next <= 5 && next > 0) audio.urgentTick();
          else if (next <= timerSetting * 0.4) audio.tick();
        }
        if (next <= 0) {
          clearInterval(timerRef.current!);
          audio.timeUp();
          setAnswered(true); setTimeUp(true);
          setFeedback("Tijd is op! Het groene antwoord is goed.");
          setStreak(0); setTotalCount(c => c + 1);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [question, timerSetting, answered, screen, audio]);

  function handleAnswer(val: number) {
    if (answered || !question) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setAnswered(true); setSelected(val); setTotalCount(c => c + 1);
    if (val === question.answer) {
      const { score: newScore, newStreak, isCombo } = calcScore(score, streak);
      setScore(newScore); setStreak(newStreak);
      setCorrectCount(c => c + 1);
      setFeedback(MSGS[ri(0, MSGS.length - 1)] + (isCombo ? " Combo! +2 ⭐" : " +1 ⭐"));
      if (newStreak % 3 === 0) { setConfetti(true); audio.fanfare(); setTimeout(() => setConfetti(false), 3500); }
      else audio.correct();
    } else {
      setStreak(0); audio.wrong();
      setFeedback("Bijna! Het groene antwoord is goed.");
    }
  }

  function endSession() {
    const cat = scoreCat(mode, specificTable, timerSetting, maxVal);
    const entry: ScoreEntry = { player, score, correct: correctCount, total: totalCount, date: new Date().toLocaleDateString("nl-NL") };
    const updated = { ...allScores };
    if (!updated[cat]) updated[cat] = [];
    const myBest = updated[cat].filter(e => e.player === player).sort((a, b) => b.score - a.score)[0];
    const newH = !myBest || score > myBest.score;
    setIsNewHigh(newH);
    if (newH) audio.newHigh();
    updated[cat] = [...updated[cat], entry].sort((a, b) => b.score - a.score).slice(0, 50);
    setAllScores(updated);
    setStorageItem(STORAGE_KEY, updated);
    setScreen("summary");
  }

  function handleNext() { newQ(mode, specificTable, tableOrder, tIdxRef.current, timerSetting); }

  function changeMode(m: Mode) {
    setMode(m); setShowTafelMenu(false); setTableIdx(0);
    newQ(m, specificTable, tableOrder, 0, timerSetting);
  }

  function resetGame() { setScore(0); setStreak(0); setCorrectCount(0); setTotalCount(0); setTableIdx(0); }

  return {
    // state
    screen, player, mode, specificTable, tableOrder, tableIdx, timerSetting, maxVal,
    question, choices, selected, answered, score, streak, correctCount, totalCount,
    confetti, feedback, timeLeft, timeUp, showTafelMenu, allScores, isNewHigh, showBoard,
    activeLevelId,
    // handlers
    startGame, handleAnswer, handleNext, endSession, changeMode, resetGame,
    setScreen, setShowBoard, setShowTafelMenu, setMode, setSpecificTable,
    setTableOrder, setTimerSetting, setTimeLeft, setMaxVal, setActiveLevelId, newQ,
  };
}
