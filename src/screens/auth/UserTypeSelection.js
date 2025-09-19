import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { Card } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { useApp } from '../../context/AppContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.authBackground} barStyle="dark-content" />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="auto-stories" size={36} color={COLORS.primary} />
            <Text style={styles.appName}>Gyansetu</Text>
          </View>
          <Text style={styles.tagline}>Learn • Play • Grow</Text>
        </View>
        
        {/* Selection Cards */}
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionTitle}>Choose Your Role</Text>
          
          <Card
            variant="teacher"
            onPress={handleTeacherSelect}
            style={styles.selectionCard}
            elevation="high"
          >
            <View style={styles.cardContent}>
              <Icon name="school" size={48} color={COLORS.white} style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Teacher</Text>
              <View style={styles.quickFeatures}>
                <View style={styles.featureItem}>
                  <Icon name="add-circle" size={16} color={COLORS.accent} />
                  <Text style={styles.featureText}>Create Games</Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="people" size={16} color={COLORS.accent} />
                  <Text style={styles.featureText}>Manage Students</Text>
                </View>
              </View>
            </View>
          </Card>
          
          <Card
            variant="student"
            onPress={handleStudentSelect}
            style={styles.selectionCard}
            elevation="high"
          >
            <View style={styles.cardContent}>
              <Icon name="sports-esports" size={48} color={COLORS.white} style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Student</Text>
              <View style={styles.quickFeatures}>
                <View style={styles.featureItem}>
                  <Icon name="videogame-asset" size={16} color={COLORS.accent} />
                  <Text style={styles.featureText}>Play Games</Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="emoji-events" size={16} color={COLORS.accent} />
                  <Text style={styles.featureText}>Earn Badges</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Icon name="offline-bolt" size={18} color={COLORS.textLight} />
          <Text style={styles.footerText}>Works Offline</Text>
        </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.authBackground,
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24,
  },
  
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'space-between',
  },
  
  header: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  
  appName: {
    ...TEXT_STYLES.hero,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  tagline: {
    ...TEXT_STYLES.subtitle,
    color: "black",
    textAlign: 'center',
    fontWeight: '600',
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
    fontWeight: 'bold',
  },
  
  selectionCard: {
    marginBottom: SPACING.lg,
    transform: [{ scale: 1 }],
    backgroundColor: COLORS.tertiary,
    color: COLORS.white,
    
    // borderColor: COLORS.tertiary,
  },
  
  cardContent: {
    alignItems: 'center',
    padding: SPACING.xl,
  },

  cardIcon: {
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  
  cardTitle: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  quickFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: SPACING.sm,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginHorizontal: SPACING.xs,
  },
  
  featureText: {
    ...TEXT_STYLES.caption,
    color: COLORS.text,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.lg,
  },
  
  footerText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
});

export default UserTypeSelection;