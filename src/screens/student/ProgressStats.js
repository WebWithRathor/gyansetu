import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SPACING } from '../../constants/layout';

const ProgressStats = ({ dashboardData, styles }) => {
  const stats = [
    {
      iconName: 'games',
      fallbackIcon: '🎮',
      value: dashboardData.availableGames.length,
      label: 'Available',
      backgroundColor: '#e3e5f0ff',
      shadowColor: '#4a5bb8',
      textColor: '#000',
    },
    { 
      iconName: 'check-circle',
      fallbackIcon: '✔️',
      value: dashboardData.completedGames.length,
      label: 'Completed',
      backgroundColor: '#f8e4eeff',
      shadowColor: '#d63384',
      textColor: '#000',
    },
    { 
      iconName: 'emoji-events', 
      fallbackIcon: '⭐',
      value: dashboardData.badges.length, 
      label: 'Badges',
      backgroundColor: '#dbefdfff',
      shadowColor: '#0d6efd',
      textColor: '#000',
    },
  ];

  // const renderIcon = (stat) => {
  //   try {
  //     return (
  //       <Icon 
  //         name={stat.iconName} 
  //         size={28} 
  //         color="rgba(255, 255, 255, 0.95)" 
  //         style={bubbleStyles.statIcon}
  //       />
  //     );
  //   } catch (error) {
  //     // Fallback to emoji if vector icon fails
  //     return (
  //       <Text style={[bubbleStyles.statIcon, bubbleStyles.fallbackIcon]}>
  //         {stat.fallbackIcon}
  //       </Text>
  //     );
  //   }
  // };

  return (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Your Progress</Text>
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View key={index} style={bubbleStyles.cardWrapper}>
            <View style={[bubbleStyles.statCard, { 
              shadowColor: stat.shadowColor,
              backgroundColor: stat.backgroundColor,
            }]}>
              <View style={bubbleStyles.statContent}>
                  <Text style={[bubbleStyles.fallbackIcon, { color: stat.textColor }]}>
                    {stat.fallbackIcon}
                  </Text>
                <View style={bubbleStyles.iconContainer}>
                  {/* {renderIcon(stat)} */}
                <Text style={[bubbleStyles.statValue, { color: stat.textColor }]}>{stat.value}</Text>
                </View>
                {/* <Text style={[bubbleStyles.statLabel, { color: stat.textColor }]}>{stat.label}</Text> */}
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

const bubbleStyles = StyleSheet.create({
  cardWrapper: {
    width: '47%',
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
    borderBottomWidth: 7,
    borderBottomColor: '#66666686',
    borderRadius: 15,
  },
  
  statCard: {
    height: 100,
    borderRadius: 10,
    borderWidth:2,
    padding: SPACING.lg,
    borderColor:'#000000ff',
  },
  
  statContent: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
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
  
  statIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  fallbackIcon: {
    fontSize: 28,
    // color: 'rgba(255, 255, 255, 0.95)',
    
  },
  
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    // color: '#FFFFFF',
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
  

  // Inner shadow for depth
  innerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
});

export default ProgressStats;
