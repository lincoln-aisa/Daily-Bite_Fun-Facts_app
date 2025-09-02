import React, { useEffect, useState } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import BottomBar from '../components/BottomBar';

export default function RootLayout() {
  const [loaded, setLoaded] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState<'1' | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    (async () => {
      const v = await AsyncStorage.getItem('hasOnboarded'); // strings only
      if (alive) setHasOnboarded(v ?? null);
    })();
    return () => { alive = false; };
  }, [pathname]);
  
  useEffect(() => {
    if (!loaded) return;
    if (hasOnboarded !== '1' && pathname !== '/welcome') router.replace('/welcome');
    if (hasOnboarded === '1' && pathname === '/welcome') router.replace('/');
  }, [loaded, hasOnboarded, pathname]);

  // Don’t render anything until we know where to send the user
  if (!loaded) return null;

  const showBottomBar = pathname !== '/welcome';
  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <Slot />
      {showBottomBar && <BottomBar />}
    </View>
  );
}

