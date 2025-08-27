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
    try {
      setBusy(true);
      await ensureAnonSignIn(); // guarantees auth.currentUser
      const uid = auth.currentUser?.uid;
      const displayName = name.trim() || 'Guest';

      await AsyncStorage.setItem('displayName', displayName);

      // Tell your backend about this user (so leaderboard/profile can resolve names)
      if (uid) {
        await submitUser({
          uid,
          display_name: displayName,
          is_anonymous: true,
        });
      }

      router.replace('/');
    } catch (e) {
      Alert.alert('Error', 'Could not sign in anonymously.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome to Daily Bite</Text>
      <Text style={styles.subtitle}>Sign in to save your streaks & points</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a display name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.primary} disabled={busy} onPress={continueAsGuest}>
        <Text style={styles.primaryText}>{busy ? 'Please wait…' : 'Continue as Guest'}</Text>
      </TouchableOpacity>

      {/* Add Google / Email later when ready */}
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
