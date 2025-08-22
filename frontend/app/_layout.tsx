import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import useAppStore from '../store/appStore';
import { initializeAdMob } from '../lib/admob';

export default function RootLayout() {
  const { initializeApp } = useAppStore();

  useEffect(() => {
    // Initialize app data and AdMob
    const init = async () => {
      await initializeApp();
      await initializeAdMob();
    };
    init();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#1a1a2e" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </SafeAreaProvider>
  );
}