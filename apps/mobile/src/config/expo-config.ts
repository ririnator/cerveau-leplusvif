import Constants from 'expo-constants';

/**
 * Type-safe access to Expo config extra fields
 */
interface ExpoExtraConfig {
  POSTHOG_KEY: string;
  POSTHOG_HOST: string;
  REVENUECAT_APPLE: string;
  REVENUECAT_ANDROID: string;
}

/**
 * Get Expo config with type safety and defaults
 */
export function getExpoConfig(): ExpoExtraConfig {
  const extra = Constants.expoConfig?.extra || {};

  return {
    POSTHOG_KEY: extra.POSTHOG_KEY || '',
    POSTHOG_HOST: extra.POSTHOG_HOST || 'https://eu.posthog.com',
    REVENUECAT_APPLE: extra.REVENUECAT_APPLE || '',
    REVENUECAT_ANDROID: extra.REVENUECAT_ANDROID || '',
  };
}
