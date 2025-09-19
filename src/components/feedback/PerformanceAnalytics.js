import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { formatTime } from '../../utils/helpers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PerformanceAnalytics = ({ 
  isBlockBlast, 
  linesCleared, 
  moves, 
  questionStreak, 
  score,
  correctAnswers,
  wrongAnswers,
  timeTaken,
  totalQuestions 
}) => {
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  return (
    <View style={styles.analyticsSection}>
      <Text style={styles.sectionTitle}>Performance Breakdown</Text>
      
      <View style={styles.analyticsContainer}>
        {isBlockBlast ? (
          <>
            <View style={styles.analyticItem}>
              <View style={styles.analyticCard}>
                <MaterialCommunityIcons name="puzzle" size={28} color={COLORS.gamePurple} />
                <Text style={styles.analyticValue}>{linesCleared || 0}</Text>
                <Text style={styles.analyticLabel}>Lines Cleared</Text>
              </View>
            </View>
            
            <View style={styles.analyticItem}>
              <View style={styles.analyticCard}>
                <Icon name="touch-app" size={28} color={COLORS.primary} />
                <Text style={styles.analyticValue}>{moves || 0}</Text>
                <Text style={styles.analyticLabel}>Moves</Text>
              </View>
            </View>
            
            <View style={styles.analyticItem}>
              <View style={styles.analyticCard}>
                <MaterialCommunityIcons name="fire" size={28} color={COLORS.warning} />
                <Text style={styles.analyticValue}>{questionStreak || 0}</Text>
                <Text style={styles.analyticLabel}>Question Streak</Text>
              </View>
            </View>
            
            <View style={styles.analyticItem}>
              <View style={styles.analyticCard}>
                <Icon name="star" size={28} color={COLORS.accent} />
                <Text style={styles.analyticValue}>{score || 0}</Text>
                <Text style={styles.analyticLabel}>Total Score</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.analyticItem}>
              <View style={[styles.analyticCard, styles.successCard]}>
                <Icon name="check-circle" size={28} color={COLORS.success} />
                <Text style={styles.analyticValue}>{correctAnswers || 0}</Text>
                <Text style={styles.analyticLabel}>Correct</Text>
              </View>
            </View>
            
            <View style={styles.analyticItem}>
              <View style={[styles.analyticCard, styles.errorCard]}>
                <Icon name="cancel" size={28} color={COLORS.error} />
                <Text style={styles.analyticValue}>{wrongAnswers || 0}</Text>
                <Text style={styles.analyticLabel}>Wrong</Text>
              </View>
            </View>
            
            <View style={styles.analyticItem}>
              <View style={styles.analyticCard}>
                <Icon name="timer" size={28} color={COLORS.primary} />
                <Text style={styles.analyticValue}>
                  {timeTaken > 0 ? formatTime(timeTaken) : '--'}
                </Text>
                <Text style={styles.analyticLabel}>Time Taken</Text>
              </View>
            </View>
            
            <View style={styles.analyticItem}>
              <View style={[styles.analyticCard, styles.accuracyCard]}>
                <Icon name="target" size={28} color={COLORS.accent} />
                <Text style={styles.analyticValue}>{accuracy}%</Text>
                <Text style={styles.analyticLabel}>Accuracy</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  analyticsSection: {
    marginBottom: SPACING.xl,
  },
  
  sectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  
  analyticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  
  analyticItem: {
    flex: 1,
  },
  
  analyticCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    borderTopColor: '#333333',
    borderLeftColor: '#333333',
    borderRightColor: '#000000',
    borderBottomColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    minHeight: 100,
    justifyContent: 'center',
  },
  
  successCard: {
    backgroundColor: "#cbf3f0",
    borderColor: '#000000',
    borderTopColor: '#333333',
    borderLeftColor: '#333333',
    borderRightColor: '#000000',
    borderBottomColor: '#000000',
    shadowColor: '#000000',
  },
  
  errorCard: {
    backgroundColor: "#faedcd",
    borderColor: '#000000',
    borderTopColor: '#333333',
    borderLeftColor: '#333333',
    borderRightColor: '#000000',
    borderBottomColor: '#000000',
    shadowColor: '#000000',
  },
  
  accuracyCard: {
    backgroundColor: '#ede0d4',
    borderColor: '#000000',
    borderTopColor: '#333333',
    borderLeftColor: '#333333',
    borderRightColor: '#000000',
    borderBottomColor: '#000000',
    shadowColor: '#000000',
  },
  
  analyticValue: {
    ...TEXT_STYLES.subtitle,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: SPACING.xs,
  },
  
  analyticLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 11,
  },
});

export default PerformanceAnalytics;