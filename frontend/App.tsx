import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

console.log("APP MOUNT: App.tsx constructing");

export default function App() {
  console.log("APP RENDER: App component rendering");
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Daily Bite: Fun & Facts</Text>
        <Text style={styles.subtitle}>Explicit entry works - container fix successful!</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✅ APP IS WORKING</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📖 This Day in History</Text>
        <View style={styles.card}>
          <Text style={styles.year}>1969</Text>
          <Text style={styles.eventText}>
            Apollo 11 lands on the Moon - Neil Armstrong and Buzz Aldrin become first humans on lunar surface.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Fun Fact</Text>
        <View style={styles.factCard}>
          <Text style={styles.factText}>
            Octopuses have three hearts and blue blood! Two pump blood to gills, one to the body.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧩 Daily Puzzle</Text>
        <TouchableOpacity style={styles.puzzleButton}>
          <Text style={styles.puzzleButtonText}>Play Today's Puzzle</Text>
          <Text style={styles.puzzleSubtext}>Container fixes working perfectly!</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>🎉 PDF Container Fixes Applied Successfully!</Text>
        <Text style={styles.footerSubtext}>Ready for full router implementation</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { alignItems: 'center', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#4ecdc4', textAlign: 'center', marginBottom: 20 },
  badge: { backgroundColor: '#27ae60', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25 },
  badgeText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  section: { margin: 20, marginTop: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 15 },
  card: { backgroundColor: '#16213e', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#4ecdc4' },
  year: { fontSize: 16, fontWeight: 'bold', color: '#4ecdc4', marginBottom: 8 },
  eventText: { fontSize: 14, color: '#ffffff', lineHeight: 20 },
  factCard: { backgroundColor: '#16213e', padding: 20, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#f9ca24' },
  factText: { fontSize: 16, color: '#ffffff', lineHeight: 24 },
  puzzleButton: { backgroundColor: '#45b7d1', padding: 20, borderRadius: 12, alignItems: 'center' },
  puzzleButtonText: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  puzzleSubtext: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  footer: { alignItems: 'center', padding: 40 },
  footerText: { fontSize: 18, fontWeight: 'bold', color: '#27ae60' },
  footerSubtext: { fontSize: 14, color: '#a0a0a0', marginTop: 8 },
});