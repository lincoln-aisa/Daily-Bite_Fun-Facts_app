// frontend/App.tsx
import React, { useEffect } from 'react';
import { ExpoRoot } from 'expo-router';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { ensureAnonSignIn, onAuth } from './services/firebase';

export default function App() {
  useEffect(() => {
    // Firebase anonymous auth
    ensureAnonSignIn().catch(console.log);
    const unsub = onAuth((uid) => console.log('Auth UID:', uid));
    // Mobile Ads init
    mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.T,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
      testDeviceIdentifiers: ['EMULATOR'],
    }).then(() => mobileAds().initialize());
    return () => unsub();
  }, []);

  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

