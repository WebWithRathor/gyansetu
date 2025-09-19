import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Header } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { useApp } from '../../context/AppContext';
import { getClasses, getStudents, getGames } from '../../utils/storage';
import {
  TeacherInfoCard,
  TeacherStats,
  QuickActions,
} from './dashboard';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
          onPress: async () => {
            try {
              await logout();
              // Navigation will be handled automatically by AppNavigator
              // when the authentication state changes
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Header
        title="Teacher Dashboard"
        subtitle={`Welcome, ${teacherData?.name || 'Teacher'}`}
        variant="teacher"
        rightIcon={<Icon name="logout" size={24} color="white" />}
        onRightPress={handleLogout}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Teacher Info Card */}
          <TeacherInfoCard 
            teacherData={teacherData} 
            dashboardData={dashboardData}
          />
          
          {/* Stats Cards */}
          <TeacherStats dashboardData={dashboardData} />
          
          {/* Quick Actions */}
          <QuickActions navigation={navigation} />
          
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
          
      
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.teacherBackground,
  },
  
  scrollView: {
    flex: 1,
  },
  
  content: {
    padding: SPACING.lg,
  },
  
  // Activity Section
  activitySection: {
    marginBottom: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  
  activityDot: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  
  activityText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  
  emptyActivity: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  
  emptyActivityText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default TeacherDashboard;