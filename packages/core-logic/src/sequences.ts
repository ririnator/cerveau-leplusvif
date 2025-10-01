import type { GameEngine, GameState, Problem } from './engines/GameEngine';
import { clamp, randInt } from './common';

/**
 * Logical Sequences Engine
 * Find the next term in arithmetic progressions
 */

function getLevelConfig(level: number) {
  const clamped = clamp(level, 1, 10);

  // Config: starting range, step range, and sequence length
  const configs = {
    1: { start: [1, 10], step: [1, 2], length: 3 },
    2: { start: [1, 15], step: [1, 3], length: 3 },
    3: { start: [1, 20], step: [2, 4], length: 3 },
    4: { start: [1, 20], step: [2, 5], length: 4 },
    5: { start: [1, 30], step: [2, 6], length: 4 },
    6: { start: [1, 30], step: [3, 7], length: 4 },
    7: { start: [1, 40], step: [3, 8], length: 4 },
    8: { start: [1, 50], step: [4, 10], length: 4 },
    9: { start: [1, 50], step: [5, 12], length: 5 },
    10: { start: [1, 60], step: [5, 15], length: 5 },
  };

  return configs[clamped as keyof typeof configs];
}

function generateProblem(level: number): Problem {
  const config = getLevelConfig(level);

  const start = randInt(config.start[0], config.start[1]);
  const step = randInt(config.step[0], config.step[1]);

  // Randomly decide if it's increasing or decreasing
  const isIncreasing = Math.random() > 0.3; // 70% increasing, 30% decreasing
  const actualStep = isIncreasing ? step : -step;

  // Generate sequence
  const sequence: number[] = [];
  for (let i = 0; i < config.length; i++) {
    sequence.push(start + i * actualStep);
  }

  // The answer is the next term
  const answer = start + config.length * actualStep;

  const prompt = `${sequence.join(', ')}, ?`;

  return {
    prompt,
    meta: { sequence, step: actualStep },
    correctAnswer: answer.toString(),
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

export class SequencesEngine implements GameEngine {
  type: 'sequences' = 'sequences';
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
