import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { useApp } from '../../context/AppContext';
import ProgressStats from './ProgressStats';
import StudentInfoCard from './StudentInfoCard';
import {
  GamesSection,
  CompletedGamesSection,
  BadgesSection,
  useDashboardData,
  useGameHandling,
  useLogout
} from './dashboard';

const StudentDashboard = ({ navigation }) => {
  const { studentData, logout } = useApp();
  const { dashboardData } = useDashboardData();
  const { handleGamePress, getDifficultyColor, handleViewAllGames } = useGameHandling(navigation, studentData);
  const { handleLogout } = useLogout(navigation, logout);

  return (
    <View style={styles.container}>
      <Header
        title="Student Dashboard"
        subtitle={`Welcome, ${studentData?.name || 'Student'}`}
        variant="student"
        rightIcon={<Text style={styles.logoutIcon}>👋</Text>}
        onRightPress={handleLogout}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Student Info Card */}
          <StudentInfoCard 
            studentData={studentData} 
            totalScore={dashboardData.totalScore} 
          />

          {/* Progress Stats */}
          <ProgressStats dashboardData={dashboardData} styles={styles} />

          {/* Available Games */}
          <GamesSection
            availableGames={dashboardData.availableGames}
            onGamePress={handleGamePress}
            getDifficultyColor={getDifficultyColor}
            onViewAllPress={handleViewAllGames}
          />

          {/* Completed Games */}
          <CompletedGamesSection
            completedGames={dashboardData.completedGames}
            onGamePress={handleGamePress}
          />

          {/* Badges Section */}
          <BadgesSection badges={dashboardData.badges} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.studentBackground,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: SPACING.lg,
  },

  // Header Icons
  logoutIcon: {
    fontSize: 24,
  },
});

export default StudentDashboard;
