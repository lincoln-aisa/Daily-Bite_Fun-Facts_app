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
        const name = await AsyncStorage.getItem('displayName');
        setInitial(name ? 'home' : 'welcome');
      } catch {
        setInitial('welcome');
      }
    })();
  }, []);

  if (!initial) return null;

  const initialRoute = initial === 'welcome' ? 'welcome' : 'index';

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <Stack
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#1a1a2e' } }}
      />
      {/* Fixed bottom bar is shown on non-welcome screens */}
      {initialRoute !== 'welcome' && <BottomBar />}
    </View>
  );
}
