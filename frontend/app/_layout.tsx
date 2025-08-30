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
    (async () => {
      try {
        const flag = await AsyncStorage.getItem('hasOnboarded'); // '1' when welcome continues
        setHasOnboarded(flag === '1' ? '1' : null);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Hard redirect to /welcome until hasOnboarded === '1'
  useEffect(() => {
    if (!loaded) return;
    if (hasOnboarded !== '1' && pathname !== '/welcome') {
      router.replace('/welcome');
    }
  }, [loaded, hasOnboarded, pathname, router]);


useEffect(() => {
  if (!loaded) return;
  (async () => {
    const flag = await AsyncStorage.getItem('hasOnboarded');
    const onboarded = flag === '1';
    if (!onboarded && pathname !== '/welcome') {
      router.replace('/welcome');
    }
  })();
}, [loaded, pathname, router]);

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

