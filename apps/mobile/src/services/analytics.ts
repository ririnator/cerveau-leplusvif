/**
 * Analytics service - PostHog wrapper
 * Safe no-op if API key not configured
 */

import { getExpoConfig } from '../config/expo-config';

let POSTHOG_ENABLED = false;
let hasWarned = false;

export function initAnalytics(): void {
  const config = getExpoConfig();

  if (!config.POSTHOG_KEY) {
    if (!hasWarned) {
      console.warn('[Analytics] PostHog key not configured - running in no-op mode');
      hasWarned = true;
    }
    return;
  }

  POSTHOG_ENABLED = true;
  // TODO: Integrate PostHog SDK when ready
  // import PostHog from 'posthog-react-native';
  // PostHog.init(config.POSTHOG_KEY, { host: config.POSTHOG_HOST });
  console.log('[Analytics] PostHog initialized (stub mode)');
}

export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  if (!POSTHOG_ENABLED) {
    console.log('[Analytics]', eventName, properties);
    return;
  }
  // PostHog.capture(eventName, properties)
}

export function identifyUser(userId: string, traits?: Record<string, any>): void {
  if (!POSTHOG_ENABLED) return;
  // PostHog.identify(userId, traits)
}

// Specific event trackers
export function trackSessionStart(gameTypes: string[]): void {
  trackEvent('session_start', { games: gameTypes });
}

export function trackAnswer(
  gameType: string,
  correct: boolean,
  level: number,
  responseMs: number
): void {
  trackEvent('answer', { gameType, correct, level, responseMs });
}

export function trackLevelUp(gameType: string, newLevel: number): void {
  trackEvent('level_up', { gameType, newLevel });
}

export function trackSessionEnd(
  totalScore: number,
  accuracy: number,
  durationSec: number
): void {
  trackEvent('session_end', { totalScore, accuracy, durationSec });
}

export function trackPaywallView(source: string): void {
  trackEvent('paywall_view', { source });
}

export function trackPurchase(productId: string, price: number): void {
  trackEvent('purchase', { productId, price });
}
