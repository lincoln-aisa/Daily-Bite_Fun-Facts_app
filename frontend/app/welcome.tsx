// frontend/app/welcome.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ensureAnonSignIn, googleSignIn, emailSignIn } from '../services/firebase';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { getAuth } from 'firebase/auth';
import { submitUser } from '../services/apiService';

const BANNER_ID = process.env.EXPO_PUBLIC_ADMOB_BANNER_AD_UNIT_ID || TestIds.BANNER;

export default function Welcome() {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const continueAsGuest = async () => {
    try {
      setBusy(true);
      const user = await ensureAnonSignIn();
      const displayName = name.trim() || 'Guest';
      await AsyncStorage.setItem('displayName', displayName);

      // Call backend to create/update the user
      await submitUser({
        uid: user.uid || 'demo_user',
        display_name: displayName,
        is_anonymous: true,
        email: null,
      });

      router.replace('/');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not sign in anonymously.');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await googleSignIn();
      if (user) {
        await AsyncStorage.setItem('displayName', user.displayName || 'User');
        await submitUser({
          uid: user.uid,
          display_name: user.displayName,
          is_anonymous: false,
          email: user.email,
        });
        router.replace('/');
      }
    } catch (e) {
      Alert.alert('Error', 'Google sign-in failed.');
    }
  };

  const handleEmailSignIn = async () => {
    try {
      const user = await emailSignIn();
      if (user) {
        await AsyncStorage.setItem('displayName', user.displayName || 'User');
        await submitUser({
          uid: user.uid,
          display_name: user.displayName,
          is_anonymous: false,
          email: user.email,
        });
        router.replace('/');
      }
    } catch (e) {
      Alert.alert('Error', 'Email sign-in failed.');
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

      <View style={{ height: 12 }} />
      <TouchableOpacity style={styles.secondary} onPress={handleGoogleSignIn}>
        <Text style={styles.secondaryText}>Continue with Google</Text>
      </TouchableOpacity>
      <View style={{ height: 8 }} />
      <TouchableOpacity style={styles.secondary} onPress={handleEmailSignIn}>
        <Text style={styles.secondaryText}>Continue with Email</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 30, alignItems: 'center' }}>
        <BannerAd unitId={BANNER_ID} size={BannerAdSize.LARGE_BANNER} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#1a1a2e', padding:20, paddingTop:80 },
  title: { color:'#fff', fontSize:28, fontWeight:'bold', marginBottom:8 },
  subtitle: { color:'#a0a0a0', marginBottom:20 },
  input: { backgroundColor:'#16213e', color:'#fff', borderRadius:10, paddingHorizontal:14, paddingVertical:12 },
  primary: { backgroundColor:'#45b7d1', padding:14, borderRadius:12, marginTop:16, alignItems:'center' },
  primaryText: { color:'#fff', fontWeight:'bold' },
  secondary: { backgroundColor:'#16213e', padding:12, borderRadius:10, alignItems:'center' },
  secondaryText: { color:'#fff' },
});
