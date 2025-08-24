import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getDailyPuzzle } from '../services/apiService';

export default function PuzzlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState<{question:string;answers:string[];correctAnswer:string} | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q = await getDailyPuzzle();
        setPuzzle(q);
      } catch (e) {
        console.log('PUZZLE LOAD ERROR', e);
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

  const handleAnswerSelect = (answer: string) => {
    if (!puzzle) return;
    setSelectedAnswer(answer);
    if (answer === puzzle.correctAnswer) {
      Alert.alert('Correct! 🎉', 'You earned 100 points!');
      // TODO: optionally call submitPuzzleScore(userId, 100, timeTaken)
    } else {
      Alert.alert('Wrong Answer 😔', `The correct answer was ${puzzle.correctAnswer}`);
    }
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
            {(puzzle?.answers ?? []).map((answer, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.answerButton,
                  selectedAnswer === answer && styles.selectedAnswer
                ]}
                onPress={() => handleAnswerSelect(answer)}
              >
                <Text style={styles.answerText}>{answer}</Text>
              </TouchableOpacity>
            ))}
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
  content: { flex: 1, padding: 20 },
  question: { fontSize: 18, color: '#ffffff', textAlign: 'center', marginBottom: 30, lineHeight: 26 },
  answerButton: { backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  selectedAnswer: { backgroundColor: '#45b7d1' },
  answerText: { fontSize: 16, color: '#ffffff', fontWeight: 'bold' },
});
