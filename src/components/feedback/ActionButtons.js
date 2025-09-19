import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../common';
import { SPACING } from '../../constants/layout';

const ActionButtons = ({ navigation }) => {
  return (
    <View style={styles.actionsSection}>
      <Button
        title="Play Again"
        variant="primary"
        fullWidth
        onPress={() => {
          navigation.goBack();
          // Navigate back to game with same parameters
        }}
        style={styles.playAgainButton}
      />
      
      <Button
        title="Try Different Game"
        variant="outline"
        fullWidth
        onPress={() => navigation.navigate('GameSelection')}
        style={styles.tryDifferentButton}
      />
      
      <Button
        title="Back to Dashboard"
        variant="secondary"
        fullWidth
        onPress={() => navigation.navigate('StudentDashboard')}
        style={styles.dashboardButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionsSection: {
    marginBottom: SPACING.xl,
  },
  
  playAgainButton: {
    marginBottom: SPACING.md,
  },
  
  tryDifferentButton: {
    marginBottom: SPACING.md,
  },
  
  dashboardButton: {
    // No additional styles
  },
});

export default ActionButtons;