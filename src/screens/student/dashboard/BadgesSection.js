import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Badge3D } from '../../../components/common';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/layout';
import { TEXT_STYLES } from '../../../constants/typography';

const BadgesSection = ({ badges }) => {
  const getBadgeVariant = (badgeType, index) => {
    // Map badge types to variants
    const variantMap = {
      'star': 'green',
      'gps-fixed': 'blue', 
      'book': 'purple',
      'trophy': 'vip',
      'medal': 'red'
    };
    
    // If no specific mapping, cycle through variants
    const variants = ['green', 'blue', 'purple', 'red'];
    return variantMap[badgeType] || variants[index % variants.length];
  };

  const getBadgeText = (badgeType) => {
    const textMap = {
      'star': 'STAR',
      'gps-fixed': 'FOCUS', 
      'book': 'LEARN',
      'trophy': 'CHAMP',
      'medal': 'WIN'
    };
    
    return textMap[badgeType] || '';
  };

  return (
    <View style={styles.badgesSection}>
      <Text style={styles.sectionTitle}>Your Badges</Text>
      <Card>
        <View style={styles.badgesContent}>
          {badges.length > 0 ? (
            badges.map((badge, index) => (
              <View key={index} style={styles.badgeContainer}>
                <Badge3D
                  variant={getBadgeVariant(badge.icon, index)}
                  size="small"
                  text={getBadgeText(badge.icon)}
                  isVIP={badge.icon === 'trophy'}
                  style={styles.badge}
                />
                {badge.name && (
                  <Text style={styles.badgeName}>{badge.name}</Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyBadgesContainer}>
              <Badge3D
                variant="green"
                size="large"
                text="?"
                style={styles.emptyBadge}
              />
              <Text style={styles.noBadges}>
                Complete games to earn badges!
              </Text>
            </View>
          )}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  badgesSection: {
    marginBottom: SPACING.xl,
  },

  sectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },

  badgesContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: SPACING.lg,
  },

  badgeContainer: {
    width: '33.33%', // 3 columns
    alignItems: 'center',
    marginVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs, // Add horizontal padding for spacing
  },

  badge: {
    marginBottom: SPACING.xs,
  },

  badgeName: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
  },

  emptyBadgesContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },

  emptyBadge: {
    opacity: 0.3,
    marginBottom: SPACING.md,
  },

  noBadges: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default BadgesSection;