import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { InterstitialAd, RewardedAd, AdEventType } from 'react-native-google-mobile-ads';
import useAppStore from '../../store/appStore';
import { getDailyPuzzle, submitPuzzleScore } from '../../services/apiService';
import { AD_UNIT_IDS } from '../../lib/admob';

export default function Puzzle() {
  const { user, addPoints } = useAppStore();
  const [puzzle, setPuzzle] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [interstitialAd, setInterstitialAd] = useState(null);
  const [rewardedAd, setRewardedAd] = useState(null);

  useEffect(() => {
    loadPuzzle();
    initializeAds();
  }, []);

  useEffect(() => {
    let interval;
    if (gameStarted && timer > 0 && !showResult) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && gameStarted) {
      // Time's up
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [gameStarted, timer, showResult]);

  const initializeAds = () => {
    // Initialize Interstitial Ad
    const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial);
    
    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial ad loaded');
    });
    
    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial ad closed');
      // Preload next ad
      setTimeout(() => interstitial.load(), 1000);
    });
    
    interstitial.load();
    setInterstitialAd(interstitial);

    // Initialize Rewarded Ad
    const rewarded = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded);
    
    rewarded.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Rewarded ad loaded');
    });
    
    rewarded.addAdEventListener(AdEventType.EARNED_REWARD, (reward) => {
      console.log('Reward earned:', reward);
      // Give hint
      giveHint();
    });
    
    rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Rewarded ad closed');
      // Preload next ad
      setTimeout(() => rewarded.load(), 1000);
    });
    
    rewarded.load();
    setRewardedAd(rewarded);
  };

  const loadPuzzle = async () => {
    setLoading(true);
    try {
      const dailyPuzzle = await getDailyPuzzle();
      setPuzzle(dailyPuzzle);
    } catch (error) {
      console.error('Error loading puzzle:', error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setTimer(30);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setHintsUsed(0);
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setGameStarted(false);
    
    const isCorrect = answer === puzzle.correctAnswer;
    const timeBonus = Math.max(0, timer * 2);
    const hintPenalty = hintsUsed * 10;
    const finalScore = isCorrect ? 100 + timeBonus - hintPenalty : 0;
    
    setScore(finalScore);
    setShowResult(true);
    
    if (finalScore > 0) {
      addPoints(finalScore);
    }
    
    // Submit score to backend
    if (user) {
      submitPuzzleScore(user.uid, finalScore, 30 - timer);
    }
  };

  const handleTimeUp = () => {
    setGameStarted(false);
    setShowResult(true);
    setScore(0);
  };

  const showHint = () => {
    if (rewardedAd) {
      Alert.alert(
        'Get a Hint',
        'Watch a short ad to get a hint that will remove two wrong answers.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Watch Ad', onPress: () => rewardedAd.show() }
        ]
      );
    }
  };

  const giveHint = () => {
    if (!puzzle || hintsUsed >= 2) return;
    
    setHintsUsed(prev => prev + 1);
    Alert.alert(
      'Hint!',
      `Two wrong answers have been eliminated. The correct answer is still visible.`,
      [{ text: 'Got it!', onPress: () => {} }]
    );
  };

  const playAgain = () => {
    loadPuzzle();
    setShowResult(false);
    setSelectedAnswer(null);
    setGameStarted(false);
    setTimer(30);
    setScore(0);
    setHintsUsed(0);
  };

  const shareScore = () => {
    // Show interstitial ad first
    if (interstitialAd) {
      interstitialAd.show();
    }
    
    Alert.alert(
      'Share Your Score',
      `I scored ${score} points on today's Daily Bite puzzle! Can you beat it?`,
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Share', onPress: () => console.log('Share functionality would go here') }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading today's puzzle...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Puzzle</Text>
        {gameStarted && (
          <View style={styles.timerContainer}>
            <Ionicons name="time" size={20} color="#ff6b6b" />
            <Text style={styles.timerText}>{timer}s</Text>
          </View>
        )}
      </View>

      {puzzle && (
        <View style={styles.content}>
          {!gameStarted && !showResult && (
            <View style={styles.startContainer}>
              <View style={styles.puzzleInfo}>
                <Text style={styles.category}>{puzzle.category}</Text>
                <Text style={styles.difficulty}>
                  Difficulty: {puzzle.difficulty.toUpperCase()}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.startButton} onPress={startGame}>
                <Text style={styles.startButtonText}>Start Puzzle</Text>
              </TouchableOpacity>
            </View>
          )}

          {(gameStarted || showResult) && (
            <>
              <View style={styles.questionContainer}>
                <Text style={styles.question}>{puzzle.question}</Text>
              </View>

              <View style={styles.answersContainer}>
                {puzzle.answers.map((answer, index) => {
                  const isSelected = selectedAnswer === answer;
                  const isCorrect = answer === puzzle.correctAnswer;
                  const isWrong = showResult && isSelected && !isCorrect;
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.answerButton,
                        isSelected && styles.selectedAnswer,
                        showResult && isCorrect && styles.correctAnswer,
                        isWrong && styles.wrongAnswer,
                      ]}
                      onPress={() => handleAnswerSelect(answer)}
                      disabled={showResult}
                    >
                      <Text style={[
                        styles.answerText,
                        isSelected && styles.selectedAnswerText,
                        showResult && isCorrect && styles.correctAnswerText,
                        isWrong && styles.wrongAnswerText,
                      ]}>
                        {answer}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {gameStarted && (
                <TouchableOpacity style={styles.hintButton} onPress={showHint}>
                  <Ionicons name="bulb" size={20} color="#ffffff" />
                  <Text style={styles.hintButtonText}>
                    Get a Hint ({2 - hintsUsed} left)
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      )}

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.resultModal}>
            <View style={styles.resultHeader}>
              <Ionicons 
                name={score > 0 ? "trophy" : "close-circle"} 
                size={40} 
                color={score > 0 ? "#f9ca24" : "#ff6b6b"} 
              />
              <Text style={styles.resultTitle}>
                {score > 0 ? 'Well Done!' : 'Better Luck Next Time!'}
              </Text>
            </View>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score: {score}</Text>
              {score > 0 && (
                <Text style={styles.bonusText}>
                  Time Bonus: +{Math.max(0, timer * 2)} | Hint Penalty: -{hintsUsed * 10}
                </Text>
              )}
            </View>
            
            <View style={styles.resultButtons}>
              <TouchableOpacity style={styles.playAgainButton} onPress={playAgain}>
                <Text style={styles.playAgainText}>Play Again</Text>
              </TouchableOpacity>
              
              {score > 0 && (
                <TouchableOpacity style={styles.shareButton} onPress={shareScore}>
                  <Ionicons name="share" size={16} color="#ffffff" />
                  <Text style={styles.shareText}>Share Score</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginLeft: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  puzzleInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  category: {
    fontSize: 18,
    color: '#4ecdc4',
    marginBottom: 8,
  },
  difficulty: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  startButton: {
    backgroundColor: '#45b7d1',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  questionContainer: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  question: {
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 26,
    textAlign: 'center',
  },
  answersContainer: {
    flex: 1,
    gap: 15,
  },
  answerButton: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAnswer: {
    borderColor: '#45b7d1',
  },
  correctAnswer: {
    backgroundColor: '#27ae60',
    borderColor: '#2ecc71',
  },
  wrongAnswer: {
    backgroundColor: '#e74c3c',
    borderColor: '#c0392b',
  },
  answerText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  selectedAnswerText: {
    color: '#45b7d1',
    fontWeight: 'bold',
  },
  correctAnswerText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  wrongAnswerText: {
    color: '#ffffff',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  hintButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultModal: {
    backgroundColor: '#16213e',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 300,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ecdc4',
  },
  bonusText: {
    fontSize: 12,
    color: '#a0a0a0',
    marginTop: 5,
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  playAgainButton: {
    backgroundColor: '#45b7d1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  playAgainText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 5,
  },
  shareText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});