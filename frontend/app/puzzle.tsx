import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getDailyPuzzle, submitPuzzleScore, processReward } from '../services/apiService';
import { auth } from '../services/firebase';
import { RewardedAd, AdEventType, BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const REWARDED_ID = process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID || TestIds.REWARDED;
const BANNER_ID = process.env.EXPO_PUBLIC_ADMOB_BANNER_AD_UNIT_ID || TestIds.BANNER;

export default function PuzzlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState<{question:string;answers:string[];correctAnswer:string} | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hiddenIdx, setHiddenIdx] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try { const q = await getDailyPuzzle(); setPuzzle(q); }
      catch (e) { console.log('PUZZLE LOAD ERROR', e); setPuzzle({ question:'What is the largest planet in our solar system?', correctAnswer:'Jupiter', answers:['Jupiter','Saturn','Earth','Mars'] }); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleAnswerSelect = async (answer: string) => {
    if (!puzzle) return;
    setSelectedAnswer(answer);
    if (answer === puzzle.correctAnswer) {
      Alert.alert('Correct! 🎉', 'You earned 100 points!');
      const uid = auth.currentUser?.uid || 'demo_user';
      try { await submitPuzzleScore(uid, 100, 0); } catch (e) { console.log('submitPuzzleScore error', e); }
    } else {
      Alert.alert('Wrong Answer 😔', `The correct answer was ${puzzle.correctAnswer}`);
    }
  };

  // Lazy-create and show rewarded ad only when user taps "Get a Hint"
  const handleGetHint = () => {
    const rewarded = RewardedAd.createForAdRequest(REWARDED_ID);
    const subReward = rewarded.addAdEventListener(AdEventType.EARNED_REWARD, async () => {
      if (!puzzle) return;
      const wrong = puzzle.answers
        .map((a, i) => ({ a, i }))
        .filter(x => x.a !== puzzle.correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(x => x.i);
      setHiddenIdx(wrong);
      const uid = auth.currentUser?.uid || 'demo_user';
      processReward(uid, 'hint', 1).catch(() => {});
    });
    const subClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      subReward(); subClosed();
    });
    rewarded.load();
    rewarded.show().catch(() => {
      // Fallback hint if ad fails to show
      if (!puzzle) return;
      const wrong = puzzle.answers
        .map((a, i) => ({ a, i }))
        .filter(x => x.a !== puzzle.correctAnswer)
        .slice(0, 2)
        .map(x => x.i);
      setHiddenIdx(wrong);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧩 Daily Puzzle</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <Text style={styles.question}>{puzzle?.question}</Text>

            <TouchableOpacity style={[styles.answerButton, { backgroundColor: '#2b945e', marginBottom: 16 }]} onPress={handleGetHint}>
              <Text style={styles.answerText}>🎁 Get a Hint (watch ad)</Text>
            </TouchableOpacity>

            {(puzzle?.answers ?? []).map((answer, idx) =>
              hiddenIdx.includes(idx) ? null : (
                <TouchableOpacity
                  key={idx}
                  style={[styles.answerButton, selectedAnswer === answer && styles.selectedAnswer]}
                  onPress={() => handleAnswerSelect(answer)}
                >
                  <Text style={styles.answerText}>{answer}</Text>
                </TouchableOpacity>
              )
            )}
          </>
        )}
      </View>

      {/* Fixed bottom: banner above tabs */}
      <View style={styles.bottomArea}>
        <View style={{ alignItems: 'center', marginBottom: 6 }}>
          <BannerAd unitId={BANNER_ID} size={BannerAdSize.LARGE_BANNER} />
        </View>
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tab} onPress={() => router.replace('/')}>
            <Text style={styles.tabText}>🏠 Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.tabActive]} onPress={() => router.replace('/leaderboard')}>
            <Text style={[styles.tabText, styles.tabTextActive]}>🏆 Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => router.replace('/profile')}>
            <Text style={styles.tabText}>👤 Profile</Text>
          </TouchableOpacity>
        </View>
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
  content: { flex: 1, padding: 20, paddingBottom: 160 },
  question: { fontSize: 18, color: '#ffffff', textAlign: 'center', marginBottom: 16, lineHeight: 26 },
  answerButton: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  selectedAnswer: { backgroundColor: '#45b7d1' },
  answerText: { fontSize: 16, color: '#ffffff', fontWeight: 'bold' },

  bottomArea: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#0f1626', paddingTop: 6,
  },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#16213e',
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#0f3460',
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabText: { fontSize: 12, color: '#a0a0a0' },
  tabActive: { backgroundColor: '#273c75' },
  tabTextActive: { color: '#fff', fontWeight: 'bold' },
});
