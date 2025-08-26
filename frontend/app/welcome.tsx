import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ensureAnonSignIn } from '../services/firebase';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const BANNER_ID = process.env.EXPO_PUBLIC_ADMOB_BANNER_AD_UNIT_ID || TestIds.BANNER;

export default function Welcome() {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const continueAsGuest = async () => {
    try {
      setBusy(true);
      const user = await ensureAnonSignIn();
      await AsyncStorage.setItem('displayName', name.trim() || 'Guest');
      // You can POST to /api/users here if you want to create/update the profile now.
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

      <View style={{ height: 12 }} />
      <TouchableOpacity style={styles.secondary} onPress={() => Alert.alert('Coming soon', 'Google sign-in coming soon.')}>
        <Text style={styles.secondaryText}>Continue with Google</Text>
      </TouchableOpacity>
      <View style={{ height: 8 }} />
      <TouchableOpacity style={styles.secondary} onPress={() => Alert.alert('Coming soon', 'Email sign-in coming soon.')}>
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
