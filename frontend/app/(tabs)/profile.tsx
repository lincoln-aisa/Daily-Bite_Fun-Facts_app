import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import useAppStore from '../../../store/appStore';

export default function Profile() {
  const router = useRouter();
  const { user, streak, totalPoints, setUser } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              setUser(null);
              router.replace('/onboarding');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
              console.error('Sign out error:', error);
            }
          },
        },
      ]
    );
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return user?.isAnonymous ? 'Guest User' : 'User';
  };

  const getUserEmail = () => {
    if (user?.email) return user.email;
    if (user?.isAnonymous) return 'Playing as guest';
    return 'No email provided';
  };

  const getBadges = () => {
    const badges = [];
    
    if (streak >= 7) {
      badges.push({ icon: 'flame', color: '#ff6b6b', title: 'Week Warrior', desc: '7-day streak' });
    }
    if (streak >= 30) {
      badges.push({ icon: 'medal', color: '#f9ca24', title: 'Month Master', desc: '30-day streak' });
    }
    if (totalPoints >= 1000) {
      badges.push({ icon: 'trophy', color: '#4ecdc4', title: 'Point Collector', desc: '1000+ points' });
    }
    if (totalPoints >= 5000) {
      badges.push({ icon: 'star', color: '#45b7d1', title: 'Quiz Champion', desc: '5000+ points' });
    }
    
    // Default badge if no achievements
    if (badges.length === 0) {
      badges.push({ icon: 'ribbon', color: '#a0a0a0', title: 'Getting Started', desc: 'Keep playing to unlock more!' });
    }
    
    return badges;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.section}>
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#ffffff" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{getUserName()}</Text>
              <Text style={styles.userEmail}>{getUserEmail()}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={24} color="#ff6b6b" />
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={24} color="#4ecdc4" />
              <Text style={styles.statValue}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Puzzles Solved</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgesContainer}>
            {getBadges().map((badge, index) => (
              <View key={index} style={styles.badgeCard}>
                <Ionicons name={badge.icon} size={30} color={badge.color} />
                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.badgeDesc}>{badge.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color="#45b7d1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Daily Reminder</Text>
                <Text style={styles.settingDesc}>Get notified about new daily content</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#a0a0a0', true: '#45b7d1' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#ffffff'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={20} color="#f9ca24" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDesc}>Use dark theme (currently active)</Text>
              </View>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#a0a0a0', true: '#f9ca24' }}
              thumbColor={darkModeEnabled ? '#ffffff' : '#ffffff'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="language" size={20} color="#4ecdc4" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Language</Text>
                <Text style={styles.settingDesc}>English (US)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#a0a0a0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle" size={20} color="#45b7d1" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingDesc}>Get help or contact support</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#a0a0a0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle" size={20} color="#f9ca24" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>About</Text>
                <Text style={styles.settingDesc}>App version and information</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#a0a0a0" />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out" size={20} color="#ffffff" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#45b7d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userEmail: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    marginTop: 4,
    textAlign: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '45%',
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
  badgeDesc: {
    fontSize: 12,
    color: '#a0a0a0',
    marginTop: 4,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#ffffff',
  },
  settingDesc: {
    fontSize: 12,
    color: '#a0a0a0',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});