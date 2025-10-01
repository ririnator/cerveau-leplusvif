import { describe, it, expect } from 'vitest';
import { ArithmeticEngine } from '../src/arithmetic';

describe('ArithmeticEngine', () => {
  it('should initialize with default level 1', () => {
    const engine = new ArithmeticEngine();
    const { state, problem } = engine.init();

    expect(state.level).toBe(1);
    expect(state.streak).toBe(0);
    expect(state.score).toBe(0);
    expect(state.attempts).toBe(0);
    expect(state.correct).toBe(0);
    expect(problem.prompt).toBeDefined();
    expect(problem.correctAnswer).toBeDefined();
  });

  it('should initialize with custom level', () => {
    const engine = new ArithmeticEngine();
    const { state } = engine.init(5);

    expect(state.level).toBe(5);
  });

  it('should clamp level between 1 and 10', () => {
    const engine = new ArithmeticEngine();
    const { state: state1 } = engine.init(0);
    expect(state1.level).toBe(1);

    const engine2 = new ArithmeticEngine();
    const { state: state2 } = engine2.init(15);
    expect(state2.level).toBe(10);
  });

  it('should generate valid addition problems at level 1', () => {
    const engine = new ArithmeticEngine();
    engine.init(1);

    // Generate multiple problems to test consistency
    for (let i = 0; i < 10; i++) {
      const { state, problem } = engine.init(1);
      expect(problem.prompt).toMatch(/\d+ [+\-] \d+ = \?/);

      const answer = parseInt(problem.correctAnswer);
      expect(answer).toBeGreaterThanOrEqual(0); // No negative results
    }
  });

  it('should increase score on correct answer', () => {
    const engine = new ArithmeticEngine();
    const { state, problem } = engine.init(1);

    const result = engine.next(state, problem.correctAnswer, 1000);

    expect(result.correct).toBe(true);
    expect(result.state.score).toBeGreaterThan(state.score);
    expect(result.state.correct).toBe(1);
    expect(result.state.attempts).toBe(1);
    expect(result.state.streak).toBe(1);
  });

  it('should decrease score on incorrect answer', () => {
    const engine = new ArithmeticEngine();
    const { state } = engine.init(1);

    const result = engine.next(state, 'wrong_answer', 1000);

    expect(result.correct).toBe(false);
    expect(result.state.score).toBe(0); // Clamped at 0
    expect(result.state.correct).toBe(0);
    expect(result.state.attempts).toBe(1);
    expect(result.state.streak).toBe(0);
  });

  it('should level up after 3 correct answers in a row', () => {
    const engine = new ArithmeticEngine();
    let { state, problem } = engine.init(1);

    // First correct answer
    let result = engine.next(state, problem.correctAnswer, 1000);
    expect(result.state.level).toBe(1);
    expect(result.state.streak).toBe(1);

    // Second correct answer
    state = result.state;
    result = engine.next(state, result.nextProblem.correctAnswer, 1000);
    expect(result.state.level).toBe(1);
    expect(result.state.streak).toBe(2);

    // Third correct answer - should level up
    state = result.state;
    result = engine.next(state, result.nextProblem.correctAnswer, 1000);
    expect(result.state.level).toBe(2);
    expect(result.state.streak).toBe(3);
  });

  it('should level down on incorrect answer', () => {
    const engine = new ArithmeticEngine();
    const { state } = engine.init(5);

    const result = engine.next(state, 'wrong', 1000);

    expect(result.state.level).toBe(4);
    expect(result.state.streak).toBe(0);
  });

  it('should not level down below 1', () => {
    const engine = new ArithmeticEngine();
    const { state } = engine.init(1);

    const result = engine.next(state, 'wrong', 1000);

    expect(result.state.level).toBe(1);
  });

  it('should not level up above 10', () => {
    const engine = new ArithmeticEngine();
    let { state, problem } = engine.init(10);

    // Set streak to 2 to trigger level up on next correct
    state.streak = 2;

    const result = engine.next(state, problem.correctAnswer, 1000);

    expect(result.state.level).toBe(10); // Should stay at 10
  });

  it('should track average response time', () => {
    const engine = new ArithmeticEngine();
    let { state, problem } = engine.init(1);

    const result1 = engine.next(state, problem.correctAnswer, 1000);
    expect(result1.state.avgResponseMs).toBe(1000);

    state = result1.state;
    const result2 = engine.next(state, result1.nextProblem.correctAnswer, 2000);
    expect(result2.state.avgResponseMs).toBe(1500); // (1000 + 2000) / 2
  });

  it('should include multiplication at level 6+', () => {
    const engine = new ArithmeticEngine();
    const problems = new Set<string>();

    // Generate many problems at level 6 to ensure × appears
    for (let i = 0; i < 50; i++) {
      const { problem } = engine.init(6);
      if (problem.prompt.includes('×')) {
        problems.add('×');
      }
    }

    expect(problems.has('×')).toBe(true);
  });

  it('should provide next problem after each answer', () => {
    const engine = new ArithmeticEngine();
    const { state, problem } = engine.init(1);

    const result = engine.next(state, problem.correctAnswer, 1000);

    expect(result.nextProblem).toBeDefined();
    expect(result.nextProblem.prompt).toBeDefined();
    expect(result.nextProblem.correctAnswer).toBeDefined();
  });
});
