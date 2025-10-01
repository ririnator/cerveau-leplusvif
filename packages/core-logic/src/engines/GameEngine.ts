export type Op = "+" | "-" | "×";
export type GameType = "arithmetic" | "sequences" | "stroop";

export interface Problem {
  prompt: string;
  meta?: any;
  correctAnswer: string;
}

export interface GameState {
  level: number;            // 1..10
  streak: number;           // current correct streak
  score: number;            // per-game
  attempts: number;         // #answered
  correct: number;          // #correct
  avgResponseMs: number;    // rolling avg
}

export interface GameEngine {
  type: GameType;
  init(level?: number): { state: GameState; problem: Problem };
  next(state: GameState, userAnswer: string, elapsedMs: number): {
    state: GameState;
    correct: boolean;
    correctAnswer: string;
    nextProblem: Problem;
  };
}

export interface SessionGameResult {
  type: GameType;
  levelCurve: number[];
  score: number;
  accuracy: number;         // 0..1
  avgResponseMs: number;
  attempts: number;
}

export interface SessionResult {
  startedAt: string;
  durationSec: number;
  games: SessionGameResult[];
  totalScore: number;
  accuracy: number;
}
