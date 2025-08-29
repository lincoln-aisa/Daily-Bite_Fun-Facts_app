import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getDailyPuzzle, submitPuzzleScore, processReward } from '../services/apiService';
import { auth } from '../services/firebase';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const REWARDED_ID = process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID || TestIds.REWARDED;

export default function PuzzlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState<{ question: string; answers: string[]; correctAnswer: string } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hiddenIdx, setHiddenIdx] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const q = await getDailyPuzzle();
        setPuzzle(q);
      } catch {
        setPuzzle({
          question: 'What is the largest planet in our solar system?',
          correctAnswer: 'Jupiter',
          answers: ['Jupiter', 'Saturn', 'Earth', 'Mars'],
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const revealHint = () => {
    if (!puzzle) return;
    const wrong = puzzle.answers
      .map((a, i) => ({ a, i }))
      .filter((x) => x.a !== puzzle.correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((x) => x.i);
    setHiddenIdx(wrong);
  };

  const handleGetHint = () => {
    const ad = RewardedAd.createForAdRequest(REWARDED_ID, { requestNonPersonalizedAdsOnly: true });

    const offLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, async () => {
      try {
        await ad.show();
      } catch {
        revealHint();
      }
    });

    const offReward = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
      revealHint();
      const uid = auth.currentUser?.uid;
      if (uid) processReward(uid, 'hint', 1).catch(() => {});
    });

    const offClosed = ad.addAdEventListener(RewardedAdEventType.CLOSED, () => {
      offLoaded(); offReward(); offClosed();
    });

    ad.load();
  };

  const handleAnswerSelect = async (answer: string) => {
    if (!puzzle || locked) return;
    setLocked(true);                // one attempt only
    setSelectedAnswer(answer);

    if (answer === puzzle.correctAnswer) {
      Alert.alert('Correct! 🎉', 'You earned 100 points!');
      const uid = auth.currentUser?.uid;
      if (uid) {
        try { await submitPuzzleScore(uid, 100, 0); } catch (e) { console.log('submitPuzzleScore error', e); }
      }
    } else {
      Alert.alert('Almost!', 'Try watching a short ad to get a hint.', [
        { text: 'Get a hint', onPress: handleGetHint },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const canTap = (idx: number) => !locked && !hiddenIdx.includes(idx);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧩 Daily Puzzle</Text>
        {/* Always go Home to avoid odd back stacks */}
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
          <Text style={styles.backText}>← Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <Text style={styles.question}>{puzzle?.question}</Text>

            <TouchableOpacity
              disabled={locked}
              style={[styles.answerButton, { backgroundColor: locked ? '#2f5f4a' : '#2b945e', marginBottom: 16 }]}
              onPress={handleGetHint}
            >
              <Text style={styles.answerText}>🎁 Get a Hint (watch ad)</Text>
            </TouchableOpacity>

            {(puzzle?.answers ?? []).map((answer, idx) =>
              hiddenIdx.includes(idx) ? null : (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.answerButton,
                    selectedAnswer === answer && styles.selectedAnswer,
                    !canTap(idx) && { opacity: 0.5 },
                  ]}
                  disabled={!canTap(idx)}
                  onPress={() => handleAnswerSelect(answer)}
                >
                  <Text style={styles.answerText}>{answer}</Text>
                </TouchableOpacity>
              )
            )}
          </>
        )}
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
  content: { flex: 1, padding: 20, paddingBottom: 120 },
  question: { fontSize: 18, color: '#ffffff', textAlign: 'center', marginBottom: 16, lineHeight: 26 },
  answerButton: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  selectedAnswer: { backgroundColor: '#45b7d1' },
  answerText: { fontSize: 16, color: '#ffffff', fontWeight: 'bold' },
});
