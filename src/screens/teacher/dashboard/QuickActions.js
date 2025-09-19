import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SPACING } from '../../../constants/layout';
import { TEXT_STYLES } from '../../../constants/typography';
import { COLORS } from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const QuickActions = ({ navigation }) => {
  const quickActions = [
    {
      title: 'Create Class',
      subtitle: 'Start a new class',
      icon: 'school',
      iconType: 'MaterialIcons',
      color: COLORS.primary,
      onPress: () => navigation.navigate('CreateClass'),
    },
    {
      title: 'Add Students',
      subtitle: 'Add students to classes',
      icon: 'groups',
      iconType: 'MaterialIcons',
      color: COLORS.success,
      onPress: () => navigation.navigate('AddStudents'),
    },
    {
      title: 'Create Content',
      subtitle: 'Design new games',
      icon: 'gamepad-variant',
      iconType: 'MaterialCommunityIcons',
      color: COLORS.gamePurple,
      onPress: () => navigation.navigate('CreateContent'),
    },
    {
      title: 'Publish Game',
      subtitle: 'Share with classes',
      icon: 'publish',
      iconType: 'MaterialIcons',
      color: COLORS.accent,
      onPress: () => navigation.navigate('PublishGame'),
    },
  ];

  return (
    <View style={styles.actionsSection}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((action, index) => (
          <View key={index} style={styles.cardWrapper}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              {/* Highlight overlay for 3D effect */}
              <View style={styles.highlight} />
              
              <View style={styles.actionContent}>
                <View style={styles.iconContainer}>
                  {action.iconType === 'MaterialCommunityIcons' ? (
                    <MaterialCommunityIcons name={action.icon} size={24} color={COLORS.primary} />
                  ) : (
                    <Icon name={action.icon} size={24} color={COLORS.primary} />
                  )}
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
              
              {/* Inner shadow for depth */}
              <View style={styles.innerShadow} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsSection: {
    marginBottom: SPACING.xl,
  },
  
  sectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  cardWrapper: {
    width: '48%',
    marginBottom: SPACING.md,
    borderBottomWidth: 7,
    borderBottomColor: '#66666686',
    borderRadius: 15,
  },
  
  actionCard: {
    height: 140,
    backgroundColor: COLORS.teacherBackgroundDark,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000ff',
    shadowColor: COLORS.teacherBackgroundDark,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  
  actionContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    height: '100%',
    position: 'relative',
    zIndex: 2,
  },
  
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.99)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  actionTitle: {
    ...TEXT_STYLES.bodyLarge,
    color: '#fff',
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  actionSubtitle: {
    ...TEXT_STYLES.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  
  // 3D Effect styles
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    zIndex: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  // Inner shadow for depth
  innerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
});

export default QuickActions;