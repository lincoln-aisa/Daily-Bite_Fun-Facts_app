// frontend/App.tsx
import React, { useEffect } from 'react';
import { ExpoRoot } from 'expo-router';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { ensureAnonSignIn, onAuth } from './services/firebase';

export default function App() {
  useEffect(() => {
    // Ensure a real UID for every device (anonymous if not signed in)
    ensureAnonSignIn().catch(console.log);
    const unsubAuth = onAuth((uid) => console.log('Auth UID:', uid));

    // Initialize AdMob once
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
