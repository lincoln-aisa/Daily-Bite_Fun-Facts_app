import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Profile</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsSection}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1,120</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Puzzles Solved</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementTitle}>🔥 Week Warrior</Text>
            <Text style={styles.achievementDesc}>7-day streak achieved!</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementTitle}>📚 Knowledge Seeker</Text>
            <Text style={styles.achievementDesc}>Solved 10+ puzzles</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => router.push('/')}>
          <Text style={styles.tabText}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.push('/leaderboard')}>
          <Text style={styles.tabText}>🏆 Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.activeTabText}>👤 Profile</Text>
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
  statsSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statBox: { backgroundColor: '#16213e', padding: 16, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#4ecdc4' },
  statLabel: { fontSize: 12, color: '#a0a0a0', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 15 },
  achievementCard: { backgroundColor: '#16213e', padding: 16, borderRadius: 12, marginBottom: 10 },
  achievementTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  achievementDesc: { fontSize: 14, color: '#a0a0a0', marginTop: 4 },
  tabBar: { flexDirection: 'row', backgroundColor: '#16213e', paddingVertical: 10 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontSize: 14, color: '#a0a0a0' },
  activeTabText: { fontSize: 14, color: '#ffffff', fontWeight: 'bold' },
});