import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Card } from '../common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ScoreCard = ({ 
  score, 
  totalQuestions, 
  percentage, 
  emojiData, 
  animatedValue, 
  performanceMessage 
}) => {
  return (
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
          <Icon name={emojiData.icon} size={80} color={COLORS.gamePurple} />
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
          {performanceMessage}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
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
});

export default ScoreCard;