import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Vibration
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Button, Modal } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { shuffleArray } from '../../utils/helpers';
import { addScore } from '../../utils/storage';

const MatchingGame = ({ navigation, route }) => {
  const { game, studentData } = route?.params || {};
  
  // Game state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [feedback, setFeedback] = useState(null);
  
  // Animation values
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const initializeGame = useCallback(() => {
    if (!game?.questions) return;
    
    const gameQuestions = shuffleArray([...game.questions]).slice(0, Math.min(6, game.questions.length));
    
    const questionCards = gameQuestions.map((q, index) => ({
      id: `q_${index}`,
      text: q.question,
      type: 'question',
      matched: false,
      correctAnswerId: `a_${index}`,
    }));
    
    const answerCards = gameQuestions.map((q, index) => ({
      id: `a_${index}`,
      text: q.options[q.correctAnswer],
      type: 'answer',
      matched: false,
      correctQuestionId: `q_${index}`,
    }));
    
    setQuestions(shuffleArray(questionCards));
    setAnswers(shuffleArray(answerCards));
    setMatches([]);
    setScore(0);
    
    // Store the expected number of matches for game completion
    setTotalQuestions(gameQuestions.length);
  }, [game?.questions]);
  
  const endGame = useCallback(async () => {
    setGameEnded(true);
    
    const finalScore = {
      studentId: studentData?.id,
      gameId: game?.id,
      score: score,
      totalQuestions: totalQuestions,
      correctAnswers: matches.length,
      timeSpent: 180 - timeLeft,
      gameType: 'matching',
      playedAt: new Date().toISOString(),
    };
    
    try {
      await addScore(finalScore);
    } catch (error) {
      console.error('Error saving score:', error);
    }
    
    // Navigate to ScoreFeedback with results
    navigation.navigate('ScoreFeedback', {
      gameResults: finalScore,
      studentData: studentData,
      game: game
    });
  }, [score, totalQuestions, matches.length, timeLeft, studentData, game, navigation]);
  
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  useEffect(() => {
    let timer;
    if (gameStarted && !gameEnded && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameEnded, timeLeft, endGame]);
  
  const startGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
  };
  
  const handleCardPress = (card) => {
    console.log('Card pressed:', card.id, card.type, 'matched:', card.matched);
    if (card.matched) {
      console.log('Card already matched, returning');
      return;
    }

    // Add pressing animation
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
    
    if (card.type === 'question') {
      if (selectedQuestion?.id === card.id) {
        console.log('Deselecting question');
        setSelectedQuestion(null);
      } else {
        console.log('Selecting question:', card.id);
        setSelectedQuestion(card);
        if (selectedAnswer) {
          console.log('Checking match with answer:', selectedAnswer.id);
          checkMatch(card, selectedAnswer);
        }
      }
    } else {
      if (selectedAnswer?.id === card.id) {
        console.log('Deselecting answer');
        setSelectedAnswer(null);
      } else {
        console.log('Selecting answer:', card.id);
        setSelectedAnswer(card);
        if (selectedQuestion) {
          console.log('Checking match with question:', selectedQuestion.id);
          checkMatch(selectedQuestion, card);
        }
      }
    }
  };
  
  const checkMatch = (question, answer) => {
    console.log('Checking match between:', question.id, 'and', answer.id);
    console.log('Question correctAnswerId:', question.correctAnswerId);
    console.log('Answer id:', answer.id);
    
    const isCorrect = question.correctAnswerId === answer.id;
    console.log('Is match correct?', isCorrect);
    
    if (isCorrect) {
      // Correct match
      const newMatches = [...matches, { questionId: question.id, answerId: answer.id }];
      setMatches(newMatches);
      console.log('Updated matches:', newMatches.length, '/', totalQuestions);
      
      // Update cards as matched
      setQuestions(prev => prev.map(q => 
        q.id === question.id ? { ...q, matched: true } : q
      ));
      setAnswers(prev => prev.map(a => 
        a.id === answer.id ? { ...a, matched: true } : a
      ));
      
      // Update score
      const newScore = score + 10;
      setScore(newScore);
      
      // Show positive feedback
      setFeedback({ type: 'success', message: 'Correct! +10 points' });
      Vibration.vibrate(100);
      
      // Pulse animation
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true })
      ]).start();
      
      // Check if game is complete
      if (newMatches.length === totalQuestions) {
        console.log('Game complete! Ending...');
        setTimeout(() => endGame(), 1000);
      }
    } else {
      // Wrong match
      console.log('Wrong match!');
      setFeedback({ type: 'error', message: 'Try again!' });
      Vibration.vibrate([100, 100, 100]);
      
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true })
      ]).start();
    }
    
    // Clear selections
    setSelectedQuestion(null);
    setSelectedAnswer(null);
    
    // Clear feedback after 2 seconds
    setTimeout(() => setFeedback(null), 2000);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };
  
  const getCardStyle = (card) => {
    const baseStyle = [styles.card];
    
    if (card.matched) {
      baseStyle.push(styles.cardMatched);
    } else if (
      (card.type === 'question' && selectedQuestion?.id === card.id) ||
      (card.type === 'answer' && selectedAnswer?.id === card.id)
    ) {
      baseStyle.push(styles.cardSelected);
    }
    
    return baseStyle;
  };
  
  if (!game?.questions) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Matching Game"
          subtitle="No game data"
          variant="game"
          showBackButton
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No game data available</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Matching Game"
        subtitle={game?.title || 'Game Title'}
        variant="game"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />
      
      {!gameStarted ? (
        <View style={styles.instructionsContainer}>
          <Text style={styles.gameIcon}>🎯</Text>
          <Text style={styles.instructionsTitle}>How to Play</Text>
          <Text style={styles.instructionsText}>
            1. Match questions with their correct answers{'\n'}
            2. Tap a question card, then tap its matching answer{'\n'}
            3. Get 10 points for each correct match{'\n'}
            4. Complete all matches within the time limit
          </Text>
          
          <View style={styles.gameInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Questions:</Text>
              <Text style={styles.infoValue}>{totalQuestions || game?.questions?.length || 0}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Time Limit:</Text>
              <Text style={styles.infoValue}>3:00</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Points per Match:</Text>
              <Text style={styles.infoValue}>10</Text>
            </View>
          </View>
          
          <Button
            title="Start Game"
            onPress={startGame}
            variant="primary"
            style={styles.startButton}
          />
        </View>
      ) : (
        <View style={styles.gameContainer}>
          {/* Game Header */}
          <View style={styles.gameHeader}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Score</Text>
              <Animated.Text style={[styles.scoreValue, { transform: [{ scale: pulseAnim }] }]}>
                {score}
              </Animated.Text>
            </View>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Matches</Text>
              <Text style={styles.progressValue}>
                {matches.length} / {totalQuestions}
              </Text>
            </View>
            
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Time</Text>
              <Text style={[styles.timerValue, timeLeft < 30 && styles.timerWarning]}>
                {formatTime(timeLeft)}
              </Text>
            </View>
          </View>
          
          {/* Feedback */}
          {feedback && (
            <Animated.View 
              style={[
                styles.feedbackContainer,
                feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError,
                { transform: [{ translateX: shakeAnim }] }
              ]}
            >
              <Text style={styles.feedbackText}>{feedback.message}</Text>
            </Animated.View>
          )}
          
          {/* Game Grid */}
          <View style={styles.gameGrid}>
            {/* Questions Column */}
            <View style={styles.column}>
              <Text style={styles.columnTitle}>Questions</Text>
              {questions.map((question) => (
                <Animated.View key={question.id} style={{ transform: [{ scale: pulseAnim }] }}>
                  <TouchableOpacity
                    style={getCardStyle(question)}
                    onPress={() => handleCardPress(question)}
                    disabled={question.matched}
                  >
                    <Text style={styles.cardText} numberOfLines={3}>
                      {question.text}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
            
            {/* Answers Column */}
            <View style={styles.column}>
              <Text style={styles.columnTitle}>Answers</Text>
              {answers.map((answer) => (
                <Animated.View key={answer.id} style={{ transform: [{ scale: pulseAnim }] }}>
                  <TouchableOpacity
                    style={getCardStyle(answer)}
                    onPress={() => handleCardPress(answer)}
                    disabled={answer.matched}
                  >
                    <Text style={styles.cardText} numberOfLines={3}>
                      {answer.text}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        </View>
      )}
      
      {/* Instructions Modal */}
      <Modal
        visible={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Matching Game Instructions"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            🎯 Tap a question, then tap its matching answer{'\n\n'}
            ✅ Correct matches earn 10 points{'\n\n'}
            ⏰ Complete all matches within 3 minutes{'\n\n'}
            🏆 Try to get the highest score possible!
          </Text>
          <Button
            title="Got it!"
            onPress={() => setShowInstructions(false)}
            variant="primary"
            fullWidth
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd29d',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  errorText: {
    ...TEXT_STYLES.body,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  instructionsContainer: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  
  gameIcon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  instructionsTitle: {
    ...TEXT_STYLES.title,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  instructionsText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  
  gameInfo: {
    backgroundColor: '#e8f5e8',
    borderRadius: 15,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: '#000000ff',
    shadowColor: '#28a745',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  
  infoLabel: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  infoValue: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
  },
  
  startButton: {
    marginTop: SPACING.lg,
  },
  
  gameContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e7f3ff',
    borderRadius: 15,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: '#000000ff',
    shadowColor: '#4a5bb8',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  
  scoreContainer: {
    alignItems: 'center',
    flex: 1,
  },
  
  scoreLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  
  scoreValue: {
    ...TEXT_STYLES.title,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  
  progressContainer: {
    alignItems: 'center',
    flex: 1,
  },
  
  progressLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  
  progressValue: {
    ...TEXT_STYLES.heading,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  
  timerContainer: {
    alignItems: 'center',
    flex: 1,
  },
  
  timerLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  
  timerValue: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  
  timerWarning: {
    color: COLORS.error,
  },
  
  feedbackContainer: {
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  
  feedbackSuccess: {
    backgroundColor: '#e8f5e8',
    borderColor: '#28a745',
    shadowColor: '#28a745',
  },
  
  feedbackError: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
    shadowColor: '#dc3545',
  },
  
  feedbackText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
  },
  
  gameGrid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  column: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  
  columnTitle: {
    ...TEXT_STYLES.bodySmall,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: '#4a5bb8',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000ff',
    shadowColor: '#4a5bb8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: '#000000ff',
    minHeight: 80,
    justifyContent: 'center',
    shadowColor: '#6c757d',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  
  cardSelected: {
    borderColor: '#4a5bb8',
    backgroundColor: '#e7f3ff',
    shadowColor: '#4a5bb8',
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.4,
    elevation: 18,
  },
  
  cardMatched: {
    backgroundColor: '#e8f5e8',
    borderColor: '#28a745',
    shadowColor: '#28a745',
    opacity: 0.8,
  },
  
  cardText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  
  modalContent: {
    padding: SPACING.lg,
  },
  
  modalText: {
    ...TEXT_STYLES.body,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
});

export default MatchingGame;