/**
 * Streak service with freeze mechanic
 * Manages daily streak tracking with weekly freeze resets
 */

import {
  getCurrentStreak,
  getBestStreak,
  getLastPlayedAt,
  getFreezesLeft,
  updateStreakOnSessionComplete,
  resetWeeklyFreezeIfNeeded,
  getFreezeUsedMessage,
  clearFreezeMessage,
  isPro,
} from './storage';

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  freezesLeft: number;
  lastPlayed: string | undefined;
  showFreezeMessage: boolean;
}

/**
 * Get current streak information
 */
export function getStreakInfo(): StreakInfo {
  // Reset weekly freeze if needed (Monday check)
  resetWeeklyFreezeIfNeeded();

  return {
    currentStreak: getCurrentStreak(),
    bestStreak: getBestStreak(),
    freezesLeft: getFreezesLeft(),
    lastPlayed: getLastPlayedAt(),
    showFreezeMessage: getFreezeUsedMessage(),
  };
}

/**
 * Update streak when a session is completed
 * Returns updated streak info with freeze status
 */
export function updateStreak(): StreakInfo {
  const result = updateStreakOnSessionComplete();

  return {
    currentStreak: result.currentStreak,
    bestStreak: result.bestStreak,
    freezesLeft: getFreezesLeft(),
    lastPlayed: getLastPlayedAt(),
    showFreezeMessage: result.freezeUsed,
  };
}

/**
 * Clear the freeze used message (after user sees it)
 */
export function dismissFreezeMessage(): void {
  clearFreezeMessage();
}

/**
 * Calculate days since last played
 */
export function getDaysSinceLastPlayed(): number {
  const lastPlayed = getLastPlayedAt();
  if (!lastPlayed) return 0;

  const lastDate = new Date(lastPlayed);
  const today = new Date();

  const diffMs = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Check if user has played today
 */
export function hasPlayedToday(): boolean {
  const lastPlayed = getLastPlayedAt();
  if (!lastPlayed) return false;

  const lastDate = new Date(lastPlayed).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  return lastDate === today;
}

/**
 * Get max freezes for current user (pro vs free)
 */
export function getMaxFreezesPerWeek(): number {
  return isPro() ? 999 : 1;
}
