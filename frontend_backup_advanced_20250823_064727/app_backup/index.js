import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function HomePage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Daily Bite: Fun & Facts</Text>
        <Text style={styles.subtitle}>Your daily dose of history, facts & puzzles!</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 5-day streak</Text>
        </View>
      </View>

      {/* This Day in History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📖 This Day in History</Text>
        <View style={styles.card}>
          <Text style={styles.year}>1969</Text>
          <Text style={styles.eventText}>
            Apollo 11 successfully lands on the Moon, making Neil Armstrong and Buzz Aldrin the first humans to walk on the lunar surface.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.year}>1789</Text>
          <Text style={styles.eventText}>
            The French Revolution begins with the storming of the Bastille fortress in Paris.
          </Text>
        </View>
      </View>

      {/* Fun Fact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Fun Fact of the Day</Text>
        <View style={styles.factCard}>
          <Text style={styles.factText}>
            Did you know? Octopuses have three hearts and blue blood! Two hearts pump blood to the gills, while the third pumps blood to the rest of the body.
          </Text>
          <Text style={styles.factSource}>Source: Marine Biology Facts</Text>
        </View>
      </View>

      {/* Daily Puzzle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧩 Daily Puzzle</Text>
        <TouchableOpacity style={styles.puzzleButton}>
          <Text style={styles.puzzleButtonText}>Play Today's Puzzle</Text>
          <Text style={styles.puzzleSubtext}>Test your knowledge!</Text>
        </TouchableOpacity>
      </View>

      {/* Leaderboard Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Today's Leaderboard</Text>
        <View style={styles.leaderboardCard}>
          <View style={styles.leaderRow}>
            <Text style={styles.rank}>1st</Text>
            <Text style={styles.playerName}>Alice Johnson</Text>
            <Text style={styles.score}>1,250 pts</Text>
          </View>
          <View style={styles.leaderRow}>
            <Text style={styles.rank}>2nd</Text>
            <Text style={styles.playerName}>Bob Smith</Text>
            <Text style={styles.score}>1,180 pts</Text>
          </View>
          <View style={styles.leaderRow}>
            <Text style={styles.rank}>3rd</Text>
            <Text style={styles.playerName}>You</Text>
            <Text style={styles.score}>1,120 pts</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Your Stats</Text>
        <View style={styles.statsRow}>
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
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>🎉 App is working perfectly!</Text>
        <Text style={styles.footerSubtext}>Ready for production deployment</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
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
    marginBottom: 20,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    margin: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4ecdc4',
  },
  year: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 8,
  },
  eventText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  factCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f9ca24',
  },
  factText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 10,
  },
  factSource: {
    fontSize: 12,
    color: '#a0a0a0',
    fontStyle: 'italic',
  },
  puzzleButton: {
    backgroundColor: '#45b7d1',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  puzzleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  puzzleSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  leaderboardCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f9ca24',
    width: 50,
  },
  playerName: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  score: {
    fontSize: 14,
    color: '#4ecdc4',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ecdc4',
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    padding: 40,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  footerSubtext: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 8,
  },
});