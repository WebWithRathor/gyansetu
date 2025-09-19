import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Badge3D } from '../common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';

const BadgeCard = ({ badge }) => {
  // Map badge types to 3D badge variants
  const getBadgeVariant = () => {
    switch (badge.name) {
      case 'Perfect Score':
        return { variant: 'vip', isVIP: true };
      case 'Star Player':
        return { variant: 'purple', isVIP: false };
      case 'Sharp Shooter':
        return { variant: 'blue', isVIP: false };
      case 'Good Effort':
        return { variant: 'green', isVIP: false };
      case 'Keep Going':
        return { variant: 'red', isVIP: false };
      default:
        return { variant: 'green', isVIP: false };
    }
  };

  const badgeProps = getBadgeVariant();

  return (
    <Card style={styles.badgeCard}>
      <View style={styles.badgeContent}>
        <Badge3D 
          variant={badgeProps.variant}
          isVIP={badgeProps.isVIP}
          size="large"
          style={styles.badge3D}
        />
        <Text style={styles.badgeTitle}>Badge Earned!</Text>
        <Text style={styles.badgeName}>{badge.name}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  badgeCard: {
    marginBottom: SPACING.xl,
    // backgroundColor: COLORS.gameYellow + '20',
    borderLeftWidth:6
  },
  
  badgeContent: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  badge3D: {
    marginBottom: SPACING.lg,
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
});

export default BadgeCard;