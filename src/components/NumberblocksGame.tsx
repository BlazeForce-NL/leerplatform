"use client";

import { useEffect, useRef, useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { SKILL_GRAPH, getLevelById } from "@/lib/skillGraph";
import { createLocalMasteryStore, checkAndAwardBadges, type Badge } from "@/lib/mastery";
import { getPlayerId } from "@/lib/playerId";

import Confetti from "./game/Confetti";
import Scoreboard from "./game/Scoreboard";
import SessionSummary from "./game/SessionSummary";
import NameScreen from "./game/NameScreen";
import GameScreen from "./game/GameScreen";
import LevelMap from "./game/LevelMap";
import BadgeUnlocked from "./game/BadgeUnlocked";
import BadgeGallery from "./game/BadgeGallery";

const WRAP = "min-h-dvh bg-game-bg font-sans";

export default function NumberblocksGame() {
  const game = useGameState();
  const playerIdRef = useRef<string>("");
  const [pendingBadges, setPendingBadges] = useState<Badge[]>([]);
  // scherm vóór badges, zodat we terug kunnen navigeren
  const prevScreenRef = useRef<typeof game.screen>("levels");

  useEffect(() => { playerIdRef.current = getPlayerId(); }, []);

  // ── Level starten vanuit LevelMap ────────────────────────────────────────

  function startLevel(levelId: string) {
    const level = getLevelById(SKILL_GRAPH, levelId);
    if (!level) return;
    const { mode, maxVal, timerSetting, allowedTables, specificTable, tableOrder } = level.content_config;
    game.setActiveLevelId(levelId);
    game.setMode(mode);
    game.setMaxVal(maxVal);
    game.setTimerSetting(timerSetting);
    if (timerSetting > 0) game.setTimeLeft(timerSetting);
    game.setScreen("game");
    game.newQ(mode, specificTable ?? 1, tableOrder ?? "mix", 0, timerSetting, maxVal, allowedTables);
  }

  // ── Antwoord opslaan + badges checken ───────────────────────────────────

  const prevAnswered = useRef(false);
  useEffect(() => {
    if (!game.answered || prevAnswered.current) return;
    prevAnswered.current = true;
    if (!game.activeLevelId || !playerIdRef.current) return;

    const store = createLocalMasteryStore(playerIdRef.current);
    const isCorrect = game.selected === (game.question?.answer ?? -1);
    const record = store.recordAnswer(game.activeLevelId, isCorrect);

    const newBadges = checkAndAwardBadges(
      playerIdRef.current,
      game.streak,
      game.timerSetting > 0,
    );
    if (newBadges.length > 0) setPendingBadges(b => [...b, ...newBadges]);

    if (record.mastered) {
      setTimeout(() => game.setScreen("levels"), 2000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.answered]);

  useEffect(() => {
    if (!game.answered) prevAnswered.current = false;
  }, [game.answered]);

  // ── Schermrouting ────────────────────────────────────────────────────────

  if (game.screen === "name") return (
    <div className={WRAP}>
      <NameScreen onStart={game.startGame} onLevels={() => game.setScreen("levels")} />
    </div>
  );

  if (game.screen === "levels") return (
    <>
      <LevelMap
        onSelectLevel={startLevel}
        onBadges={() => {
          prevScreenRef.current = "levels";
          game.setScreen("badges");
        }}
        onVrijSpelen={() => {
          game.setActiveLevelId(null);
          game.setScreen("game");
          game.newQ(game.mode, game.specificTable, game.tableOrder, 0, game.timerSetting);
        }}
      />
      {/* Badge unlock overlay bovenop de levelmap (zeldzaam maar mogelijk) */}
      {pendingBadges.length > 0 && (
        <BadgeUnlocked badges={pendingBadges} onDone={() => setPendingBadges([])} />
      )}
    </>
  );

  if (game.screen === "badges") return (
    <BadgeGallery onBack={() => game.setScreen(prevScreenRef.current)} />
  );

  if (game.screen === "summary") return (
    <div className={`${WRAP} p-4`}>
      <Confetti active={game.isNewHigh} />
      <SessionSummary
        player={game.player} score={game.score}
        correct={game.correctCount} total={game.totalCount} isNewHigh={game.isNewHigh}
        onPlay={() => {
          game.resetGame();
          if (game.activeLevelId) startLevel(game.activeLevelId);
          else { game.setScreen("game"); game.newQ(game.mode, game.specificTable, game.tableOrder, 0, game.timerSetting); }
        }}
        onBoard={() => game.setScreen("board")}
      />
      {game.activeLevelId && (
        <div className="text-center mt-3">
          <button type="button" onPointerUp={() => game.setScreen("levels")}
            className="text-sm text-blue-600 underline cursor-pointer">
            ← Terug naar niveaukaart
          </button>
        </div>
      )}
    </div>
  );

  if (game.screen === "board") return (
    <div className={`${WRAP} p-4`}>
      <Scoreboard allScores={game.allScores} onClose={() => game.setScreen("game")} />
      <div className="text-center mt-5 flex flex-col gap-3 items-center">
        <button type="button" onPointerUp={() => game.setScreen("levels")}
          className="py-2.5 px-7 rounded-full bg-brand-blue border-none text-white text-base font-bold cursor-pointer">
          Niveaukaart
        </button>
        <button type="button" onPointerUp={() => { game.resetGame(); game.setScreen("name"); }}
          className="text-sm text-gray-500 underline cursor-pointer">
          Nieuw spel
        </button>
      </div>
    </div>
  );

  // ── Game scherm ──────────────────────────────────────────────────────────
  return (
    <div className={WRAP}>
      {pendingBadges.length > 0 && (
        <BadgeUnlocked badges={pendingBadges} onDone={() => setPendingBadges([])} />
      )}
      <GameScreen
        player={game.player} mode={game.mode} specificTable={game.specificTable}
        tableOrder={game.tableOrder} tableIdx={game.tableIdx} timerSetting={game.timerSetting}
        question={game.question} choices={game.choices} selected={game.selected}
        answered={game.answered} score={game.score} streak={game.streak}
        correctCount={game.correctCount} totalCount={game.totalCount}
        confetti={game.confetti} feedback={game.feedback}
        timeLeft={game.timeLeft} timeUp={game.timeUp}
        showTafelMenu={game.showTafelMenu} allScores={game.allScores}
        showBoard={game.showBoard} maxVal={game.maxVal}
        activeLevelId={game.activeLevelId}
        onOpenBoard={() => game.setShowBoard(true)}
        onCloseBoard={() => game.setShowBoard(false)}
        onStop={game.endSession}
        onNext={game.handleNext}
        onAnswer={game.handleAnswer}
        onChangeMode={game.changeMode}
        onToggleTafelMenu={() => game.setShowTafelMenu(v => !v)}
        onSelectAllTables={() => {
          game.setMode("tafel"); game.setActiveLevelId(null);
          game.newQ("tafel", game.specificTable, game.tableOrder, 0, game.timerSetting);
          game.setShowTafelMenu(false);
        }}
        onSelectSpecificTable={n => {
          game.setMode("tafel_specific"); game.setSpecificTable(n); game.setActiveLevelId(null);
          game.newQ("tafel_specific", n, game.tableOrder, 0, game.timerSetting);
        }}
        onSetTableOrder={o => {
          game.setTableOrder(o);
          game.newQ("tafel_specific", game.specificTable, o, 0, game.timerSetting);
        }}
        onSetTimer={v => { game.setTimerSetting(v); if (v > 0) game.setTimeLeft(v); }}
        onSetMaxVal={v => {
          game.setMaxVal(v); game.setActiveLevelId(null);
          game.newQ(game.mode, game.specificTable, game.tableOrder, 0, game.timerSetting, v);
        }}
        onGoToLevels={() => game.setScreen("levels")}
      />
    </div>
  );
}
