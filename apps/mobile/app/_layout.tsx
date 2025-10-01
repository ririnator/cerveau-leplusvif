import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { initAnalytics } from '../src/services/analytics';
import { initPurchases } from '../src/services/payments';

export default function RootLayout() {
  useEffect(() => {
    initAnalytics();
    initPurchases();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a0a' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="session/index" />
        <Stack.Screen name="recap/index" />
        <Stack.Screen name="paywall/index" />
        <Stack.Screen name="settings/index" />
      </Stack>
    </>
  );
}
