"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "@/lib/useAudio";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import {
  Mode, Q, ScoreEntry,
  MSGS, ANON, STORAGE_KEY,
  makeQ, makeChoices, scoreCat, calcScore, ri,
} from "@/lib/gameLogic";
import { MAX_OPTS } from "@/lib/gameLogic";
import Confetti from "./game/Confetti";
import Scoreboard from "./game/Scoreboard";
import SessionSummary from "./game/SessionSummary";
import NameScreen from "./game/NameScreen";
import GameScreen from "./game/GameScreen";

type Screen = "name" | "game" | "summary" | "board";

const WRAP = "min-h-dvh bg-game-bg font-sans";

export default function NumberblocksGame() {
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

  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTick  = useRef(0);
  const tIdxRef   = useRef(0);
  const maxValRef = useRef(100);
  const audio = useAudio();

  useEffect(() => { tIdxRef.current = tableIdx; }, [tableIdx]);
  useEffect(() => { maxValRef.current = maxVal; }, [maxVal]);

  const newQ = useCallback((m: Mode, st: number, to: "volgorde" | "mix", tIdx: number, timer: number, mv?: number) => {
    const effective = mv ?? maxValRef.current;
    const { q, nextIdx } = makeQ(m, st, to, tIdx, effective);
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

  if (screen === "name") return (
    <div className={WRAP}><NameScreen onStart={startGame} /></div>
  );

  if (screen === "summary") return (
    <div className={`${WRAP} p-4`}>
      <Confetti active={isNewHigh} />
      <SessionSummary player={player} score={score} correct={correctCount} total={totalCount} isNewHigh={isNewHigh}
        onPlay={() => { resetGame(); setScreen("game"); newQ(mode, specificTable, tableOrder, 0, timerSetting); }}
        onBoard={() => setScreen("board")} />
    </div>
  );

  if (screen === "board") return (
    <div className={`${WRAP} p-4`}>
      <Scoreboard allScores={allScores} onClose={() => setScreen("game")} />
      <div className="text-center mt-5">
        <button type="button" onPointerUp={() => { resetGame(); setScreen("name"); }}
          className="py-3 px-7 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer">
          Nieuw spel
        </button>
      </div>
    </div>
  );

  return (
    <div className={WRAP}>
      <GameScreen
        player={player} mode={mode} specificTable={specificTable}
        tableOrder={tableOrder} tableIdx={tableIdx} timerSetting={timerSetting}
        question={question} choices={choices} selected={selected} answered={answered}
        score={score} streak={streak} correctCount={correctCount} totalCount={totalCount}
        confetti={confetti} feedback={feedback} timeLeft={timeLeft} timeUp={timeUp}
        showTafelMenu={showTafelMenu} allScores={allScores} showBoard={showBoard}
        maxVal={maxVal}
        onOpenBoard={() => setShowBoard(true)}
        onCloseBoard={() => setShowBoard(false)}
        onStop={endSession}
        onNext={handleNext}
        onAnswer={handleAnswer}
        onChangeMode={changeMode}
        onToggleTafelMenu={() => setShowTafelMenu(v => !v)}
        onSelectAllTables={() => { setMode("tafel"); setTableIdx(0); newQ("tafel", specificTable, tableOrder, 0, timerSetting); setShowTafelMenu(false); }}
        onSelectSpecificTable={n => { setMode("tafel_specific"); setSpecificTable(n); setTableIdx(0); newQ("tafel_specific", n, tableOrder, 0, timerSetting); }}
        onSetTableOrder={o => { setTableOrder(o); setTableIdx(0); newQ("tafel_specific", specificTable, o, 0, timerSetting); }}
        onSetTimer={v => { setTimerSetting(v); if (v > 0) setTimeLeft(v); }}
        onSetMaxVal={v => { setMaxVal(v); newQ(mode, specificTable, tableOrder, tIdxRef.current, timerSetting, v); }}
      />
    </div>
  );
}
