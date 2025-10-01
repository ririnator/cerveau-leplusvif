import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const KEYS = {
  BEST_STREAK: 'cv.bestStreak',
  CURRENT_STREAK: 'cv.currentStreak',
  LAST_PLAYED_AT: 'cv.lastPlayedAt',
  LAST_SESSION: 'cv.lastSession',
  SETTINGS: 'cv.settings',
  FREE_QUOTA_DATE: 'cv.freeQuota.date',
  FREE_QUOTA_COUNT: 'cv.freeQuota.count',
  IS_PRO: 'cv.isPro',
} as const;

// Generic helpers
export function getString(key: string): string | undefined {
  return storage.getString(key);
}

export function setString(key: string, value: string): void {
  storage.set(key, value);
}

export function getNumber(key: string): number | undefined {
  return storage.getNumber(key);
}

export function setNumber(key: string, value: number): void {
  storage.set(key, value);
}

export function getBoolean(key: string): boolean | undefined {
  return storage.getBoolean(key);
}

export function setBoolean(key: string, value: boolean): void {
  storage.set(key, value);
}

export function getJSON<T>(key: string): T | null {
  const str = storage.getString(key);
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}

export function setJSON<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

export function remove(key: string): void {
  storage.delete(key);
}

export function clear(): void {
  storage.clearAll();
}

// Specific getters/setters
export function getBestStreak(): number {
  return getNumber(KEYS.BEST_STREAK) ?? 0;
}

export function setBestStreak(value: number): void {
  setNumber(KEYS.BEST_STREAK, value);
}

export function getCurrentStreak(): number {
  return getNumber(KEYS.CURRENT_STREAK) ?? 0;
}

export function setCurrentStreak(value: number): void {
  setNumber(KEYS.CURRENT_STREAK, value);
}

export function getLastPlayedAt(): string | undefined {
  return getString(KEYS.LAST_PLAYED_AT);
}

export function setLastPlayedAt(value: string): void {
  setString(KEYS.LAST_PLAYED_AT, value);
}

export function getLastSession<T>(): T | null {
  return getJSON<T>(KEYS.LAST_SESSION);
}

export function setLastSession<T>(value: T): void {
  setJSON(KEYS.LAST_SESSION, value);
}

export function isPro(): boolean {
  return getBoolean(KEYS.IS_PRO) ?? false;
}

export function setIsPro(value: boolean): void {
  setBoolean(KEYS.IS_PRO, value);
}

// Free quota management
export function getTodayQuotaUsed(): number {
  const today = new Date().toISOString().split('T')[0];
  const savedDate = getString(KEYS.FREE_QUOTA_DATE);

  if (savedDate !== today) {
    // New day - reset quota
    setString(KEYS.FREE_QUOTA_DATE, today);
    setNumber(KEYS.FREE_QUOTA_COUNT, 0);
    return 0;
  }

  return getNumber(KEYS.FREE_QUOTA_COUNT) ?? 0;
}

export function incrementQuotaUsed(): void {
  const today = new Date().toISOString().split('T')[0];
  setString(KEYS.FREE_QUOTA_DATE, today);
  const current = getTodayQuotaUsed();
  setNumber(KEYS.FREE_QUOTA_COUNT, current + 1);
}

export function canPlayToday(): boolean {
  if (isPro()) return true;
  return getTodayQuotaUsed() < 1;
}

// Streak management
export function updateStreakOnSessionComplete(): { currentStreak: number; bestStreak: number } {
  const lastPlayed = getLastPlayedAt();
  const today = new Date().toISOString().split('T')[0];

  let currentStreak = getCurrentStreak();
  let bestStreak = getBestStreak();

  if (!lastPlayed) {
    // First session
    currentStreak = 1;
  } else {
    const lastDate = new Date(lastPlayed).toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (lastDate === today) {
      // Already played today - no change to streak
    } else if (lastDate === yesterday) {
      // Consecutive day
      currentStreak += 1;
    } else {
      // Streak broken
      currentStreak = 1;
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  setCurrentStreak(currentStreak);
  setBestStreak(bestStreak);
  setLastPlayedAt(new Date().toISOString());

  return { currentStreak, bestStreak };
}
