import { describe, it, expect } from 'vitest';
import { clamp, randInt, pick, formatTime, shuffle } from '../src/common';

describe('common utilities', () => {
  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('randInt', () => {
    it('should generate random integers within range', () => {
      for (let i = 0; i < 100; i++) {
        const val = randInt(1, 10);
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(10);
        expect(Number.isInteger(val)).toBe(true);
      }
    });
  });

  describe('pick', () => {
    it('should pick an element from array', () => {
      const arr = [1, 2, 3, 4, 5];
      const picked = pick(arr);
      expect(arr).toContain(picked);
    });
  });

  describe('formatTime', () => {
    it('should format seconds as MM:SS', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(59)).toBe('0:59');
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(125)).toBe('2:05');
      expect(formatTime(600)).toBe('10:00');
    });
  });

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const shuffled = shuffle(arr);

      expect(shuffled).toHaveLength(arr.length);
      expect(shuffled).not.toEqual(arr); // Very unlikely to be same
      expect(new Set(shuffled)).toEqual(new Set(arr)); // Same elements
    });

    it('should not modify original array', () => {
      const arr = [1, 2, 3];
      const original = [...arr];
      shuffle(arr);

      expect(arr).toEqual(original);
    });
  });
});
