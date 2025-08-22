import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useAppStore from '../../store/appStore';
import { getHistoryEvents, getFunFact } from '../../services/apiService';
import BannerAdComponent from '../../components/BannerAdComponent';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const { todayContent, setTodayContent, streak, user } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTodayContent();
  }, []);

  const loadTodayContent = async () => {
    const today = new Date();
    const todayStr = today.toDateString();
    
    // Check if we already have today's content
    if (todayContent.date === todayStr) return;
    
    setLoading(true);
    try {
      const month = today.getMonth() + 1;
      const day = today.getDate();
      
      // Load history events and fun fact in parallel
      const [historyEvents, funFact] = await Promise.all([
        getHistoryEvents(month, day),
        getFunFact(),
      ]);
      
      setTodayContent({
        history: historyEvents,
        funFact,
        puzzle: null, // Puzzle is loaded separately on puzzle screen
        date: todayStr,
      });
    } catch (error) {
      console.error('Error loading today content:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodayContent();
    setRefreshing(false);
  };

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Welcome{user?.displayName ? `, ${user.displayName}` : ''}!
            </Text>
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={24} color="#ff6b6b" />
            <Text style={styles.streakText}>{streak}</Text>
          </View>
        </View>

        {/* This Day in History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book" size={24} color="#4ecdc4" />
            <Text style={styles.sectionTitle}>This Day in History</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading historical events...</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.historyScroll}
            >
              {todayContent.history.map((event, index) => (
                <View key={index} style={styles.historyCard}>
                  <Text style={styles.historyYear}>{event.year}</Text>
                  <Text style={styles.historyText} numberOfLines={4}>
                    {event.text}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Fun Fact of the Day */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb" size={24} color="#f9ca24" />
            <Text style={styles.sectionTitle}>Fun Fact of the Day</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading fun fact...</Text>
            </View>
          ) : (
            <View style={styles.factCard}>
              <Text style={styles.factText}>
                {todayContent.funFact?.text || 'Loading amazing fact...'}
              </Text>
              {todayContent.funFact?.source && (
                <Text style={styles.factSource}>
                  Source: {todayContent.funFact.source}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Daily Puzzle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="puzzle" size={24} color="#45b7d1" />
            <Text style={styles.sectionTitle}>Daily Puzzle</Text>
          </View>
          
          <TouchableOpacity
            style={styles.puzzleButton}
            onPress={() => router.push('/(tabs)/puzzle')}
          >
            <View style={styles.puzzleContent}>
              <Text style={styles.puzzleButtonText}>Play Today's Puzzle</Text>
              <Text style={styles.puzzleSubtext}>Test your knowledge!</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  date: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginLeft: 4,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#a0a0a0',
    fontSize: 14,
  },
  historyScroll: {
    marginLeft: -5,
  },
  historyCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    width: width * 0.7,
    borderLeftWidth: 4,
    borderLeftColor: '#4ecdc4',
  },
  historyYear: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 8,
  },
  historyText: {
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
  },
  puzzleContent: {
    flex: 1,
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
  bannerAd: {
    marginBottom: 20,
  },
});