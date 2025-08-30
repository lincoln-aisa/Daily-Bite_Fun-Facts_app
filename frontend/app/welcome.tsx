// frontend/app/welcome.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ensureAnonSignIn, auth } from '../services/firebase';
import { submitUser } from '../services/apiService';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const BANNER_ID = process.env.EXPO_PUBLIC_ADMOB_BANNER_AD_UNIT_ID || TestIds.BANNER;

export default function Welcome() {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const continueAsGuest = async () => {
    if (busy) return;
    try {
      setBusy(true);

      // 1) Validate name
      const chosenName = name.trim();
      if (!chosenName) {
        Alert.alert('Name required', 'Please enter a display name.');
        setBusy(false);
        return;
      }

      // 2) Ensure Firebase gives us a UID (anonymous if not signed in)
      await ensureAnonSignIn();
      const uid = auth.currentUser?.uid;

      // 3) Save locally for later use
      await AsyncStorage.setItem('displayName', chosenName);
      await AsyncStorage.setItem('hasOnboarded', '1');   // ✅ the missing piece

      // 4) Tell backend (fire-and-forget)
      if (uid) {
        submitUser({
          uid,
          display_name: chosenName,
          is_anonymous: true,
        }).catch((e) => console.log('submitUser failed (non-blocking):', e));
      }

      // 5) Navigate to home, replacing welcome
      router.replace('/');
    } catch (e) {
      console.log('Welcome error:', e);
      Alert.alert('Error', 'Could not complete sign-in.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome to Daily Bite</Text>
      <Text style={styles.subtitle}>Save your streaks & points across sessions</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a display name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TouchableOpacity style={styles.primary} disabled={busy} onPress={continueAsGuest}>
        <Text style={styles.primaryText}>{busy ? 'Please wait…' : 'Continue as Guest'}</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 30, alignItems: 'center' }}>
        <BannerAd unitId={BANNER_ID} size={BannerAdSize.LARGE_BANNER} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 20, paddingTop: 80 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#a0a0a0', marginBottom: 20 },
  input: { backgroundColor: '#16213e', color: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  primary: { backgroundColor: '#45b7d1', padding: 14, borderRadius: 12, marginTop: 16, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: 'bold' },
});
