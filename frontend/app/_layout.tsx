import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import BottomBar from '../components/BottomBar';

export default function RootLayout() {
  const [initial, setInitial] = useState<'welcome'|'home'|null>(null);

  useEffect(() => {
    (async () => {
      const name = await AsyncStorage.getItem('displayName');
      setInitial(name ? 'home' : 'welcome');
    })();
  }, []);

  if (!initial) return null;

  return (
    <View style={{ flex:1, backgroundColor:'#1a1a2e' }}>
      <Stack
        initialRouteName={initial === 'welcome' ? 'welcome' : 'index'}
        screenOptions={{ headerShown:false, contentStyle:{ backgroundColor:'#1a1a2e' } }}
      />
      {/* fixed bottom bar on top of native stack */}
      {initial !== 'welcome' && <BottomBar />}
    </View>
  );
}
