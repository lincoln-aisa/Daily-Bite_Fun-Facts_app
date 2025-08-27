// frontend/services/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  signInAnonymously,
  Auth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Read config from EAS env (add these in Expo/EAS variables)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,     // e.g. yourapp.firebaseapp.com
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!, // e.g. yourapp.appspot.com
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,               // from Firebase config
};

const app = initializeApp(firebaseConfig);

// IMPORTANT: use RN persistence so the UID survives app restarts
export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export async function ensureAnonSignIn(): Promise<string> {
  if (auth.currentUser?.uid) return auth.currentUser.uid;
  const cred = await signInAnonymously(auth);
  return cred.user.uid;
}

export function onAuth(cb: (uid: string | null) => void) {
  return onAuthStateChanged(auth, (u) => cb(u?.uid ?? null));
}
