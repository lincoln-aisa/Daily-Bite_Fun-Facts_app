import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from '../../store/appStore';
import { getLeaderboard } from '../../services/apiService';
import BannerAdComponent from '../../components/BannerAdComponent';

export default function Leaderboard() {
  const { user, setLeaderboard, leaderboard } = useAppStore();
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard(activeTab);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Ionicons name="trophy" size={24} color="#f9ca24" />;
      case 2:
        return <Ionicons name="medal" size={24} color="#c0c0c0" />;
      case 3:
        return <Ionicons name="medal" size={24} color="#cd7f32" />;
      default:
        return (
          <View style={styles.rankNumber}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
        );
    }
  };

  const isCurrentUser = (userId) => {
    return user && user.uid === userId;
  };

  const mockLeaderboard = [
    { id: '1', name: 'Alice Johnson', score: 1250, rank: 1 },
    { id: '2', name: 'Bob Smith', score: 1180, rank: 2 },
    { id: '3', name: 'Charlie Brown', score: 1120, rank: 3 },
    { id: '4', name: 'Diana Prince', score: 1050, rank: 4 },
    { id: '5', name: 'Ethan Hunt', score: 980, rank: 5 },
    { id: '6', name: 'Fiona Green', score: 920, rank: 6 },
    { id: '7', name: 'George Wilson', score: 850, rank: 7 },
    { id: '8', name: 'Hannah Davis', score: 780, rank: 8 },
    { id: '9', name: 'Ian Fleming', score: 720, rank: 9 },
    { id: '10', name: 'You', score: 650, rank: 10, isCurrentUser: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Ionicons name="trophy" size={24} color="#f9ca24" />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'today' && styles.activeTab]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>
            Today's Top Scores
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Time
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff6b6b"
            colors={['#ff6b6b']}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading leaderboard...</Text>
          </View>
        ) : (
          <View style={styles.leaderboardContainer}>
            {mockLeaderboard.map((player, index) => (
              <View
                key={player.id}
                style={[
                  styles.playerRow,
                  player.isCurrentUser && styles.currentUserRow,
                ]}
              >
                <View style={styles.playerInfo}>
                  <View style={styles.rankContainer}>
                    {getRankIcon(player.rank)}
                  </View>
                  <View style={styles.playerDetails}>
                    <Text style={[
                      styles.playerName,
                      player.isCurrentUser && styles.currentUserText,
                    ]}>
                      {player.name}
                    </Text>
                    <Text style={styles.playerScore}>{player.score} points</Text>
                  </View>
                </View>
                
                {player.rank <= 3 && (
                  <View style={styles.achievementBadge}>
                    <Ionicons name="star" size={16} color="#f9ca24" />
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* User's Rank Section */}
        {user && (
          <View style={styles.userRankSection}>
            <Text style={styles.sectionTitle}>Your Ranking</Text>
            <View style={styles.userRankCard}>
              <View style={styles.userRankInfo}>
                <Text style={styles.userRankText}>Your Position</Text>
                <Text style={styles.userRankNumber}>#10</Text>
              </View>
              <View style={styles.userStats}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>650</Text>
                  <Text style={styles.statLabel}>Total Points</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>5</Text>
                  <Text style={styles.statLabel}>Puzzles Solved</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>85%</Text>
                  <Text style={styles.statLabel}>Success Rate</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Banner Ad */}
        <BannerAdComponent style={styles.bannerAd} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    margin: 20,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#45b7d1',
  },
  tabText: {
    fontSize: 14,
    color: '#a0a0a0',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#a0a0a0',
    fontSize: 16,
  },
  leaderboardContainer: {
    padding: 20,
    paddingTop: 0,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  currentUserRow: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#a0a0a0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  playerDetails: {
    marginLeft: 15,
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  currentUserText: {
    color: '#ff6b6b',
  },
  playerScore: {
    fontSize: 14,
    color: '#4ecdc4',
    marginTop: 2,
  },
  achievementBadge: {
    marginLeft: 10,
  },
  userRankSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  userRankCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  userRankInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userRankText: {
    fontSize: 16,
    color: '#ffffff',
  },
  userRankNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ecdc4',
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    marginTop: 4,
  },
  bannerAd: {
    marginBottom: 20,
  },
});