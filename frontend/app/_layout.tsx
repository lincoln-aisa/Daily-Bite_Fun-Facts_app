import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import BottomBar from '../components/BottomBar';

export default function RootLayout() {
  const [initial, setInitial] = useState<'welcome' | 'home' | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
        setInitial(hasOnboarded === '1' ? 'home' : 'welcome');
      } catch {
        // fail-safe: show welcome
        setInitial('welcome');
      }
    })();
  }, []);

  if (!initial) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <Stack
        initialRouteName={initial === 'welcome' ? 'welcome' : 'index'}
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#1a1a2e' } }}
      />
      {initial !== 'welcome' && <BottomBar />}
    </View>
  );
}
