import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

console.log("APP MOUNT: App.tsx constructing");

export default function App() {
  console.log("APP RENDER: App component rendering");
  const [activeTab, setActiveTab] = useState('home');
  const [score, setScore] = useState(0);

  const handlePuzzlePlay = () => {
    Alert.alert("Puzzle", "What is the largest planet in our solar system?", [
      { text: "Earth", onPress: () => Alert.alert("Wrong!", "Try again") },
      { text: "Jupiter", onPress: () => { setScore(score + 100); Alert.alert("Correct! 🎉", "You earned 100 points!"); } },
      { text: "Mars", onPress: () => Alert.alert("Wrong!", "Try again") },
      { text: "Saturn", onPress: () => Alert.alert("Wrong!", "Try again") },
    ]);
  };

  const renderHomeScreen = () => (
    <ScrollView style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Daily Bite: Fun & Facts</Text>
        <Text style={styles.subtitle}>Your daily dose of history, facts & puzzles!</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 5-day streak</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📖 This Day in History</Text>
        <View style={styles.card}>
          <Text style={styles.year}>1969</Text>
          <Text style={styles.eventText}>
            Apollo 11 successfully lands on the Moon, making Neil Armstrong and Buzz Aldrin the first humans to walk on the lunar surface.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Fun Fact of the Day</Text>
        <View style={styles.factCard}>
          <Text style={styles.factText}>
            Did you know? Octopuses have three hearts and blue blood! Two hearts pump blood to the gills, while the third pumps blood to the rest of the body.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧩 Daily Puzzle</Text>
        <TouchableOpacity style={styles.puzzleButton} onPress={handlePuzzlePlay}>
          <Text style={styles.puzzleButtonText}>Play Today's Puzzle</Text>
          <Text style={styles.puzzleSubtext}>Current Score: {score}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderPuzzleScreen = () => (
    <ScrollView style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🧩 Daily Puzzle</Text>
        <Text style={styles.subtitle}>Test your knowledge!</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.question}>What is the largest planet in our solar system?</Text>
        {['Jupiter', 'Saturn', 'Earth', 'Mars'].map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={styles.answerButton}
            onPress={() => {
              if (answer === 'Jupiter') {
                setScore(score + 100);
                Alert.alert("Correct! 🎉", "You earned 100 points!");
              } else {
                Alert.alert("Wrong Answer 😔", "The correct answer was Jupiter");
              }
            }}
          >
            <Text style={styles.answerText}>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderLeaderboardScreen = () => (
    <ScrollView style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <Text style={styles.subtitle}>Today's Top Scores</Text>
      </View>
      <View style={styles.section}>
        {[
          { rank: 1, name: "Alice Johnson", score: 1250 },
          { rank: 2, name: "Bob Smith", score: 1180 },
          { rank: 3, name: "You", score: score + 1020 },
        ].map((player, index) => (
          <View key={index} style={[styles.playerRow, player.name === "You" && styles.userRow]}>
            <Text style={styles.rank}>{player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉"}</Text>
            <Text style={[styles.playerName, player.name === "You" && styles.userText]}>{player.name}</Text>
            <Text style={[styles.scoreText, player.name === "You" && styles.userText]}>{player.score} pts</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderProfileScreen = () => (
    <ScrollView style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Profile</Text>
        <Text style={styles.subtitle}>Your Daily Bite Stats</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{score + 1020}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Puzzles</Text>
          </View>
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
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHomeScreen();
      case 'puzzle': return renderPuzzleScreen();
      case 'leaderboard': return renderLeaderboardScreen();
      case 'profile': return renderProfileScreen();
      default: return renderHomeScreen();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'home' && styles.activeTab]}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
            🏠 Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'puzzle' && styles.activeTab]}
          onPress={() => setActiveTab('puzzle')}
        >
          <Text style={[styles.tabText, activeTab === 'puzzle' && styles.activeTabText]}>
            🧩 Puzzle
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>
            🏆 Leaderboard
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            👤 Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  contentContainer: { flex: 1 },
  content: { flex: 1 },
  header: { alignItems: 'center', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#a0a0a0', textAlign: 'center', marginBottom: 20 },
  streakBadge: { backgroundColor: 'rgba(255, 107, 107, 0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  streakText: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 16 },
  section: { margin: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 15 },
  card: { backgroundColor: '#16213e', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#4ecdc4' },
  year: { fontSize: 16, fontWeight: 'bold', color: '#4ecdc4', marginBottom: 8 },
  eventText: { fontSize: 14, color: '#ffffff', lineHeight: 20 },
  factCard: { backgroundColor: '#16213e', padding: 20, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f9ca24' },
  factText: { fontSize: 16, color: '#ffffff', lineHeight: 24 },
  puzzleButton: { backgroundColor: '#45b7d1', padding: 20, borderRadius: 12, alignItems: 'center' },
  puzzleButtonText: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  puzzleSubtext: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  question: { fontSize: 18, color: '#ffffff', textAlign: 'center', marginBottom: 30, lineHeight: 26 },
  answerButton: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  answerText: { fontSize: 16, color: '#ffffff', fontWeight: 'bold' },
  playerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16213e', padding: 15, borderRadius: 12, marginBottom: 10 },
  userRow: { backgroundColor: 'rgba(255, 107, 107, 0.1)', borderWidth: 2, borderColor: '#ff6b6b' },
  rank: { fontSize: 16, width: 50 },
  playerName: { fontSize: 16, color: '#ffffff', flex: 1 },
  scoreText: { fontSize: 14, color: '#4ecdc4', fontWeight: 'bold' },
  userText: { color: '#ff6b6b' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { backgroundColor: '#16213e', padding: 16, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#4ecdc4' },
  statLabel: { fontSize: 12, color: '#a0a0a0', marginTop: 4 },
  achievementCard: { backgroundColor: '#16213e', padding: 16, borderRadius: 12, marginBottom: 10 },
  achievementTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  achievementDesc: { fontSize: 14, color: '#a0a0a0', marginTop: 4 },
  tabBar: { flexDirection: 'row', backgroundColor: '#16213e', paddingVertical: 8, paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#0f3460' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', marginHorizontal: 4, borderRadius: 8 },
  activeTab: { backgroundColor: '#45b7d1' },
  tabText: { fontSize: 12, color: '#a0a0a0', textAlign: 'center' },
  activeTabText: { color: '#ffffff', fontWeight: 'bold' },
});