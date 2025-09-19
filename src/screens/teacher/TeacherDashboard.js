import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Header } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { useApp } from '../../context/AppContext';
import { getClasses, getStudents, getGames } from '../../utils/storage';

const TeacherDashboard = ({ navigation }) => {
  const { teacherData, logout } = useApp();
  const [dashboardData, setDashboardData] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalGames: 0,
    recentActivity: [],
  });
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      const classes = await getClasses();
      const students = await getStudents();
      const games = await getGames();
      
      setDashboardData({
        totalClasses: classes.length,
        totalStudents: students.length,
        totalGames: games.length,
        recentActivity: [
          'Created new class: Math Class 8A',
          'Added 15 students to Science Class',
          'Published Matching Game: Basic Algebra',
        ],
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('UserTypeSelection');
          }
        },
      ]
    );
  };
  
  const quickActions = [
    {
      title: 'Create Class',
      subtitle: 'Start a new class for your students',
      icon: '🏫',
      color: COLORS.primary,
      onPress: () => navigation.navigate('CreateClass'),
    },
    {
      title: 'Add Students',
      subtitle: 'Add students to your existing classes',
      icon: '👥',
      color: COLORS.success,
      onPress: () => navigation.navigate('AddStudents'),
    },
    {
      title: 'Create Content',
      subtitle: 'Design new learning games',
      icon: '🎮',
      color: COLORS.gamePurple,
      onPress: () => navigation.navigate('CreateContent'),
    },
    {
      title: 'Publish Game',
      subtitle: 'Share games with your classes',
      icon: '📤',
      color: COLORS.accent,
      onPress: () => navigation.navigate('PublishGame'),
    },
  ];
  
  const statsCards = [
    {
      title: 'Classes',
      value: dashboardData.totalClasses,
      icon: '🏫',
      color: COLORS.primary,
    },
    {
      title: 'Students',
      value: dashboardData.totalStudents,
      icon: '👥',
      color: COLORS.success,
    },
    {
      title: 'Games',
      value: dashboardData.totalGames,
      icon: '🎮',
      color: COLORS.gamePurple,
    },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Teacher Dashboard"
        subtitle={`Welcome, ${teacherData?.name || 'Teacher'}`}
        variant="teacher"
        rightIcon={<Text style={styles.logoutIcon}>👋</Text>}
        onRightPress={handleLogout}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Welcome Card */}
          <Card variant="teacher" style={styles.welcomeCard}>
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeIcon}>👩‍🏫</Text>
              <View style={styles.welcomeText}>
                <Text style={styles.welcomeTitle}>Good to see you!</Text>
                <Text style={styles.welcomeSubtitle}>
                  {teacherData?.schoolName || 'School Name'}
                </Text>
                <Text style={styles.welcomeDescription}>
                  Ready to create engaging learning experiences for your students?
                </Text>
              </View>
            </View>
          </Card>
          
          {/* Stats Cards */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              {statsCards.map((stat, index) => (
                <Card key={index} style={styles.statCard} elevation="low">
                  <View style={styles.statContent}>
                    <Text style={styles.statIcon}>{stat.icon}</Text>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statTitle}>{stat.title}</Text>
                  </View>
                </Card>
              ))}
            </View>
          </View>
          
          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  onPress={action.onPress}
                  style={styles.actionCard}
                  elevation="medium"
                >
                  <View style={styles.actionContent}>
                    <Text style={styles.actionIcon}>{action.icon}</Text>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </View>
                </Card>
              ))}
            </View>
          </View>
          
          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Card>
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity, index) => (
                  <View key={index} style={styles.activityItem}>
                    <Text style={styles.activityDot}>•</Text>
                    <Text style={styles.activityText}>{activity}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyActivity}>
                  <Text style={styles.emptyActivityText}>
                    No recent activity. Start by creating a class!
                  </Text>
                </View>
              )}
            </Card>
          </View>
          
          {/* Help Section */}
          <View style={styles.helpSection}>
            <Card variant="filled">
              <View style={styles.helpContent}>
                <Text style={styles.helpIcon}>💡</Text>
                <Text style={styles.helpTitle}>Getting Started Tips</Text>
                <Text style={styles.helpText}>
                  1. Create your first class{'\n'}
                  2. Add students to the class{'\n'}
                  3. Design educational games{'\n'}
                  4. Publish games to your students
                </Text>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd29d',
  },
  
  scrollView: {
    flex: 1,
  },
  
  content: {
    padding: SPACING.lg,
  },
  
  // Welcome Card
  welcomeCard: {
    marginBottom: SPACING.xl,
  },
  
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  welcomeIcon: {
    fontSize: 48,
    marginRight: SPACING.lg,
  },
  
  welcomeText: {
    flex: 1,
  },
  
  welcomeTitle: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  welcomeSubtitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  
  welcomeDescription: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  // Stats Section
  statsSection: {
    marginBottom: SPACING.xl,
  },
  
  sectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  
  statCard: {
    width: '30%',
    height: 120,
    marginBottom: SPACING.md,
  },
  
  statContent: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  statIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  
  statValue: {
    ...TEXT_STYLES.title,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  statTitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  // Actions Section
  actionsSection: {
    marginBottom: SPACING.xl,
  },
  
  actionsGrid: {
    display:'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  actionCard: {
    width: 120,
    height: 150,
    backgroundColor: "skyblue",
    marginBottom: SPACING.md,
  },
  
  actionContent: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  actionIcon: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  
  actionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  
  actionSubtitle: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  // Activity Section
  activitySection: {
    marginBottom: SPACING.xl,
  },
  
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  
  activityDot: {
    ...TEXT_STYLES.body,
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  
  activityText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    flex: 1,
  },
  
  emptyActivity: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  
  emptyActivityText: {
    ...TEXT_STYLES.body,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  
  // Help Section
  helpSection: {
    marginBottom: SPACING.xl,
  },
  
  helpContent: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  
  helpIcon: {
    fontSize: 32,
    marginBottom: SPACING.md,
  },
  
  helpTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  helpText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Header Icons
  logoutIcon: {
    fontSize: 24,
  },
});

export default TeacherDashboard;