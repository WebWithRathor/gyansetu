import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SPACING } from '../../../constants/layout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TEXT_STYLES } from '../../../constants/typography';
import { COLORS } from '../../../constants/colors';

const TeacherStats = ({ dashboardData }) => {
  const stats = [
    {
      iconName: 'school',
      icon: 'school',
      iconType: 'MaterialIcons',
      value: dashboardData.totalClasses,
      label: 'Classes',
      backgroundColor: '#e3e5f0ff',
      shadowColor: '#4a5bb8',
      textColor: '#000',
    },
    { 
      iconName: 'people',
      icon: 'people',
      iconType: 'MaterialIcons',
      value: dashboardData.totalStudents,
      label: 'Students',
      backgroundColor: '#f8e4eeff',
      shadowColor: '#d63384',
      textColor: '#000',
    },
    { 
      iconName: 'games', 
      icon: 'gamepad-variant',
      iconType: 'MaterialCommunityIcons',
      value: dashboardData.totalGames, 
      label: 'Games',
      backgroundColor: '#dbefdfff',
      shadowColor: '#0d6efd',
      textColor: '#000',
    },
  ];

  return (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View key={index} style={bubbleStyles.cardWrapper}>
            <View style={[bubbleStyles.statCard, { 
              shadowColor: stat.shadowColor,
              backgroundColor: stat.backgroundColor,
            }]}>
              <View style={bubbleStyles.statContent}>
                <View style={bubbleStyles.iconContainer}>
                {stat.iconType === 'MaterialCommunityIcons' ? (
                  <MaterialCommunityIcons 
                    name={stat.icon} 
                    size={48} 
                    color={stat.textColor} 
                    style={bubbleStyles.fallbackIcon}
                  />
                ) : (
                  <Icon 
                    name={stat.icon} 
                    size={40} 
                    color={stat.textColor} 
                    style={bubbleStyles.fallbackIcon}
                  />
                )}
                </View>
                <Text style={[bubbleStyles.statValue, { color: stat.textColor }]}>{stat.value}</Text>
              </View>
              {/* Highlight overlay for 3D effect */}
              <View style={bubbleStyles.highlight} />
              {/* Inner shadow for depth */}
              <View style={bubbleStyles.innerShadow} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsSection: {
    marginBottom: SPACING.xl,
    width: '100%',
    borderRadius: 15,
  },
  sectionTitle: {
      ...TEXT_STYLES.heading,
      color: COLORS.text,
    },
  
    statsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingTop: SPACING.lg,
    },
});

const bubbleStyles = StyleSheet.create({
  cardWrapper: {
    width: '30%',
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
    borderBottomWidth: 7,
    borderBottomColor: '#66666686',
    borderRadius: 15,
  },
  
  statCard: {
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    padding: SPACING.lg,
    borderColor: '#000000ff',
  },
  
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    height: '100%',
    position: 'relative',
    zIndex: 2,
  },
  
  iconContainer: {
    width: 59,
    height: 59,
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
  
  statIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  fallbackIcon: {
    // No additional styles needed for icon
  },
  
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: -4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  
  statLabel: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
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

export default TeacherStats;