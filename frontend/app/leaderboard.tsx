import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getLeaderboard } from '../services/apiService';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const BANNER_ID = process.env.EXPO_PUBLIC_ADMOB_BANNER_AD_UNIT_ID || TestIds.BANNER;

type Row = { user_name?: string; score?: number; total_score?: number; rank: number };

export default function LeaderboardPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getLeaderboard('today');
        const normalized: Row[] = (data ?? []).map((r: any) => ({
          user_name: r.user_name ?? 'Anonymous',
          score: r.score ?? r.total_score ?? 0,
          rank: r.rank ?? 0,
        }));
        setRows(normalized);
      } catch (e) {
        console.log('LEADERBOARD LOAD ERROR', e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 160 }}>
        {loading ? (
          <ActivityIndicator />
        ) : rows.length > 0 ? (
          rows.map((player, index) => (
            <View key={index} style={styles.playerRow}>
              <Text style={styles.rank}>
                {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `${player.rank}th`}
              </Text>
              <Text style={styles.playerName}>{player.user_name}</Text>
              <Text style={styles.score}>{player.score} pts</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: '#a0a0a0' }}>No leaderboard data yet.</Text>
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

  playerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', padding: 15, borderRadius: 12, marginBottom: 10 },
  rank: { fontSize: 16, fontWeight: 'bold', color: '#f9ca24', width: 50 },
  playerName: { fontSize: 16, color: '#ffffff', flex: 1 },
  score: { fontSize: 14, color: '#4ecdc4', fontWeight: 'bold' },

});
