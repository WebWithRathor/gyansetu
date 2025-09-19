import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';

const PublishGame = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Publish Game"
        variant="teacher"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        <Text style={styles.comingSoonIcon}>📤</Text>
        <Text style={styles.comingSoonTitle}>Publish to Classes</Text>
        <Text style={styles.comingSoonText}>
          Publish Game screen is under development. Features will include:
          {'\n\n'}• Select games to publish
          {'\n'}• Choose target classes
          {'\n'}• Set game availability
          {'\n'}• Schedule game releases
          {'\n'}• Monitor student engagement
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd29d',
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  
  comingSoonTitle: {
    ...TEXT_STYLES.title,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  comingSoonText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default PublishGame;