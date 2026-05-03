"use client";

import { useEffect, useRef, useState } from "react";
import type { Mode, Q, ScoreEntry } from "@/lib/gameLogic";
import { TIMER_OPT } from "@/lib/gameLogic";
import NumberBlock from "./NumberBlock";
import Numberling from "./Numberling";
import Confetti from "./Confetti";
import TimerArc from "./TimerArc";
import Scoreboard from "./Scoreboard";

const BTN_BASE = "px-3 py-1 min-h-touch rounded-full border-2 font-semibold text-sm cursor-pointer";
const BTN_OFF  = `${BTN_BASE} border-gray-300 bg-white text-gray-600`;
const MODE_ON: Record<string, string> = {
  plus:  `${BTN_BASE} border-brand-blue      bg-brand-blue      text-white`,
  min:   `${BTN_BASE} border-brand-red       bg-brand-red       text-white`,
  mix:   `${BTN_BASE} border-brand-purple    bg-brand-purple    text-white`,
  alles: `${BTN_BASE} border-brand-darkgreen bg-brand-darkgreen text-white`,
  tafel: `${BTN_BASE} border-brand-orange    bg-brand-orange    text-white`,
  timer: `${BTN_BASE} border-gray-600        bg-gray-600        text-white`,
};
function modeBtn(active: boolean, v: string) { return active ? (MODE_ON[v] ?? BTN_OFF) : BTN_OFF; }
function choiceClass(answered: boolean, isC: boolean, isSel: boolean): string {
  if (!answered) return "bg-white border-gray-300 text-gray-800";
  if (isC)      return "bg-answer-correct border-answer-correct-bd text-answer-correct-text";
  if (isSel)    return "bg-answer-wrong    border-answer-wrong-bd    text-answer-wrong-text";
  return "bg-white border-gray-300 text-gray-400";
}

interface Props {
  player: string;
  mode: Mode;
  specificTable: number;
  tableOrder: "volgorde" | "mix";
  tableIdx: number;
  timerSetting: number;
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
  showBoard: boolean;
  onOpenBoard: () => void;
  onCloseBoard: () => void;
  onStop: () => void;
  onNext: () => void;
  onAnswer: (val: number) => void;
  onChangeMode: (m: Mode) => void;
  onToggleTafelMenu: () => void;
  onSelectAllTables: () => void;
  onSelectSpecificTable: (n: number) => void;
  onSetTableOrder: (o: "volgorde" | "mix") => void;
  onSetTimer: (v: number) => void;
}

