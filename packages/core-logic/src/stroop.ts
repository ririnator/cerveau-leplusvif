import type { GameEngine, GameState, Problem } from './engines/GameEngine';
import { clamp, pick } from './common';

/**
 * Stroop Binary Engine
 * Answer yes/no if word matches ink color
 */

const COLORS = ['rouge', 'bleu', 'vert', 'jaune'] as const;
type Color = typeof COLORS[number];

function getLevelConfig(level: number) {
  const clamped = clamp(level, 1, 10);

  // Config: incongruent probability (higher level = more incongruent = harder)
  const configs = {
    1: { incongruentProb: 0.3 },
    2: { incongruentProb: 0.35 },
    3: { incongruentProb: 0.4 },
    4: { incongruentProb: 0.45 },
    5: { incongruentProb: 0.5 },
    6: { incongruentProb: 0.55 },
    7: { incongruentProb: 0.6 },
    8: { incongruentProb: 0.65 },
    9: { incongruentProb: 0.7 },
    10: { incongruentProb: 0.75 },
  };

  return configs[clamped as keyof typeof configs];
}

function generateProblem(level: number): Problem {
  const config = getLevelConfig(level);

  const word = pick([...COLORS]);
  const isIncongruent = Math.random() < config.incongruentProb;

  let inkColor: Color;
  if (isIncongruent) {
    // Pick a different color for ink
    const otherColors = COLORS.filter(c => c !== word);
    inkColor = pick([...otherColors]) as Color;
  } else {
    // Congruent: ink matches word
    inkColor = word as Color;
  }

  const match = word === inkColor;
  const correctAnswer = match ? 'oui' : 'non';

  // Prompt: We'll format this to indicate word and color
  // The UI will need to render the word in the specified ink color
  const prompt = `Le mot correspond-il à la couleur ?`;

  return {
    prompt,
    meta: { word, inkColor, match },
    correctAnswer,
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

export class StroopEngine implements GameEngine {
  type: 'stroop' = 'stroop';
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
    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer;

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
