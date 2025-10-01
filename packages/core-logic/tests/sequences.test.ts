import { describe, it, expect } from 'vitest';
import { SequencesEngine } from '../src/sequences';

describe('SequencesEngine', () => {
  it('should initialize with default level 1', () => {
    const engine = new SequencesEngine();
    const { state, problem } = engine.init();

    expect(state.level).toBe(1);
    expect(state.streak).toBe(0);
    expect(state.score).toBe(0);
    expect(problem.prompt).toMatch(/\d+.*\?/);
  });

  it('should generate valid sequence problems', () => {
    const engine = new SequencesEngine();
    const { problem } = engine.init(1);

    expect(problem.prompt).toContain(',');
    expect(problem.prompt).toContain('?');
    expect(problem.correctAnswer).toBeDefined();
    expect(problem.meta.sequence).toBeDefined();
    expect(problem.meta.step).toBeDefined();
  });

  it('should verify correct sequence answers', () => {
    const engine = new SequencesEngine();
    const { state, problem } = engine.init(1);

    const result = engine.next(state, problem.correctAnswer, 1000);

    expect(result.correct).toBe(true);
    expect(result.state.correct).toBe(1);
  });

  it('should increase difficulty with level', () => {
    const engine1 = new SequencesEngine();
    const { problem: p1 } = engine1.init(1);

    const engine10 = new SequencesEngine();
    const { problem: p10 } = engine10.init(10);

    // Level 1 has 3 terms, level 10 has 5 terms
    const count1 = p1.prompt.split(',').length;
    const count10 = p10.prompt.split(',').length;

    expect(count10).toBeGreaterThanOrEqual(count1);
  });

  it('should level up after 3 correct answers', () => {
    const engine = new SequencesEngine();
    let { state, problem } = engine.init(1);

    for (let i = 0; i < 3; i++) {
      const result = engine.next(state, problem.correctAnswer, 1000);
      state = result.state;
      problem = result.nextProblem;
    }

    expect(state.level).toBe(2);
  });

  it('should handle negative step sequences', () => {
    const engine = new SequencesEngine();

    // Generate many problems to get some decreasing sequences
    let foundDecreasing = false;
    for (let i = 0; i < 20; i++) {
      const { problem } = engine.init(5);
      const numbers = problem.prompt.split(',').map(s => parseInt(s.trim()));

      if (numbers[1] < numbers[0]) {
        foundDecreasing = true;
        break;
      }
    }

    expect(foundDecreasing).toBe(true);
  });
});
