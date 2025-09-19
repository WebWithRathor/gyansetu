import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LearningProgress = () => {
  return (
    <View style={styles.progressSection}>
      <Text style={styles.sectionTitle}>Your Learning Journey</Text>
      
      <Card style={styles.progressCard}>
        <View style={styles.progressContent}>
          <Icon name="trending-up" size={32} color={COLORS.primary} style={styles.progressIcon} />
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
  );
};

const styles = StyleSheet.create({
  progressSection: {
    marginBottom: SPACING.xl,
  },
  
  sectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  
  progressCard: {
    padding: SPACING.lg,
  },
  
  progressContent: {
    alignItems: 'center',
  },
  
  progressIcon: {
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

export default LearningProgress;