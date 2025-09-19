import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { Header } from '../../components/common';
import { 
  ScoreCard, 
  BadgeCard, 
  PerformanceAnalytics, 
  ImprovementTips, 
  ActionButtons, 
  ShareAchievement, 
  LearningProgress 
} from '../../components/feedback';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { getScoreEmoji } from '../../utils/helpers';

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
  const emojiData = getScoreEmoji(correctAnswers, totalQuestions);
  
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
    if (percentage >= 95) return { 
      icon: 'emoji-events', 
      name: 'Perfect Score', 
      description: 'Flawless performance! You got 95% or higher!', 
      iconType: 'MaterialIcons' 
    };
    if (percentage >= 90) return { 
      icon: 'star', 
      name: 'Star Player', 
      description: 'Outstanding! You scored 90% or higher!', 
      iconType: 'MaterialIcons' 
    };
    if (percentage >= 80) return { 
      icon: 'gps-fixed', 
      name: 'Sharp Shooter', 
      description: 'Excellent accuracy! You scored 80% or higher!', 
      iconType: 'MaterialIcons' 
    };
    if (percentage >= 70) return { 
      icon: 'thumb-up', 
      name: 'Good Effort', 
      description: 'Well done! You scored 70% or higher!', 
      iconType: 'MaterialIcons' 
    };
    if (percentage >= 60) return { 
      icon: 'trending-up', 
      name: 'Keep Going', 
      description: 'Nice try! You scored 60% or higher!', 
      iconType: 'MaterialIcons' 
    };
    return { 
      icon: 'school', 
      name: 'Learner', 
      description: 'Every attempt makes you stronger!', 
      iconType: 'MaterialIcons' 
    };
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
    <View style={styles.container}>
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
          <ScoreCard
            score={score}
            totalQuestions={totalQuestions}
            percentage={percentage}
            emojiData={emojiData}
            animatedValue={animatedValue}
            performanceMessage={getPerformanceMessage()}
          />

          {/* Badge Earned */}
          {showDetails && (
            <BadgeCard badge={badge} />
          )}

          {/* Detailed Analytics */}
          {showDetails && (
            <PerformanceAnalytics
              isBlockBlast={isBlockBlast}
              linesCleared={linesCleared}
              moves={moves}
              questionStreak={questionStreak}
              score={score}
              correctAnswers={correctAnswers}
              wrongAnswers={wrongAnswers}
              timeTaken={timeTaken}
              totalQuestions={totalQuestions}
            />
          )}

          {/* Improvement Tips */}
          {showDetails && (
            <ImprovementTips tips={tips} />
          )}

          {/* Action Buttons */}
          {showDetails && (
            <ActionButtons navigation={navigation} />
          )}

         
          
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.studentBackground,
  },
  
  scrollView: {
    flex: 1,
  },
  
  content: {
    padding: SPACING.lg,
  },
});

export default ScoreFeedback;