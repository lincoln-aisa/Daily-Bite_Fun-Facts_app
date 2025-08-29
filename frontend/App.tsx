// frontend/App.tsx
import React, { useEffect } from 'react';
import { ExpoRoot } from 'expo-router';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { ensureAnonSignIn, onAuth } from './services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitUser } from './services/apiService';

export default function App() {
  useEffect(() => {
    // Ensure a stable Firebase UID
    ensureAnonSignIn().catch(console.log);

    // Log auth changes (optional)
    const unsubAuth = onAuth(async (uid) => {
      console.log('Auth UID:', uid);
      if (uid) {
        // Make sure the backend has a user row for this UID
        const displayName = (await AsyncStorage.getItem('displayName')) || 'Guest';
        await submitUser({ uid, display_name: displayName, is_anonymous: true }).catch(() => {});
      }
    });

    // Initialize AdMob
    mobileAds()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.T,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
        testDeviceIdentifiers: ['EMULATOR'],
      })
      .then(() => mobileAds().initialize())
      .catch((e) => console.log('Ads init error', e));

    return () => unsubAuth();
  }, []);

  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}
