import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const KEYS = {
  BEST_STREAK: 'cv.bestStreak',
  CURRENT_STREAK: 'cv.currentStreak',
  LAST_PLAYED_AT: 'cv.lastPlayedAt',
  LAST_SESSION: 'cv.lastSession',
  SETTINGS: 'cv.settings',
  SETTINGS_SOUNDS: 'cv.settings.sounds',
  SETTINGS_HAPTICS: 'cv.settings.haptics',
  FREE_QUOTA_DATE: 'cv.freeQuota.date',
  FREE_QUOTA_COUNT: 'cv.freeQuota.count',
  IS_PRO: 'cv.isPro',
  FREEZES_LEFT: 'cv.streak.freezesLeft',
  LAST_FREEZE_RESET: 'cv.streak.lastFreezeReset',
  FREEZE_USED_MESSAGE: 'cv.streak.freezeUsedMessage',
  NOTIFICATIONS_ENABLED: 'cv.notifications.enabled',
  REMINDER_TIME: 'cv.notifications.reminderTime',
  HAS_COMPLETED_FIRST_SESSION: 'cv.onboarding.firstSessionComplete',
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

// Freeze management
export function getFreezesLeft(): number {
  return getNumber(KEYS.FREEZES_LEFT) ?? 1;
}

export function setFreezesLeft(value: number): void {
  setNumber(KEYS.FREEZES_LEFT, value);
}

export function getLastFreezeReset(): string | undefined {
  return getString(KEYS.LAST_FREEZE_RESET);
}

export function setLastFreezeReset(value: string): void {
  setString(KEYS.LAST_FREEZE_RESET, value);
}

export function getFreezeUsedMessage(): boolean {
  return getBoolean(KEYS.FREEZE_USED_MESSAGE) ?? false;
}

export function setFreezeUsedMessage(value: boolean): void {
  setBoolean(KEYS.FREEZE_USED_MESSAGE, value);
}

export function clearFreezeMessage(): void {
  setFreezeUsedMessage(false);
}

// Weekly freeze reset (every Monday)
export function resetWeeklyFreezeIfNeeded(): void {
  const today = new Date().toISOString().split('T')[0];
  const lastReset = getLastFreezeReset();
  const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday

  // If it's Monday and we haven't reset this week
  if (dayOfWeek === 1 && lastReset !== today) {
    const maxFreeze = isPro() ? 999 : 1; // Pro users get unlimited
    setFreezesLeft(maxFreeze);
    setLastFreezeReset(today);
  }
}

// Streak management with freeze mechanic
export function updateStreakOnSessionComplete(): {
  currentStreak: number;
  bestStreak: number;
  freezeUsed: boolean
} {
  const lastPlayed = getLastPlayedAt();
  const today = new Date().toISOString().split('T')[0];

  let currentStreak = getCurrentStreak();
  let bestStreak = getBestStreak();
  let freezeUsed = false;

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
      // Gap detected - check for freeze
      const freezesLeft = getFreezesLeft();

      if (freezesLeft > 0) {
        // Use freeze to save streak
        setFreezesLeft(freezesLeft - 1);
        setFreezeUsedMessage(true);
        freezeUsed = true;
        // Streak stays the same
      } else {
        // No freeze available - reset streak
        currentStreak = 1;
        setFreezeUsedMessage(false);
      }
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  setCurrentStreak(currentStreak);
  setBestStreak(bestStreak);
  setLastPlayedAt(new Date().toISOString());

  return { currentStreak, bestStreak, freezeUsed };
}

// Settings management
export function getSoundEnabled(): boolean {
  return getBoolean(KEYS.SETTINGS_SOUNDS) ?? true;
}

export function setSoundEnabled(value: boolean): void {
  setBoolean(KEYS.SETTINGS_SOUNDS, value);
}

export function getHapticsEnabled(): boolean {
  return getBoolean(KEYS.SETTINGS_HAPTICS) ?? true;
}

export function setHapticsEnabled(value: boolean): void {
  setBoolean(KEYS.SETTINGS_HAPTICS, value);
}

// Notification management
export function getNotificationsEnabled(): boolean {
  return getBoolean(KEYS.NOTIFICATIONS_ENABLED) ?? false;
}

export function setNotificationsEnabled(value: boolean): void {
  setBoolean(KEYS.NOTIFICATIONS_ENABLED, value);
}

export function getReminderTime(): string {
  return getString(KEYS.REMINDER_TIME) ?? '20:00';
}

export function setReminderTime(value: string): void {
  setString(KEYS.REMINDER_TIME, value);
}

export function getHasCompletedFirstSession(): boolean {
  return getBoolean(KEYS.HAS_COMPLETED_FIRST_SESSION) ?? false;
}

export function setHasCompletedFirstSession(value: boolean): void {
  setBoolean(KEYS.HAS_COMPLETED_FIRST_SESSION, value);
}
