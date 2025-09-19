import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { useApp } from '../../context/AppContext';

const UserTypeSelection = ({ navigation }) => {
  const { setUserType } = useApp();
  
  const handleTeacherSelect = () => {
    setUserType('teacher');
    navigation.navigate('TeacherAuth');
  };
  
  const handleStudentSelect = () => {
    setUserType('student');
    navigation.navigate('StudentAuth');
  };
  
  return (
    <>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appName}>Gyansetu</Text>
            <Text style={styles.tagline}>Learn. Play. Grow.</Text>
            <Text style={styles.description}>
              A gamified learning platform for rural students
            </Text>
          </View>
          
          {/* Selection Cards */}
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>I am a...</Text>
            
            <Card
              variant="teacher"
              onPress={handleTeacherSelect}
              style={styles.selectionCard}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardIcon}>👩‍🏫</Text>
                <Text style={styles.cardTitle}>Teacher</Text>
                <Text style={styles.cardDescription}>
                  Create classes, add students, and design learning games
                </Text>
                <View style={styles.cardFeatures}>
                  <Text style={styles.featureText}>• Create interactive games</Text>
                  <Text style={styles.featureText}>• Manage students</Text>
                  <Text style={styles.featureText}>• Track progress</Text>
                </View>
              </View>
            </Card>
            
            <Card
              variant="student"
              onPress={handleStudentSelect}
              style={styles.selectionCard}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardIcon}>🎓</Text>
                <Text style={styles.cardTitle}>Student</Text>
                <Text style={styles.cardDescription}>
                  Play educational games and learn while having fun
                </Text>
                <View style={styles.cardFeatures}>
                  <Text style={styles.featureText}>• Play learning games</Text>
                  <Text style={styles.featureText}>• Earn points & badges</Text>
                  <Text style={styles.featureText}>• Learn offline</Text>
                </View>
              </View>
            </Card>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Optimized for rural areas with low connectivity
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd29d',
  },
  
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'space-between',
  },
  
  header: {
    alignItems: 'center',
    marginTop: SPACING.xxxl,
  },
  
  appName: {
    ...TEXT_STYLES.hero,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  
  tagline: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.secondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  
  description: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: SPACING.xl,
  },
  
  selectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  
  selectionCard: {
    marginBottom: SPACING.lg,
  },
  
  cardContent: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  cardIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  
  cardTitle: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  
  cardDescription: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  cardFeatures: {
    alignItems: 'flex-start',
  },
  
  featureText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  
  footer: {
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
  
  footerText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default UserTypeSelection;