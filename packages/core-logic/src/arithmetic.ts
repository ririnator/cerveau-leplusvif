import type { GameEngine, GameState, Problem, Op } from './engines/GameEngine';
import { clamp, randInt, pick } from './common';

/**
 * Arithmetic Blitz Engine
 * Adaptive difficulty arithmetic operations
 */

function getLevelConfig(level: number) {
  const clamped = clamp(level, 1, 10);

  // Define bounds for operands based on level
  const configs = {
    1: { min: 1, max: 10, ops: ['+', '-'] as Op[] },
    2: { min: 1, max: 15, ops: ['+', '-'] as Op[] },
    3: { min: 1, max: 20, ops: ['+', '-'] as Op[] },
    4: { min: 1, max: 25, ops: ['+', '-'] as Op[] },
    5: { min: 1, max: 30, ops: ['+', '-'] as Op[] },
    6: { min: 1, max: 12, ops: ['+', '-', '×'] as Op[] },
    7: { min: 1, max: 15, ops: ['+', '-', '×'] as Op[] },
    8: { min: 1, max: 20, ops: ['+', '-', '×'] as Op[] },
    9: { min: 2, max: 25, ops: ['+', '-', '×'] as Op[] },
    10: { min: 2, max: 30, ops: ['+', '-', '×'] as Op[] },
  };

  return configs[clamped as keyof typeof configs];
}

function generateProblem(level: number): Problem {
  const config = getLevelConfig(level);
  const op = pick(config.ops);

  let a = randInt(config.min, config.max);
  let b = randInt(config.min, config.max);

  // For subtraction, ensure result is non-negative
  if (op === '-' && b > a) {
    [a, b] = [b, a];
  }

  // For multiplication at higher levels, keep numbers reasonable
  if (op === '×') {
    a = randInt(config.min, Math.min(config.max, 12));
    b = randInt(config.min, Math.min(config.max, 12));
  }

  let result: number;
  switch (op) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '×':
      result = a * b;
      break;
  }

  return {
    prompt: `${a} ${op} ${b} = ?`,
    meta: { a, b, op },
    correctAnswer: result.toString(),
  };
}

function calculateScore(correct: boolean, level: number, streak: number, currentScore: number): number {
  if (correct) {
    const bonus = 10 + 2 * level + Math.max(0, streak - 1);
    return currentScore + bonus;
  } else {
    return Math.max(0, currentScore - 5);
  }
}

export class ArithmeticEngine implements GameEngine {
  type: 'arithmetic' = 'arithmetic';
  private currentProblem: Problem | null = null;

  init(level: number = 1): { state: GameState; problem: Problem } {
    const state: GameState = {
      level: clamp(level, 1, 10),
      streak: 0,
      score: 0,
      attempts: 0,
      correct: 0,
      avgResponseMs: 0,
    };

    this.currentProblem = generateProblem(state.level);

    return { state, problem: this.currentProblem };
  }

  next(state: GameState, userAnswer: string, elapsedMs: number): {
    state: GameState;
    correct: boolean;
    correctAnswer: string;
    nextProblem: Problem;
  } {
    if (!this.currentProblem) {
      throw new Error('Engine not initialized - call init() first');
    }

    const correctAnswer = this.currentProblem.correctAnswer;
    const isCorrect = userAnswer.trim() === correctAnswer;

    // Update state
    const newAttempts = state.attempts + 1;
    const newCorrect = state.correct + (isCorrect ? 1 : 0);
    const newStreak = isCorrect ? state.streak + 1 : 0;

    // Calculate new score
    const newScore = calculateScore(isCorrect, state.level, state.streak, state.score);

    // Update level: +1 after 3 correct in a row, -1 on error
    let newLevel = state.level;
    if (isCorrect && newStreak >= 3) {
      newLevel = clamp(state.level + 1, 1, 10);
    } else if (!isCorrect) {
      newLevel = clamp(state.level - 1, 1, 10);
    }

    // Update average response time
    const newAvgResponseMs = state.attempts === 0
      ? elapsedMs
      : (state.avgResponseMs * state.attempts + elapsedMs) / newAttempts;

    const newState: GameState = {
      level: newLevel,
      streak: newStreak,
      score: newScore,
      attempts: newAttempts,
      correct: newCorrect,
      avgResponseMs: newAvgResponseMs,
    };

    // Generate next problem
    const nextProblem = generateProblem(newState.level);
    this.currentProblem = nextProblem;

    return {
      state: newState,
      correct: isCorrect,
      correctAnswer,
      nextProblem,
    };
  }
}
