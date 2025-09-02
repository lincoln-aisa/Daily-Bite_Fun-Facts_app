// frontend/app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Slot, usePathname, Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomBar from '../components/BottomBar';

type Status = 'checking' | 'welcome' | 'app';

export default function RootLayout() {
  const [status, setStatus] = useState<Status>('checking');
  const pathname = usePathname();

  // 1) Initial check once on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const v = await AsyncStorage.getItem('hasOnboarded');
        if (!alive) return;
        setStatus(v === '1' ? 'app' : 'welcome');
      } catch (e) {
        // Fail-open to app so we at least render something
        if (alive) setStatus('app');
      }
    })();
    return () => { alive = false; };
  }, []);

  // 2) Re-check whenever the route changes (so Welcome → Home is reflected)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const v = await AsyncStorage.getItem('hasOnboarded');
        if (!alive) return;
        setStatus(v === '1' ? 'app' : 'welcome');
      } catch {
        if (alive) setStatus('app');
      }
    })();
    return () => { alive = false; };
  }, [pathname]);

  // 3) While checking, show a simple loader (avoid returning null forever)
  if (status === 'checking') {
    return (
      <View style={{ flex: 1, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // 4) Hard gate using Redirect to avoid loops & blank screens
  if (status === 'welcome' && pathname !== '/welcome') {
    return <Redirect href="/welcome" />;
  }
  if (status === 'app' && pathname === '/welcome') {
    return <Redirect href="/" />;
  }

  const showBottomBar = pathname !== '/welcome';

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <Slot />
      {showBottomBar && <BottomBar />}
    </View>
  );
}
