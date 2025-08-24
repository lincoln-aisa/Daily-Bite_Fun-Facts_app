import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getHistoryEvents, getFunFact } from '../services/apiService';

export default function HomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [historyEvents, setHistoryEvents] = useState<Array<{year:string;text:string}>>([]);
  const [funFact, setFunFact] = useState<{ text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const [history, fact] = await Promise.all([
          getHistoryEvents(month, day),
          getFunFact(),
        ]);

        setHistoryEvents(history ?? []);
        setFunFact(fact ?? null);
      } catch (e: any) {
        console.log('HOME LOAD ERROR', e);
        setError('Could not load today’s content.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Daily Bite: Fun & Facts</Text>
        <Text style={styles.subtitle}>Your daily dose of history, facts & puzzles!</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 5-day streak</Text>
        </View>
      </View>

      {loading && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator />
          <Text style={{ color: '#a0a0a0', marginTop: 8 }}>Loading…</Text>
        </View>
      )}

      {error && (
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ color: '#ff6b6b' }}>{error}</Text>
        </View>
      )}

      {/* This Day in History (live) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📖 This Day in History</Text>
        {(historyEvents ?? []).slice(0, 3).map((ev, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.year}>{ev.year}</Text>
            <Text style={styles.eventText}>{ev.text}</Text>
          </View>
        ))}
        {!loading && historyEvents.length === 0 && (
          <Text style={{ color: '#a0a0a0' }}>No events found today.</Text>
        )}
      </View>

      {/* Fun Fact (live) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Fun Fact of the Day</Text>
        <View style={styles.factCard}>
          <Text style={styles.factText}>
            {funFact?.text ?? (loading ? '' : 'No fun fact available.')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧩 Daily Puzzle</Text>
        <TouchableOpacity
          style={styles.puzzleButton}
          onPress={() => router.push('/puzzle')}
        >
          <Text style={styles.puzzleButtonText}>Play Today's Puzzle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => router.push('/')}>
          <Text style={styles.activeTabText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.push('/leaderboard')}>
          <Text style={styles.tabText}>🏆 Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.push('/profile')}>
          <Text style={styles.tabText}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { alignItems: 'center', padding: 20, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#a0a0a0', textAlign: 'center', marginBottom: 20 },
  streakBadge: { backgroundColor: 'rgba(255, 107, 107, 0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  streakText: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 16 },
  section: { margin: 20, marginTop: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 15 },
  card: { backgroundColor: '#16213e', padding: 16, borderRadius: 12, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#4ecdc4' },
  year: { fontSize: 16, fontWeight: 'bold', color: '#4ecdc4', marginBottom: 8 },
  eventText: { fontSize: 14, color: '#ffffff', lineHeight: 20 },
  factCard: { backgroundColor: '#16213e', padding: 20, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f9ca24' },
  factText: { fontSize: 16, color: '#ffffff', lineHeight: 24, marginBottom: 10 },
  puzzleButton: { backgroundColor: '#45b7d1', padding: 20, borderRadius: 12, alignItems: 'center' },
  puzzleButtonText: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  tabBar: { flexDirection: 'row', backgroundColor: '#16213e', paddingVertical: 10, marginTop: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontSize: 14, color: '#a0a0a0' },
  activeTabText: { fontSize: 14, color: '#ffffff', fontWeight: 'bold' },
});
