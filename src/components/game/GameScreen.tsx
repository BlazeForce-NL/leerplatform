"use client";

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
function ap(active: boolean): "true" | "false" { return active ? "true" : "false"; }
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
  const correct  = question?.answer ?? 0;
  const urgent   = timerSetting > 0 && timeLeft <= 5 && timeLeft > 0;
  const ansScale = correct <= 9 ? 1.5 : correct <= 19 ? 1.0 : 0.8;

  return (
    <div className="px-2 py-3">
      <Confetti active={confetti} />
      {showBoard && <Scoreboard allScores={allScores} onClose={onCloseBoard} />}

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

      {/* Mode buttons */}
      <div role="group" aria-label="Oefenmodus kiezen" className="flex flex-wrap justify-center gap-1.5 mb-1.5">
        {([["plus","Optellen"],["min","Aftrekken"],["mix","+ en −"],["alles","Alles mix"]] as [Mode,string][]).map(([m,l]) => (
          <button type="button" key={m} onPointerUp={() => onChangeMode(m)}
            aria-pressed={ap(mode === m)} className={modeBtn(mode === m, m)}>{l}</button>
        ))}
        <button type="button" onPointerUp={onToggleTafelMenu}
          aria-pressed={ap(mode === "tafel" || mode === "tafel_specific")}
          aria-expanded={ap(showTafelMenu)}
          aria-controls="tafel-menu"
          className={modeBtn(mode === "tafel" || mode === "tafel_specific", "tafel")}>
          Tafels <span aria-hidden="true">{showTafelMenu ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* Tafel sub-menu */}
      {showTafelMenu && (
        <div id="tafel-menu" className="bg-white rounded-2xl p-3 max-w-[460px] mx-auto mb-2 shadow-sm">
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
      )}

      {/* Timer buttons */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-2.5">
        <span className="text-xs text-gray-500 font-semibold self-center">Timer:</span>
        {TIMER_OPT.map(o => (
          <button type="button" key={o.v} onPointerUp={() => onSetTimer(o.v)}
            className={modeBtn(timerSetting === o.v, "timer")}>{o.l}</button>
        ))}
      </div>

      {/* Question card */}
      {question && (
        <div className={`bg-white rounded-[20px] shadow-md px-3.5 pt-4 pb-3 text-center max-w-[460px] mx-auto mb-3 border-[3px] transition-colors ${urgent ? "border-brand-red" : "border-transparent"}`}>
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

      {/* Answer choices */}
      <div className="grid grid-cols-2 gap-2.5 max-w-[460px] mx-auto mb-3">
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

      {/* Answer reveal */}
      {answered && correct >= 1 && correct <= 99 && (
        <div className="text-center mb-2.5">
          <div className="text-xs text-gray-500 mb-2">Antwoord:</div>
          <div className="inline-flex items-end justify-center">
            <NumberBlock value={correct} scale={ansScale} />
          </div>
        </div>
      )}

      {/* Next / stop */}
      {answered && (
        <div className="flex gap-2.5 justify-center flex-wrap mt-1">
          <button type="button" onPointerUp={onNext}
            className="py-3 px-8 rounded-full bg-brand-blue border-none text-white text-[17px] font-bold cursor-pointer shadow-md">
            Volgende →
          </button>
          <button type="button" onPointerUp={onStop}
            className="py-3 px-6 rounded-full bg-brand-yellow border-none text-gray-800 text-[15px] font-bold cursor-pointer">
            Stop & Score 🏁
          </button>
        </div>
      )}
    </div>
  );
}
