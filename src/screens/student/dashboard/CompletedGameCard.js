import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/common';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/layout';
import { TEXT_STYLES } from '../../../constants/typography';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CompletedGameCard = ({ game, onGamePress }) => {
  return (
    <Card
      onPress={() => onGamePress(game)}
      style={styles.completedGameCard}
      elevation="low"
    >
      <View style={styles.gameContent}>
        <Icon 
          name={game.icon} 
          size={32} 
          color={COLORS.gamePurple} 
          style={styles.gameIcon} 
        />
        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle}>{game.title}</Text>
          <Text style={styles.gameSubject}>{game.subject}</Text>
          <Text style={styles.completedScore}>
            Score: {game.score}%
          </Text>
        </View>
        <View style={styles.gameAction}>
          <Icon 
            name="refresh" 
            size={20} 
            color={COLORS.primary} 
            style={styles.replayIcon} 
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  completedGameCard: {
    marginBottom: SPACING.sm,
    opacity: 0.8,
  },

  gameContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },

  gameIcon: {
    marginRight: SPACING.lg,
  },

  gameInfo: {
    flex: 1,
  },

  gameTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  gameSubject: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.accent,
    marginBottom: SPACING.sm,
  },

  completedScore: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.success,
    fontWeight: '600',
  },

  gameAction: {
    padding: SPACING.sm,
  },

  replayIcon: {
    // No additional styles needed for icon
  },
});

export default CompletedGameCard;