import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../services/firebase';
import { getUserStats } from '../services/apiService';

export default function ProfilePage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const uid = auth.currentUser?.uid || 'demo_user';
      const data = await getUserStats(uid);
      if (mounted) { setStats(data); setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Profile</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator />
        ) : stats ? (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statBox}><Text style={styles.statNumber}>{stats.streak}</Text><Text style={styles.statLabel}>Day Streak</Text></View>
              <View style={styles.statBox}><Text style={styles.statNumber}>{stats.total_points}</Text><Text style={styles.statLabel}>Total Points</Text></View>
              <View style={styles.statBox}><Text style={styles.statNumber}>{stats.total_games}</Text><Text style={styles.statLabel}>Puzzles</Text></View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏆 Highlights</Text>
              <Text style={{ color: '#fff', marginBottom: 6 }}>Best Score: {stats.best_score}</Text>
              <Text style={{ color: '#fff' }}>Success Rate: {stats.success_rate}%</Text>
            </View>
          </>
        ) : (
          <Text style={{ color: '#a0a0a0' }}>No stats yet. Play a puzzle!</Text>
        )}
      </ScrollView>

      {/* 📌 Big banner ad */}
      <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <AdMobBanner
          adUnitID="ca-app-pub-3940256099942544/6300978111" // Test banner ID
          bannerSize="mediumRectangle"
          servePersonalizedAds={true}
          onDidFailToReceiveAdWithError={(err) => console.log('Ad error', err)}
        />
      </View>

      {/* Bottom navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => router.push('/')}>
          <Text style={styles.tabText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.activeTabText}>🏆 Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.push('/profile')}>
          <Text style={styles.tabText}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  backButton: { backgroundColor: '#45b7d1', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  backText: { color: '#ffffff', fontWeight: 'bold' },
  content: { flex: 1, padding: 20, paddingBottom: 120 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { backgroundColor: '#16213e', padding: 16, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#4ecdc4' },
  statLabel: { fontSize: 12, color: '#a0a0a0', marginTop: 4 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, color: '#fff', marginBottom: 8, fontWeight: '600' },
});
