import { useState, useEffect, useRef } from 'react';
import {
  ArithmeticEngine,
  SequencesEngine,
  StroopEngine,
  SessionComposer,
  type GameEngine,
  type GameState,
  type Problem,
  type GameType,
  type SessionResult,
} from '@cerveau-vif/core-logic';
import { trackSessionStart, trackAnswer, trackLevelUp, trackSessionEnd } from '../services/analytics';

export interface GameProgress {
  type: GameType;
  state: GameState;
  problem: Problem;
  engine: GameEngine;
}

export function useSessionRunner() {
  const [gameIndex, setGameIndex] = useState(0);
  const [currentGame, setCurrentGame] = useState<GameProgress | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [problemStartTime, setProblemStartTime] = useState<number>(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; show: boolean }>({ correct: false, show: false });

  const engines = useRef<GameEngine[]>([
    new ArithmeticEngine(),
    new SequencesEngine(),
    new StroopEngine(),
  ]);

  const composer = useRef(new SessionComposer(engines.current));
  const gameResults = useRef<any[]>([]);
  const levelCurves = useRef<number[][]>([[], [], []]);

  useEffect(() => {
    startSession();
  }, []);

  const startSession = () => {
    const now = Date.now();
    setSessionStartTime(now);
    setGameStartTime(now);
    setIsSessionActive(true);

    // Track analytics
    trackSessionStart(engines.current.map(e => e.type));

    // Initialize first game
    startGame(0);
  };

  const startGame = (index: number) => {
    if (index >= engines.current.length) {
      // All games done
      endSession();
      return;
    }

    const engine = engines.current[index];
    const { state, problem } = engine.init();

    levelCurves.current[index] = [state.level];

    setGameIndex(index);
    setCurrentGame({ type: engine.type, state, problem, engine });
    setGameStartTime(Date.now());
    setProblemStartTime(Date.now());
  };

  const submitAnswer = (answer: string) => {
    if (!currentGame) return;

    const elapsedMs = Date.now() - problemStartTime;
    const result = currentGame.engine.next(currentGame.state, answer, elapsedMs);

    // Track analytics
    trackAnswer(currentGame.type, result.correct, result.state.level, elapsedMs);

    // Track level change
    if (result.state.level !== currentGame.state.level) {
      levelCurves.current[gameIndex].push(result.state.level);
      if (result.state.level > currentGame.state.level) {
        trackLevelUp(currentGame.type, result.state.level);
      }
    }

    // Show feedback briefly
    setFeedback({ correct: result.correct, show: true });
    setTimeout(() => setFeedback({ correct: false, show: false }), 400);

    // Update current game state
    setCurrentGame({
      ...currentGame,
      state: result.state,
      problem: result.nextProblem,
    });

    setProblemStartTime(Date.now());

    // Check if game time is up (180 seconds)
    const gameElapsed = (Date.now() - gameStartTime) / 1000;
    if (gameElapsed >= 180) {
      endGame();
    }
  };

  const endGame = () => {
    if (!currentGame) return;

    // Calculate game result
    const gameResult = composer.current.calculateGameResult(
      currentGame.type,
      currentGame.state,
      gameIndex
    );

    // Update level curve
    gameResult.levelCurve = levelCurves.current[gameIndex];

    gameResults.current.push(gameResult);

    // Move to next game
    startGame(gameIndex + 1);
  };

  const endSession = () => {
    setIsSessionActive(false);

    const sessionState = {
      currentGameIndex: gameIndex,
      gameStates: [],
      results: gameResults.current,
      startedAt: new Date(sessionStartTime).toISOString(),
      elapsedSec: Math.round((Date.now() - sessionStartTime) / 1000),
    };

    const result = composer.current.finalize(sessionState);
    setSessionResult(result);

    // Track analytics
    trackSessionEnd(result.totalScore, result.accuracy, result.durationSec);
  };

  const getTimeRemaining = () => {
    if (!isSessionActive) return 0;
    const totalDuration = 180 * engines.current.length; // 540 seconds = 9 minutes for games
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    return Math.max(0, totalDuration - elapsed);
  };

  const getGameTimeRemaining = () => {
    if (!isSessionActive) return 0;
    const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    return Math.max(0, 180 - elapsed);
  };

  return {
    currentGame,
    gameIndex,
    totalGames: engines.current.length,
    isSessionActive,
    sessionResult,
    feedback,
    submitAnswer,
    getTimeRemaining,
    getGameTimeRemaining,
  };
}
