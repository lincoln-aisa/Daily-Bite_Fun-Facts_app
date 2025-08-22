// Copy this entire code to https://snack.expo.dev to preview the app instantly!

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Modal,
  Alert 
} from 'react-native';

export default function DailyBiteApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(5);

  const puzzleData = {
    question: "What is the largest planet in our solar system?",
    answers: ["Jupiter", "Saturn", "Earth", "Mars"],
    correctAnswer: "Jupiter"
  };

  const handleAnswerSelect = (answer) => {
    if (answer === puzzleData.correctAnswer) {
      setScore(score + 100);
      Alert.alert("Correct! 🎉", "You earned 100 points!");
    } else {
      Alert.alert("Wrong Answer 😔", `The correct answer was ${puzzleData.correctAnswer}`);
    }
    setShowPuzzle(false);
  };

  const renderHomeScreen = () => (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📚 Daily Bite: Fun & Facts</Text>
        <Text style={styles.subtitle}>Your daily dose of history, facts & puzzles!</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {streak}-day streak</Text>
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
        <TouchableOpacity 
          style={styles.puzzleButton}
          onPress={() => setShowPuzzle(true)}
        >
          <Text style={styles.puzzleButtonText}>Play Today's Puzzle</Text>
          <Text style={styles.puzzleSubtext}>Test your knowledge! Current Score: {score}</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'home' && styles.activeTab]}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={[styles.tabText, currentScreen === 'home' && styles.activeTabText]}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'leaderboard' && styles.activeTab]}
          onPress={() => setCurrentScreen('leaderboard')}
        >
          <Text style={[styles.tabText, currentScreen === 'leaderboard' && styles.activeTabText]}>🏆 Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'profile' && styles.activeTab]}
          onPress={() => setCurrentScreen('profile')}
        >
          <Text style={[styles.tabText, currentScreen === 'profile' && styles.activeTabText]}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderLeaderboard = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <Text style={styles.subtitle}>Today's Top Scores</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.leaderboardCard}>
          <View style={styles.leaderRow}>
            <Text style={styles.rank}>🥇</Text>
            <Text style={styles.playerName}>Alice Johnson</Text>
            <Text style={styles.scoreText}>1,250 pts</Text>
          </View>
          <View style={styles.leaderRow}>
            <Text style={styles.rank}>🥈</Text>
            <Text style={styles.playerName}>Bob Smith</Text>
            <Text style={styles.scoreText}>1,180 pts</Text>
          </View>
          <View style={styles.leaderRow}>
            <Text style={styles.rank}>🥉</Text>
            <Text style={styles.playerName}>Charlie Brown</Text>
            <Text style={styles.scoreText}>1,120 pts</Text>
          </View>
          <View style={[styles.leaderRow, styles.userRow]}>
            <Text style={styles.rank}>4th</Text>
            <Text style={[styles.playerName, styles.userText]}>You</Text>
            <Text style={[styles.scoreText, styles.userText]}>{score} pts</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'home' && styles.activeTab]}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={[styles.tabText, currentScreen === 'home' && styles.activeTabText]}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'leaderboard' && styles.activeTab]}
          onPress={() => setCurrentScreen('leaderboard')}
        >
          <Text style={[styles.tabText, currentScreen === 'leaderboard' && styles.activeTabText]}>🏆 Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'profile' && styles.activeTab]}
          onPress={() => setCurrentScreen('profile')}
        >
          <Text style={[styles.tabText, currentScreen === 'profile' && styles.activeTabText]}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Profile</Text>
        <Text style={styles.subtitle}>Your Daily Bite Stats</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{score}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Puzzles Solved</Text>
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

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'home' && styles.activeTab]}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={[styles.tabText, currentScreen === 'home' && styles.activeTabText]}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'leaderboard' && styles.activeTab]}
          onPress={() => setCurrentScreen('leaderboard')}
        >
          <Text style={[styles.tabText, currentScreen === 'leaderboard' && styles.activeTabText]}>🏆 Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, currentScreen === 'profile' && styles.activeTab]}
          onPress={() => setCurrentScreen('profile')}
        >
          <Text style={[styles.tabText, currentScreen === 'profile' && styles.activeTabText]}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderPuzzleModal = () => (
    <Modal visible={showPuzzle} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.puzzleModal}>
          <Text style={styles.puzzleQuestion}>{puzzleData.question}</Text>
          
          {puzzleData.answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={styles.answerButton}
              onPress={() => handleAnswerSelect(answer)}
            >
              <Text style={styles.answerText}>{answer}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowPuzzle(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentScreen === 'home' && renderHomeScreen()}
      {currentScreen === 'leaderboard' && renderLeaderboard()}
      {currentScreen === 'profile' && renderProfile()}
      {renderPuzzleModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    paddingVertical: 10,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#45b7d1',
  },
  tabText: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
  userRow: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 12,
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
  scoreText: {
    fontSize: 14,
    color: '#4ecdc4',
    fontWeight: 'bold',
  },
  userText: {
    color: '#ff6b6b',
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
  achievementCard: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  puzzleModal: {
    backgroundColor: '#16213e',
    padding: 30,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
  },
  puzzleQuestion: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  answerButton: {
    backgroundColor: '#45b7d1',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  answerText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#666666',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
});