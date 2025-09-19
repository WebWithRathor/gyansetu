import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/layout';
import { TEXT_STYLES } from '../../../constants/typography';
import CompletedGameCard from './CompletedGameCard';

const CompletedGamesSection = ({ completedGames, onGamePress }) => {
  if (completedGames.length === 0) {
    return null;
  }

  return (
    <View style={styles.completedSection}>
      <Text style={styles.sectionTitle}>Completed Games</Text>
      {completedGames.map(game => (
        <CompletedGameCard
          key={game.id}
          game={game}
          onGamePress={onGamePress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  completedSection: {
    marginBottom: SPACING.xl,
  },

  sectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
});

export default CompletedGamesSection;