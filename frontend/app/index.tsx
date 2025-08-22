import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import useAppStore from '../store/appStore';

export default function Index() {
  const router = useRouter();
  const { setUser, updateStreak } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // User is signed in, update streak and go to main app
        await updateStreak();
        router.replace('/(tabs)');
      } else {
        // User is not signed in, go to onboarding
        router.replace('/onboarding');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      {/* Loading screen - authentication check happening */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});