export default function GameScreen({
  player, mode, specificTable, tableOrder, tableIdx, timerSetting,
  question, choices, selected, answered, score, streak, correctCount, totalCount,
  confetti, feedback, timeLeft, timeUp, showTafelMenu, allScores, showBoard,
  onOpenBoard, onCloseBoard, onStop, onNext, onAnswer, onChangeMode,
  onToggleTafelMenu, onSelectAllTables, onSelectSpecificTable, onSetTableOrder, onSetTimer,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!answered) { setCountdown(0); return; }
    setCountdown(3);
    countdownRef.current = setInterval(() => {
      setCountdown(n => {
        if (n <= 1) { clearInterval(countdownRef.current!); onNext(); return 0; }
        return n - 1;
      });
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered]);

  const correct  = question?.answer ?? 0;
  const urgent   = timerSetting > 0 && timeLeft <= 5 && timeLeft > 0;
  const ansScale = correct <= 9 ? 1.5 : correct <= 19 ? 1.0 : 0.8;

  const tafelSubmenu = (bg: string) => showTafelMenu && (
    <div className={`${bg} rounded-2xl p-3 mt-2`}>
      <div className="text-xs font-semibold text-gray-500 mb-1.5">Welke tafel?</div>
      <div className="flex flex-wrap gap-1 mb-2">
        <button type="button" onPointerUp={onSelectAllTables}
          className={modeBtn(mode === "tafel", "tafel")}>Alle willekeurig</button>
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <button type="button" key={n} onPointerUp={() => onSelectSpecificTable(n)}
            className={modeBtn(mode === "tafel_specific" && specificTable === n, "tafel")}>×{n}</button>
        ))}
      </div>
      {mode === "tafel_specific" && (
        <>
          <div className="text-xs font-semibold text-gray-500 mb-1.5">Volgorde?</div>
          <div className="flex gap-1.5 mb-1">
            {(["volgorde","mix"] as const).map(o => (
              <button type="button" key={o} onPointerUp={() => onSetTableOrder(o)}
                className={modeBtn(tableOrder === o, "tafel")}>
                {o === "volgorde" ? "Op volgorde" : "Willekeurig"}
              </button>
            ))}
          </div>
          {tableOrder === "volgorde" && (
            <div className="text-[11px] text-gray-400">Volgende: {specificTable} × {tableIdx + 1}</div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="md:flex md:h-dvh md:overflow-hidden">
      <Confetti active={confetti} />
      {showBoard && <Scoreboard allScores={allScores} onClose={onCloseBoard} />}

      {/* Main content */}
      <div className="flex-1 px-2 py-3 md:px-4 md:overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-500 font-semibold" aria-hidden="true">👤 {player}</div>
          <div className="text-lg font-bold text-gray-800" aria-label="Numberblocks Rekenspel">Numberblocks</div>
          <div className="flex gap-1.5">
            <button type="button" onPointerUp={onOpenBoard}
              className="px-2.5 py-1 min-h-touch min-w-[44px] rounded-2xl border-2 border-gray-300 bg-white text-gray-600 text-xs font-semibold cursor-pointer"
              aria-label="Scorebord openen">🏆</button>
            <button type="button" onPointerUp={onStop}
              className="px-2.5 py-1 min-h-touch rounded-2xl border-2 border-gray-300 bg-white text-gray-600 text-xs font-semibold cursor-pointer">
              Stop <span aria-hidden="true">🏁</span>
            </button>
          </div>
        </div>

        {/* Streak + score */}
        <div className="flex justify-center items-center gap-1 mb-2.5"
          aria-label={`Reeks: ${Math.min(5, streak)} van 5 sterren. Score: ${score}. ${correctCount} van ${totalCount} goed.`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} aria-hidden="true" className={`text-xl ${i < Math.min(5, streak) ? "text-brand-yellow" : "text-gray-300"}`}>★</span>
          ))}
          <span className="ml-2 text-sm font-bold text-brand-blue" aria-hidden="true">Score: {score}</span>
          <span className="ml-1.5 text-xs text-gray-500" aria-hidden="true">{correctCount}/{totalCount}</span>
        </div>

        {/* Settings — mobile only, collapsible */}
        <div className="md:hidden mb-2">
          <button type="button" onPointerUp={() => setMobileSettingsOpen(v => !v)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-2xl border border-gray-200 bg-white text-xs font-semibold text-gray-500 cursor-pointer">
            <span>⚙ Instellingen</span>
            <span>{mobileSettingsOpen ? "▲" : "▼"}</span>
          </button>
          {mobileSettingsOpen && (
            <div className="mt-2 bg-white rounded-2xl p-3 shadow-sm flex flex-col gap-3">
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-1.5">Modus</div>
                <div role="group" aria-label="Oefenmodus kiezen" className="flex flex-wrap gap-1.5">
                  {([["plus","Optellen"],["min","Aftrekken"],["mix","+ en −"],["alles","Alles mix"]] as [Mode,string][]).map(([m,l]) => (
                    <button type="button" key={m} onPointerUp={() => onChangeMode(m)}
                      className={modeBtn(mode === m, m)}>{l}</button>
                  ))}
                  <button type="button" onPointerUp={onToggleTafelMenu}
                    className={modeBtn(mode === "tafel" || mode === "tafel_specific", "tafel")}>
                    Tafels <span aria-hidden="true">{showTafelMenu ? "▲" : "▼"}</span>
                  </button>
                </div>
                {tafelSubmenu("bg-gray-50")}
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-1.5">Timer</div>
                <div className="flex flex-wrap gap-1.5">
                  {TIMER_OPT.map(o => (
                    <button type="button" key={o.v} onPointerUp={() => onSetTimer(o.v)}
                      className={modeBtn(timerSetting === o.v, "timer")}>{o.l}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Question + Answer area (desktop: side by side) */}
        <div className="md:flex md:gap-6 md:items-start md:max-w-3xl md:mx-auto">

          {/* Question card + choices */}
          <div className="md:flex-1">
            {question && (
              <div className={`bg-white rounded-[20px] shadow-md px-3.5 pt-4 pb-3 text-center max-w-[460px] mx-auto mb-3 border-[3px] transition-colors md:max-w-none ${urgent ? "border-brand-red" : "border-transparent"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-16" />
                  {question.op !== "×" && question.a <= 9 && question.b <= 9 ? (
                    <div className="flex items-end justify-center gap-2 flex-1">
                      <NumberBlock value={question.a} />
                      <span className="text-2xl font-bold text-gray-700 mb-1">{question.op}</span>
                      <NumberBlock value={question.b} />
                      <span className="text-2xl font-bold text-gray-700 mb-1">=</span>
                      <span className="text-4xl font-extrabold text-gray-300">?</span>
                    </div>
                  ) : <div className="flex-1" />}
                  {timerSetting > 0
                    ? <div className="w-16 flex justify-end"><TimerArc timeLeft={timeLeft} total={timerSetting} /></div>
                    : <div className="w-16" />}
                </div>
                <div className="text-[42px] font-extrabold text-gray-900 leading-none mb-0.5">{question.label}</div>
                <div className={`min-h-[28px] text-[17px] font-semibold mt-1 ${selected === correct || timeUp ? "text-brand-darkgreen" : "text-brand-red"}`}>
                  {feedback}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 max-w-[460px] mx-auto mb-3 md:max-w-none">
              {choices.map(c => {
                const isC = c === correct, isSel = c === selected;
                return (
                  <button type="button" key={c} onPointerUp={() => onAnswer(c)} disabled={answered}
                    className={`py-3.5 px-2 rounded-2xl border-[3px] text-[28px] font-extrabold transition-colors flex items-center justify-center gap-1.5 disabled:cursor-default ${choiceClass(answered, isC, isSel)}`}>
                    {answered && isC && <Numberling value={c} />}
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Volgende button — below choices on all screen sizes */}
            {answered && (
              <div className="flex justify-center mt-1 mb-2">
                <button type="button" onPointerUp={onNext}
                  className="py-3 px-8 rounded-full bg-brand-blue border-none text-white text-[17px] font-bold cursor-pointer shadow-md flex items-center gap-2">
                  Volgende →
                  {countdown > 0 && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-brand-blue text-sm font-extrabold tabular-nums">
                      {countdown}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Mobile: answer reveal */}
            {answered && correct >= 1 && correct <= 99 && (
              <div className="md:hidden text-center mb-2.5">
                <div className="text-xs text-gray-500 mb-2">Antwoord:</div>
                <div className="inline-flex items-end justify-center">
                  <NumberBlock value={correct} scale={ansScale} />
                </div>
              </div>
            )}
          </div>

          {/* Desktop: answer reveal (right of question, no Volgende here) */}
          {answered && correct >= 1 && correct <= 99 && (
            <div className="hidden md:flex md:flex-col md:items-center md:gap-4 md:pt-2 md:w-52 md:flex-none">
              <div className="text-xs text-gray-500 font-semibold">Antwoord:</div>
              <div className="flex items-end justify-center">
                <NumberBlock value={correct} scale={ansScale} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop sidebar — settings (right) */}
      <aside className={`hidden md:flex md:flex-col md:border-l md:border-gray-200 md:bg-white md:overflow-y-auto md:transition-all md:duration-200 ${sidebarOpen ? "md:w-72" : "md:w-12"}`}>
        <div className="p-2 border-b border-gray-100 flex items-center">
          {sidebarOpen && <span className="text-xs font-semibold text-gray-500 flex-1">Instellingen</span>}
          <button type="button" onPointerUp={() => setSidebarOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 text-base cursor-pointer hover:bg-gray-50 flex-none"
            aria-label={sidebarOpen ? "Instellingen inklappen" : "Instellingen uitklappen"}>
            {sidebarOpen ? "›" : "‹"}
          </button>
        </div>

        {sidebarOpen && (
          <div className="p-3 flex flex-col gap-4">
            {/* Mode */}
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2">Modus</div>
              <div role="group" aria-label="Oefenmodus kiezen" className="flex flex-wrap gap-1.5">
                {([["plus","Optellen"],["min","Aftrekken"],["mix","+ en −"],["alles","Alles mix"]] as [Mode,string][]).map(([m,l]) => (
                  <button type="button" key={m} onPointerUp={() => onChangeMode(m)}
                    aria-pressed={mode === m} className={modeBtn(mode === m, m)}>{l}</button>
                ))}
                <button type="button" onPointerUp={onToggleTafelMenu}
                  aria-pressed={mode === "tafel" || mode === "tafel_specific"}
                  aria-expanded={showTafelMenu}
                  className={modeBtn(mode === "tafel" || mode === "tafel_specific", "tafel")}>
                  Tafels <span aria-hidden="true">{showTafelMenu ? "▲" : "▼"}</span>
                </button>
              </div>
              {tafelSubmenu("bg-gray-50")}
            </div>

            {/* Timer */}
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2">Timer</div>
              <div className="flex flex-wrap gap-1.5">
                {TIMER_OPT.map(o => (
                  <button type="button" key={o.v} onPointerUp={() => onSetTimer(o.v)}
                    className={modeBtn(timerSetting === o.v, "timer")}>{o.l}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
