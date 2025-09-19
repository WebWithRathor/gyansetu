import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PublishGame = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        title="Publish Game"
        variant="teacher"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        <Icon name="publish" size={64} color={COLORS.primary} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.teacherBackground,
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
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