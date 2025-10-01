import type { GameEngine, GameType, SessionGameResult, SessionResult } from './GameEngine';

/**
 * SessionComposer
 * Manages a full 10-minute session with 3 games (3min each) + 1min recap
 */

export interface SessionConfig {
  games: GameType[];
  gameDurationSec: number;  // Duration per game (180s)
  recapDurationSec: number; // Duration for recap (60s)
}

export interface SessionState {
  currentGameIndex: number;
  gameStates: any[];  // Array of game states
  results: SessionGameResult[];
  startedAt: string;
  elapsedSec: number;
}

export class SessionComposer {
  private config: SessionConfig;
  private engines: GameEngine[];
  private levelCurves: number[][] = [];

  constructor(
    engines: GameEngine[],
    config: Partial<SessionConfig> = {}
  ) {
    this.engines = engines;
    this.config = {
      games: engines.map(e => e.type),
      gameDurationSec: config.gameDurationSec ?? 180,
      recapDurationSec: config.recapDurationSec ?? 60,
    };
  }

  /**
   * Initialize a new session
   */
  init(): SessionState {
    this.levelCurves = this.engines.map(() => []);

    return {
      currentGameIndex: 0,
      gameStates: [],
      results: [],
      startedAt: new Date().toISOString(),
      elapsedSec: 0,
    };
  }

  /**
   * Get the total session duration
   */
  getTotalDuration(): number {
    return this.config.gameDurationSec * this.engines.length + this.config.recapDurationSec;
  }

  /**
   * Record level change for a game
   */
  recordLevel(gameIndex: number, level: number): void {
    if (!this.levelCurves[gameIndex]) {
      this.levelCurves[gameIndex] = [];
    }
    this.levelCurves[gameIndex].push(level);
  }

  /**
   * Calculate results for a game
   */
  calculateGameResult(
    gameType: GameType,
    gameState: any,
    gameIndex: number
  ): SessionGameResult {
    const accuracy = gameState.attempts > 0
      ? gameState.correct / gameState.attempts
      : 0;

    return {
      type: gameType,
      levelCurve: this.levelCurves[gameIndex] || [],
      score: gameState.score,
      accuracy,
      avgResponseMs: Math.round(gameState.avgResponseMs),
      attempts: gameState.attempts,
    };
  }

  /**
   * Finalize session and calculate total results
   */
  finalize(state: SessionState): SessionResult {
    const totalScore = state.results.reduce((sum, r) => sum + r.score, 0);

    const totalCorrect = state.results.reduce((sum, r) => sum + r.accuracy * r.attempts, 0);
    const totalAttempts = state.results.reduce((sum, r) => sum + r.attempts, 0);
    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

    const endTime = new Date();
    const startTime = new Date(state.startedAt);
    const durationSec = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

    return {
      startedAt: state.startedAt,
      durationSec,
      games: state.results,
      totalScore,
      accuracy,
    };
  }
}
