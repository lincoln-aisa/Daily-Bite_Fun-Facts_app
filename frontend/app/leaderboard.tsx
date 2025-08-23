import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LeaderboardPage() {
  const router = useRouter();
  
  const leaderboard = [
    { rank: 1, name: "Alice Johnson", score: 1250 },
    { rank: 2, name: "Bob Smith", score: 1180 },
    { rank: 3, name: "You", score: 1120 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {leaderboard.map((player, index) => (
          <View key={index} style={[styles.playerRow, player.name === "You" && styles.userRow]}>
            <Text style={styles.rank}>{player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : player.rank === 3 ? "🥉" : `${player.rank}th`}</Text>
            <Text style={[styles.playerName, player.name === "You" && styles.userText]}>{player.name}</Text>
            <Text style={[styles.score, player.name === "You" && styles.userText]}>{player.score} pts</Text>
          </View>
        ))}
      </ScrollView>
      
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
  content: { flex: 1, padding: 20 },
  playerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', padding: 15, borderRadius: 12, marginBottom: 10 },
  userRow: { backgroundColor: 'rgba(255, 107, 107, 0.1)', borderWidth: 2, borderColor: '#ff6b6b' },
  rank: { fontSize: 16, fontWeight: 'bold', color: '#f9ca24', width: 50 },
  playerName: { fontSize: 16, color: '#ffffff', flex: 1 },
  score: { fontSize: 14, color: '#4ecdc4', fontWeight: 'bold' },
  userText: { color: '#ff6b6b' },
  tabBar: { flexDirection: 'row', backgroundColor: '#16213e', paddingVertical: 10 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontSize: 14, color: '#a0a0a0' },
  activeTabText: { fontSize: 14, color: '#ffffff', fontWeight: 'bold' },
});