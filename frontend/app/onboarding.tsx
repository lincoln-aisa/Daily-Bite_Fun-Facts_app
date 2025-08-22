import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import useAppStore from '../store/appStore';

export default function Onboarding() {
  const router = useRouter();
  const { setUser } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    Alert.alert(
      'Google Sign-In',
      'Google Sign-In would be implemented here. For now, signing in as guest.'
    );
    handleGuestSignIn();
  };

  const handleEmailSignIn = async () => {
    Alert.alert(
      'Email Sign-In',
      'Email Sign-In would be implemented here. For now, signing in as guest.'
    );
    handleGuestSignIn();
  };

  const handleGuestSignIn = async () => {
    try {
      setLoading(true);
      const userCredential = await signInAnonymously(auth);
      setUser(userCredential.user);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in as guest. Please try again.');
      console.error('Guest sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="book" size={60} color="#ff6b6b" />
            </View>
            <Text style={styles.title}>Daily Bite: Fun & Facts</Text>
            <Text style={styles.subtitle}>
              Your daily dose of history, facts & puzzles!
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.featureList}>
              <View style={styles.feature}>
                <Ionicons name="calendar" size={24} color="#4ecdc4" />
                <Text style={styles.featureText}>Daily historical events</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="bulb" size={24} color="#45b7d1" />
                <Text style={styles.featureText}>Amazing fun facts</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="puzzle" size={24} color="#f9ca24" />
                <Text style={styles.featureText}>Brain-teasing puzzles</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="trophy" size={24} color="#ff6b6b" />
                <Text style={styles.featureText}>Compete on leaderboards</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.googleButton]}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Ionicons name="logo-google" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.emailButton]}
              onPress={handleEmailSignIn}
              disabled={loading}
            >
              <Ionicons name="mail" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Continue with Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.guestButton]}
              onPress={handleGuestSignIn}
              disabled={loading}
            >
              <Ionicons name="person" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  featureList: {
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 15,
    flex: 1,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
  },
  googleButton: {
    backgroundColor: '#db4437',
  },
  emailButton: {
    backgroundColor: '#4285f4',
  },
  guestButton: {
    backgroundColor: '#555555',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});