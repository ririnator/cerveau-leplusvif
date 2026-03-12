import { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Read environment variables with safe fallbacks
 * Warns once if critical keys are missing but doesn't crash
 */
function getEnvConfig() {
  const config = {
    POSTHOG_KEY: process.env.POSTHOG_KEY || '',
    POSTHOG_HOST: process.env.POSTHOG_HOST || 'https://eu.posthog.com',
    REVENUECAT_APPLE: process.env.REVENUECAT_APPLE || '',
    REVENUECAT_ANDROID: process.env.REVENUECAT_ANDROID || '',
  };

  // Warn once if analytics/payments keys are missing (non-blocking)
  const missingKeys: string[] = [];
  if (!config.POSTHOG_KEY) missingKeys.push('POSTHOG_KEY');
  if (!config.REVENUECAT_APPLE) missingKeys.push('REVENUECAT_APPLE');
  if (!config.REVENUECAT_ANDROID) missingKeys.push('REVENUECAT_ANDROID');

  if (missingKeys.length > 0) {
    console.warn(
      `⚠️  [Lucido] Missing optional env vars: ${missingKeys.join(', ')}\n` +
      `   Services will run in no-op/stub mode. Add them to .env for full functionality.`
    );
  }

  return config;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = getEnvConfig();

  return {
    ...config,
    name: 'Lucido',
    slug: 'lucido',
    version: '1.0.0',
    orientation: 'portrait',
    newArchEnabled: true,
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    scheme: 'lucido',
    runtimeVersion: {
      policy: 'appVersion',
    },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0a0a0a',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.ririapps.lucido.tyb',
      infoPlist: {
        UIBackgroundModes: [],
        CFBundleDisplayName: 'Lucido',
        NSUserNotificationsUsageDescription: 'Lucido vous envoie des rappels quotidiens pour maintenir votre série d\'entraînement.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0a0a0a',
      },
      package: 'com.ririapps.lucido.tyb',
      permissions: [
        'android.permission.POST_NOTIFICATIONS',
        'android.permission.SCHEDULE_EXACT_ALARM',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      'expo-router',
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#8ab4ff',
          sounds: [],
        },
      ],
    ],
    extra: {
      MARKETING_NAME: 'Lucido – Train Your Brain',
      POSTHOG_KEY: env.POSTHOG_KEY,
      POSTHOG_HOST: env.POSTHOG_HOST,
      REVENUECAT_APPLE: env.REVENUECAT_APPLE,
      REVENUECAT_ANDROID: env.REVENUECAT_ANDROID,
      eas: {
        projectId: 'your-eas-project-id', // Replace when setting up EAS
      },
    },
  };
};
