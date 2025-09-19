import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ImprovementTips = ({ tips }) => {
  if (!tips || tips.length === 0) return null;

  return (
    <View style={styles.tipsSection}>
      <Text style={styles.sectionTitle}>Tips for Improvement</Text>
      
      <Card style={styles.tipsCard}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Icon name="lightbulb-outline" size={16} color={COLORS.gameYellow} style={styles.tipBullet} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  tipsSection: {
    marginBottom: SPACING.xl,
  },
  
  sectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.lg,
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
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  
  tipText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
});

export default ImprovementTips;