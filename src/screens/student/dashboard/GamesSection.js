import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button } from '../../../components/common';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/layout';
import { TEXT_STYLES } from '../../../constants/typography';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GameCard from './GameCard';

const GamesSection = ({ 
  availableGames, 
  onGamePress, 
  getDifficultyColor, 
  onViewAllPress 
}) => {
  return (
    <View style={styles.gamesSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Games</Text>
        <Button
          title="View All"
          variant="ghost"
          size="small"
          onPress={onViewAllPress}
          style={styles.viewAllButton}
        />
      </View>
      {availableGames.length > 0 ? (
        availableGames.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onGamePress={onGamePress}
            getDifficultyColor={getDifficultyColor}
          />
        ))
      ) : (
        <Card>
          <View style={styles.emptyGames}>
            <MaterialCommunityIcons 
              name="gamepad-variant" 
              size={48} 
              color={COLORS.textSecondary} 
              style={styles.emptyGamesIcon} 
            />
            <Text style={styles.emptyGamesText}>
              No games available right now.{'\n'}
              Ask your teacher to publish some games!
            </Text>
          </View>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gamesSection: {
    marginBottom: SPACING.xl,
  },

  sectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  viewAllButton: {
    paddingHorizontal: 0,
  },

  emptyGames: {
    alignItems: 'center',
    padding: SPACING.xl,
  },

  emptyGamesIcon: {
    marginBottom: SPACING.lg,
  },

  emptyGamesText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default GamesSection;