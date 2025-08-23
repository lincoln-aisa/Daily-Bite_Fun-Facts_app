import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

console.log("APP MOUNT: App.tsx constructing");

// Import our route components directly
import HomePage from './app/index';
import PuzzlePage from './app/puzzle';
import LeaderboardPage from './app/leaderboard';
import ProfilePage from './app/profile';

export default function App() {
  console.log("APP RENDER: App component rendering");
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'puzzle':
        return <PuzzlePage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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
  container: { 
    flex: 1, 
    backgroundColor: '#1a1a2e' 
  },
  content: { 
    flex: 1 
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    paddingVertical: 8,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#45b7d1',
  },
  tabText: {
    fontSize: 12,
    color: '#a0a0a0',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});