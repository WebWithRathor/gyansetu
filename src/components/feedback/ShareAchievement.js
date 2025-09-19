import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from '../common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ShareAchievement = ({ percentage, gameTitle }) => {
  if (percentage < 70) return null;

  return (
    <View style={styles.shareSection}>
      <Card variant="filled" style={styles.shareCard}>
        <View style={styles.shareContent}>
          <MaterialCommunityIcons name="party-popper" size={32} color={COLORS.success} style={styles.shareIcon} />
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
  );
};

const styles = StyleSheet.create({
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
});

export default ShareAchievement;