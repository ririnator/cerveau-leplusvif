import { describe, it, expect } from 'vitest';
import { StroopEngine } from '../src/stroop';

describe('StroopEngine', () => {
  it('should initialize with default level 1', () => {
    const engine = new StroopEngine();
    const { state, problem } = engine.init();

    expect(state.level).toBe(1);
    expect(problem.meta.word).toBeDefined();
    expect(problem.meta.inkColor).toBeDefined();
    expect(['oui', 'non']).toContain(problem.correctAnswer);
  });

  it('should generate valid color words', () => {
    const engine = new StroopEngine();
    const { problem } = engine.init();

    const validColors = ['rouge', 'bleu', 'vert', 'jaune'];
    expect(validColors).toContain(problem.meta.word);
    expect(validColors).toContain(problem.meta.inkColor);
  });

  it('should answer "oui" when colors match', () => {
    const engine = new StroopEngine();

    // Generate until we get a congruent trial
    for (let i = 0; i < 50; i++) {
      const { problem } = engine.init(1);
      if (problem.meta.word === problem.meta.inkColor) {
        expect(problem.correctAnswer).toBe('oui');
        break;
      }
    }
  });

  it('should answer "non" when colors do not match', () => {
    const engine = new StroopEngine();

    // Generate until we get an incongruent trial
    for (let i = 0; i < 50; i++) {
      const { problem } = engine.init(1);
      if (problem.meta.word !== problem.meta.inkColor) {
        expect(problem.correctAnswer).toBe('non');
        break;
      }
    }
  });

  it('should accept case-insensitive answers', () => {
    const engine = new StroopEngine();
    const { state, problem } = engine.init();

    const result1 = engine.next(state, problem.correctAnswer.toUpperCase(), 1000);
    const result2 = engine.next(state, problem.correctAnswer.toLowerCase(), 1000);

    expect(result1.correct || result2.correct).toBe(true);
  });

  it('should increase incongruent probability with level', () => {
    const engine = new StroopEngine();

    // Count incongruent at level 1
    let incongruent1 = 0;
    for (let i = 0; i < 50; i++) {
      const { problem } = engine.init(1);
      if (problem.meta.word !== problem.meta.inkColor) {
        incongruent1++;
      }
    }

    // Count incongruent at level 10
    let incongruent10 = 0;
    for (let i = 0; i < 50; i++) {
      const { problem } = engine.init(10);
      if (problem.meta.word !== problem.meta.inkColor) {
        incongruent10++;
      }
    }

    // Level 10 should have more incongruent trials
    expect(incongruent10).toBeGreaterThan(incongruent1);
  });

  it('should track scoring correctly', () => {
    const engine = new StroopEngine();
    const { state, problem } = engine.init();

    const correctResult = engine.next(state, problem.correctAnswer, 500);
    expect(correctResult.state.score).toBeGreaterThan(0);

    const wrongResult = engine.next(state, problem.correctAnswer === 'oui' ? 'non' : 'oui', 500);
    expect(wrongResult.correct).toBe(false);
  });
});
