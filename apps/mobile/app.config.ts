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
      `⚠️  [Cerveau Vif] Missing optional env vars: ${missingKeys.join(', ')}\n` +
      `   Services will run in no-op/stub mode. Add them to .env for full functionality.`
    );
  }

  return config;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = getEnvConfig();

  return {
    ...config,
    name: 'Cerveau Vif',
    slug: 'cerveau-vif',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    scheme: 'cerveauvif',
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
      bundleIdentifier: 'com.tonorg.cerveauvif',
      infoPlist: {
        UIBackgroundModes: [],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0a0a0a',
      },
      package: 'com.tonorg.cerveauvif',
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: ['expo-router'],
    extra: {
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
