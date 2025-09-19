import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card } from '../../../components/common';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/layout';
import { TEXT_STYLES } from '../../../constants/typography';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GameCard = ({ game, onGamePress, getDifficultyColor }) => {
  const handlePress = () => {
    if (!game.isDownloaded) {
      Alert.alert(
        'Game Not Available',
        'This game needs to be downloaded. Please connect to internet to download.',
        [{ text: 'OK' }],
      );
      return;
    }
    onGamePress(game);
  };

  return (
    <Card
      onPress={handlePress}
      style={styles.gameCard}
      elevation="medium"
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
          <View style={styles.gameDetails}>
            <Text
              style={[
                styles.gameDifficulty,
                { color: getDifficultyColor(game.difficulty) },
              ]}
            >
              {game.difficulty}
            </Text>
            <Text style={styles.gameTime}>
              • {game.estimatedTime}
            </Text>
            <Text style={styles.gameQuestions}>
              • {game.totalQuestions} questions
            </Text>
          </View>
          {!game.isDownloaded && (
            <View style={styles.downloadRequired}>
              <Icon name="file-download" size={14} color={COLORS.warning} />
              <Text style={styles.downloadRequiredText}> Download required</Text>
            </View>
          )}
        </View>
        <View style={styles.gameAction}>
          <Icon 
            name="play-arrow" 
            size={24} 
            color={COLORS.primary} 
            style={styles.playIcon} 
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  gameCard: {
    marginBottom: SPACING.md,
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

  gameDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  gameDifficulty: {
    ...TEXT_STYLES.caption,
    fontWeight: '600',
  },

  gameTime: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },

  gameQuestions: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },

  downloadRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },

  downloadRequiredText: {
    ...TEXT_STYLES.caption,
    color: COLORS.warning,
  },

  gameAction: {
    padding: SPACING.sm,
  },

  playIcon: {
    // No additional styles needed for icon
  },
});

export default GameCard;