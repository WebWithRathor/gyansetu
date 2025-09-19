import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Card, Button } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { getScoreEmoji, formatTime } from '../../utils/helpers';

const ScoreFeedback = ({ navigation, route }) => {
  const { gameResults, game } = route?.params || {};
  
  // Extract data from gameResults or use defaults
  const score = gameResults?.score || 0;
  const totalQuestions = gameResults?.totalQuestions || gameResults?.linesCleared || 10;
  const correctAnswers = gameResults?.correctAnswers || gameResults?.questionStreak || 0;
  const timeTaken = gameResults?.timeSpent || 0;
  const gameTitle = game?.title || 'Quiz Game';
  const difficulty = game?.difficulty || 'Easy';
  const gameType = gameResults?.gameType || 'matching';
  
  // For BlockBlast games, show different metrics
  const isBlockBlast = gameType === 'blockblast';
  const linesCleared = gameResults?.linesCleared || 0;
  const moves = gameResults?.moves || 0;
  const questionStreak = gameResults?.questionStreak || 0;
  const wrongAnswers = isBlockBlast ? 0 : Math.max(0, totalQuestions - correctAnswers);
  
  const [animatedValue] = useState(new Animated.Value(0));
  const [showDetails, setShowDetails] = useState(false);
  
  const percentage = isBlockBlast 
    ? Math.min(100, Math.round((score / 500) * 100)) // For block blast, assume 500 is max reasonable score
    : Math.round((correctAnswers / totalQuestions) * 100);
  const emoji = getScoreEmoji(correctAnswers, totalQuestions);
  
  useEffect(() => {
    // Animate score reveal
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => setShowDetails(true), 500);
    });
  }, [animatedValue]);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a star!";
    if (percentage >= 80) return "Excellent work! Keep it up!";
    if (percentage >= 70) return "Good job! You're improving!";
    if (percentage >= 60) return "Nice effort! Practice more!";
    if (percentage >= 50) return "Keep trying! You can do better!";
    return "Don't give up! Every attempt counts!";
  };

  const getBadgeEarned = () => {
    if (percentage >= 95) return { emoji: '🏆', name: 'Perfect Score', description: 'Scored 95% or higher' };
    if (percentage >= 90) return { emoji: '🌟', name: 'Star Player', description: 'Scored 90% or higher' };
    if (percentage >= 80) return { emoji: '🎯', name: 'Sharp Shooter', description: 'Scored 80% or higher' };
    if (percentage >= 70) return { emoji: '👏', name: 'Good Effort', description: 'Scored 70% or higher' };
    if (percentage >= 60) return { emoji: '👍', name: 'Keep Going', description: 'Scored 60% or higher' };
    return { emoji: '📚', name: 'Learner', description: 'Completed the game' };
  };

  const badge = getBadgeEarned();

  const getImprovementTips = () => {
    const tips = [];
    
    if (percentage < 70) {
      tips.push("Review the basic concepts before trying again");
      tips.push("Take your time to read questions carefully");
    }
    
    if (wrongAnswers > correctAnswers) {
      tips.push("Practice similar questions to improve accuracy");
    }
    
    if (timeTaken > 0 && difficulty === 'Easy' && timeTaken > 300) {
      tips.push("Try to answer questions more quickly");
    }
    
    if (tips.length === 0) {
      tips.push("You're doing great! Try harder difficulty levels");
      tips.push("Share your achievement with friends");
    }
    
    return tips;
  };

  const tips = getImprovementTips();
  
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Game Results"
        subtitle={gameTitle}
        variant="game"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Main Score Card */}
          <Card variant="game" style={styles.scoreCard}>
            <View style={styles.scoreContent}>
              <Animated.View style={[
                styles.emojiContainer,
                {
                  transform: [{
                    scale: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })
                  }]
                }
              ]}>
                <Text style={styles.resultEmoji}>{emoji}</Text>
              </Animated.View>
              
              <Text style={styles.scoreTitle}>Your Score</Text>
              
              <Animated.View style={[
                styles.scoreValueContainer,
                {
                  opacity: animatedValue,
                }
              ]}>
                <Text style={styles.scoreValue}>{score}/{totalQuestions}</Text>
                <Text style={styles.percentage}>{percentage}%</Text>
              </Animated.View>
              
              <Text style={styles.performanceMessage}>
                {getPerformanceMessage()}
              </Text>
            </View>
          </Card>

          {/* Badge Earned */}
          {showDetails && (
            <Card style={styles.badgeCard}>
              <View style={styles.badgeContent}>
                <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                <Text style={styles.badgeTitle}>Badge Earned!</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>
              </View>
            </Card>
          )}

          {/* Detailed Analytics */}
          {showDetails && (
            <View style={styles.analyticsSection}>
              <Text style={styles.sectionTitle}>Performance Breakdown</Text>
              
              <Card style={styles.analyticsCard}>
                <View style={styles.analyticsGrid}>
                  {isBlockBlast ? (
                    <>
                      <View style={styles.analyticItem}>
                        <Text style={styles.analyticIcon}>🧩</Text>
                        <Text style={styles.analyticValue}>{linesCleared}</Text>
                        <Text style={styles.analyticLabel}>Lines Cleared</Text>
                      </View>
                      
                      <View style={styles.analyticItem}>
                        <Text style={styles.analyticIcon}>🎯</Text>
                        <Text style={styles.analyticValue}>{moves}</Text>
                        <Text style={styles.analyticLabel}>Moves</Text>
                      </View>
                      
                      <View style={styles.analyticItem}>
                        <Text style={styles.analyticIcon}>🔥</Text>
                        <Text style={styles.analyticValue}>{questionStreak}</Text>
                        <Text style={styles.analyticLabel}>Question Streak</Text>
                      </View>
                      
                      <View style={styles.analyticItem}>
                        <Text style={styles.analyticIcon}>📊</Text>
                        <Text style={styles.analyticValue}>{score}</Text>
                        <Text style={styles.analyticLabel}>Total Score</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.analyticItem}>
                        <Text style={styles.analyticIcon}>✅</Text>
                        <Text style={styles.analyticValue}>{correctAnswers}</Text>
                        <Text style={styles.analyticLabel}>Correct</Text>
                      </View>
                      
                      <View style={styles.analyticItem}>
                        <Text style={styles.analyticIcon}>❌</Text>
                        <Text style={styles.analyticValue}>{wrongAnswers}</Text>
                        <Text style={styles.analyticLabel}>Wrong</Text>
                      </View>
                      
                      <View style={styles.analyticItem}>
                        <Text style={styles.analyticIcon}>⏱️</Text>
                        <Text style={styles.analyticValue}>
                          {timeTaken > 0 ? formatTime(timeTaken) : '--'}
                        </Text>
                        <Text style={styles.analyticLabel}>Time</Text>
                      </View>
                      
                      <View style={styles.analyticItem}>
                        <Text style={styles.analyticIcon}>🎯</Text>
                        <Text style={styles.analyticValue}>{Math.round((correctAnswers / totalQuestions) * 100)}%</Text>
                        <Text style={styles.analyticLabel}>Accuracy</Text>
                      </View>
                    </>
                  )}
                </View>
              </Card>
            </View>
          )}

          {/* Improvement Tips */}
          {showDetails && tips.length > 0 && (
            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>Tips for Improvement</Text>
              
              <Card style={styles.tipsCard}>
                {tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <Text style={styles.tipBullet}>💡</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </Card>
            </View>
          )}

          {/* Action Buttons */}
          {showDetails && (
            <View style={styles.actionsSection}>
              <Button
                title="Play Again"
                variant="primary"
                fullWidth
                onPress={() => {
                  navigation.goBack();
                  // Navigate back to game with same parameters
                }}
                style={styles.playAgainButton}
              />
              
              <Button
                title="Try Different Game"
                variant="outline"
                fullWidth
                onPress={() => navigation.navigate('GameSelection')}
                style={styles.tryDifferentButton}
              />
              
              <Button
                title="Back to Dashboard"
                variant="ghost"
                fullWidth
                onPress={() => navigation.navigate('StudentDashboard')}
                style={styles.dashboardButton}
              />
            </View>
          )}

          {/* Share Achievement */}
          {showDetails && percentage >= 70 && (
            <View style={styles.shareSection}>
              <Card variant="filled" style={styles.shareCard}>
                <View style={styles.shareContent}>
                  <Text style={styles.shareIcon}>🎉</Text>
                  <Text style={styles.shareTitle}>Great Achievement!</Text>
                  <Text style={styles.shareText}>
                    You scored {percentage}% in {gameTitle}. Share your success with friends!
                  </Text>
                  <Button
                    title="Share Achievement"
                    variant="secondary"
                    size="small"
                    onPress={() => {
                      // Mock share functionality
                      console.log('Sharing achievement...');
                    }}
                    style={styles.shareButton}
                  />
                </View>
              </Card>
            </View>
          )}

          {/* Learning Progress */}
          {showDetails && (
            <View style={styles.progressSection}>
              <Text style={styles.sectionTitle}>Your Learning Journey</Text>
              
              <Card style={styles.progressCard}>
                <View style={styles.progressContent}>
                  <Text style={styles.progressIcon}>📈</Text>
                  <Text style={styles.progressTitle}>Keep Learning!</Text>
                  <Text style={styles.progressText}>
                    Every game helps you learn something new. Your progress is being tracked across all subjects.
                  </Text>
                  
                  <View style={styles.progressStats}>
                    <View style={styles.progressStat}>
                      <Text style={styles.progressStatValue}>3</Text>
                      <Text style={styles.progressStatLabel}>Games Completed</Text>
                    </View>
                    <View style={styles.progressStat}>
                      <Text style={styles.progressStatValue}>87%</Text>
                      <Text style={styles.progressStatLabel}>Avg. Score</Text>
                    </View>
                    <View style={styles.progressStat}>
                      <Text style={styles.progressStatValue}>5</Text>
                      <Text style={styles.progressStatLabel}>Badges Earned</Text>
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd29d',
  },
  
  scrollView: {
    flex: 1,
  },
  
  content: {
    padding: SPACING.lg,
  },
  
  // Main Score Card
  scoreCard: {
    marginBottom: SPACING.xl,
  },
  
  scoreContent: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  emojiContainer: {
    marginBottom: SPACING.lg,
  },
  
  resultEmoji: {
    fontSize: 80,
  },
  
  scoreTitle: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  scoreValueContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  
  scoreValue: {
    ...TEXT_STYLES.hero,
    color: COLORS.gamePurple,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  percentage: {
    ...TEXT_STYLES.title,
    color: COLORS.accent,
    textAlign: 'center',
  },
  
  performanceMessage: {
    ...TEXT_STYLES.body,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  // Badge Card
  badgeCard: {
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.gameYellow + '20',
  },
  
  badgeContent: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  badgeEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  
  badgeTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  badgeName: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.gameYellow,
    marginBottom: SPACING.xs,
    fontWeight: '700',
  },
  
  badgeDescription: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  // Analytics Section
  analyticsSection: {
    marginBottom: SPACING.xl,
  },
  
  sectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  
  analyticsCard: {
    padding: SPACING.lg,
  },
  
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  analyticItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  analyticIcon: {
    fontSize: 24,
    marginBottom: SPACING.sm,
  },
  
  analyticValue: {
    ...TEXT_STYLES.title,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  analyticLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  // Tips Section
  tipsSection: {
    marginBottom: SPACING.xl,
  },
  
  tipsCard: {
    padding: SPACING.lg,
  },
  
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  
  tipBullet: {
    fontSize: 16,
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  
  tipText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  
  // Actions Section
  actionsSection: {
    marginBottom: SPACING.xl,
  },
  
  playAgainButton: {
    marginBottom: SPACING.md,
  },
  
  tryDifferentButton: {
    marginBottom: SPACING.md,
  },
  
  dashboardButton: {
    // No additional styles
  },
  
  // Share Section
  shareSection: {
    marginBottom: SPACING.xl,
  },
  
  shareCard: {
    backgroundColor: COLORS.success + '20',
  },
  
  shareContent: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  shareIcon: {
    fontSize: 32,
    marginBottom: SPACING.md,
  },
  
  shareTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  
  shareText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  shareButton: {
    // No additional styles
  },
  
  // Progress Section
  progressSection: {
    marginBottom: SPACING.xl,
  },
  
  progressCard: {
    padding: SPACING.lg,
  },
  
  progressContent: {
    alignItems: 'center',
  },
  
  progressIcon: {
    fontSize: 32,
    marginBottom: SPACING.md,
  },
  
  progressTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  
  progressText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  
  progressStat: {
    alignItems: 'center',
  },
  
  progressStatValue: {
    ...TEXT_STYLES.title,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  
  progressStatLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ScoreFeedback;