import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../../components/common';

const ProgressStats = ({ dashboardData, styles }) => {
  const stats = [
    {
      icon: '🎮',
      value: dashboardData.availableGames.length,
      label: 'Available',
    },
    {
      icon: '✅',
      value: dashboardData.completedGames.length,
      label: 'Completed',
    },
    { icon: '🏆', value: dashboardData.badges.length, label: 'Badges' },
  ];

  return (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Your Progress</Text>
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard} elevation="low">
            <View style={styles.statContent}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
};

export default ProgressStats;
