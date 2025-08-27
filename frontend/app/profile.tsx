import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../services/firebase';
import { getUserStats } from '../services/apiService';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const BANNER_ID = process.env.EXPO_PUBLIC_ADMOB_BANNER_AD_UNIT_ID || TestIds.BANNER;

export default function ProfilePage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const uid = auth.currentUser?.uid || 'demo_user';
        const data = await getUserStats(uid);
        if (mounted) setStats(data || null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const streak = stats?.streak ?? 0;
  const totalPoints = stats?.total_points ?? 0;
  const totalGames = stats?.total_games ?? 0;
  const best = stats?.best_score ?? 0;
  const rate = stats?.success_rate ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Profile</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 160 }}>
        {loading ? (
          <ActivityIndicator />
        ) : stats ? (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{totalPoints}</Text>
                <Text style={styles.statLabel}>Total Points</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{totalGames}</Text>
                <Text style={styles.statLabel}>Puzzles</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏆 Highlights</Text>
              <Text style={{ color: '#fff', marginBottom: 6 }}>Best Score: {best}</Text>
              <Text style={{ color: '#fff' }}>Success Rate: {rate}%</Text>
            </View>
          </>
        ) : (
          <Text style={{ color: '#a0a0a0' }}>No stats yet. Play a puzzle!</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  backButton: { backgroundColor: '#45b7d1', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  backText: { color: '#ffffff', fontWeight: 'bold' },

  content: { flex: 1, padding: 20 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { backgroundColor: '#16213e', padding: 16, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#4ecdc4' },
  statLabel: { fontSize: 12, color: '#a0a0a0', marginTop: 4 },

  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, color: '#fff', marginBottom: 8, fontWeight: '600' },

  bottomArea: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#0f1626', paddingTop: 6,
  },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#16213e',
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#0f3460',
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabText: { fontSize: 12, color: '#a0a0a0' },
  tabActive: { backgroundColor: '#273c75' },
  tabTextActive: { color: '#fff', fontWeight: 'bold' },
});
