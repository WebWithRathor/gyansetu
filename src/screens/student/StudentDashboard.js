import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Header, Button } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { useApp } from '../../context/AppContext';

const StudentDashboard = ({ navigation }) => {
  const { studentData, logout } = useApp();
  const [dashboardData, setDashboardData] = useState({
    availableGames: [],
    completedGames: [],
    totalScore: 0,
    badges: [],
  });
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      // Mock data with complete game questions for testing
      const mockGames = [
        {
          id: 'game_1',
          title: 'Math Basics',
          subject: 'Mathematics',
          type: 'matching',
          difficulty: 'Easy',
          totalQuestions: 10,
          estimatedTime: '5-10 min',
          isCompleted: false,
          isDownloaded: true,
          icon: '🔢',
          questions: [
            {
              id: 'q1',
              question: 'What is 12 + 8?',
              options: ['18', '20', '22', '24'],
              correctAnswer: 1,
              explanation: '12 + 8 = 20',
              type: 'matching',
            },
            {
              id: 'q2',
              question: 'What is 15 - 7?',
              options: ['6', '7', '8', '9'],
              correctAnswer: 2,
              explanation: '15 - 7 = 8',
              type: 'matching',
            },
            {
              id: 'q3',
              question: 'What is 6 × 4?',
              options: ['20', '22', '24', '26'],
              correctAnswer: 2,
              explanation: '6 × 4 = 24',
              type: 'matching',
            },
            {
              id: 'q4',
              question: 'What is 36 ÷ 6?',
              options: ['5', '6', '7', '8'],
              correctAnswer: 1,
              explanation: '36 ÷ 6 = 6',
              type: 'matching',
            },
            {
              id: 'q5',
              question: 'Which number comes next: 2, 4, 6, 8, ?',
              options: ['9', '10', '11', '12'],
              correctAnswer: 1,
              explanation: 'This is an even number sequence, so 10 comes next.',
              type: 'matching',
            }
          ]
        },
        {
          id: 'game_2',
          title: 'Science Quiz',
          subject: 'Science',
          type: 'blockblast',
          difficulty: 'Medium',
          totalQuestions: 15,
          estimatedTime: '10-15 min',
          isCompleted: true,
          score: 85,
          isDownloaded: true,
          icon: '🧪',
          questions: [
            {
              id: 'q1',
              question: 'What gas do plants absorb during photosynthesis?',
              options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
              correctAnswer: 1,
              explanation: 'Plants absorb carbon dioxide and release oxygen during photosynthesis.',
              type: 'blockblast',
            },
            {
              id: 'q2',
              question: 'What is the largest planet in our solar system?',
              options: ['Earth', 'Jupiter', 'Saturn', 'Mars'],
              correctAnswer: 1,
              explanation: 'Jupiter is the largest planet in our solar system.',
              type: 'blockblast',
            },
            {
              id: 'q3',
              question: 'Which organ pumps blood throughout the human body?',
              options: ['Brain', 'Heart', 'Lungs', 'Liver'],
              correctAnswer: 1,
              explanation: 'The heart pumps blood throughout the human body.',
              type: 'blockblast',
            },
            {
              id: 'q4',
              question: 'What do we call animals that eat only plants?',
              options: ['Carnivores', 'Herbivores', 'Omnivores', 'Predators'],
              correctAnswer: 1,
              explanation: 'Animals that eat only plants are called herbivores.',
              type: 'blockblast',
            },
            {
              id: 'q5',
              question: 'How many bones are in an adult human body approximately?',
              options: ['106', '156', '206', '256'],
              correctAnswer: 2,
              explanation: 'An adult human body has approximately 206 bones.',
              type: 'blockblast',
            }
          ]
        },
        {
          id: 'game_3',
          title: 'English Vocabulary',
          subject: 'English',
          type: 'matching',
          difficulty: 'Easy',
          totalQuestions: 12,
          estimatedTime: '8-12 min',
          isCompleted: false,
          isDownloaded: true,
          icon: '📚',
          questions: [
            {
              id: 'q1',
              question: 'Which of these is a noun?',
              options: ['Run', 'Beautiful', 'Cat', 'Quickly'],
              correctAnswer: 2,
              explanation: 'Cat is a noun because it names a thing (animal).',
              type: 'matching',
            },
            {
              id: 'q2',
              question: 'What is the plural of "child"?',
              options: ['Childs', 'Children', 'Childes', 'Child'],
              correctAnswer: 1,
              explanation: 'The plural of "child" is "children".',
              type: 'matching',
            },
            {
              id: 'q3',
              question: 'Which word is an adjective?',
              options: ['Sing', 'Happy', 'Book', 'Dance'],
              correctAnswer: 1,
              explanation: 'Happy is an adjective because it describes how someone feels.',
              type: 'matching',
            },
            {
              id: 'q4',
              question: 'Complete: "She _____ to school every day."',
              options: ['go', 'goes', 'going', 'gone'],
              correctAnswer: 1,
              explanation: 'With "she" (third person singular), we use "goes".',
              type: 'matching',
            }
          ]
        },
      ];
      
      const available = mockGames.filter(game => !game.isCompleted);
      const completed = mockGames.filter(game => game.isCompleted);
      const totalScore = completed.reduce((sum, game) => sum + (game.score || 0), 0);
      
      setDashboardData({
        availableGames: available,
        completedGames: completed,
        totalScore,
        badges: ['🌟', '🎯', '📚'],
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
  
  const handleGamePress = (game) => {
    if (!game.isDownloaded) {
      Alert.alert(
        'Game Not Available',
        'This game needs to be downloaded. Please connect to internet to download.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (game.type === 'matching') {
      navigation.navigate('MatchingGame', { 
        game: game,
        studentData: studentData 
      });
    } else if (game.type === 'blockblast') {
      navigation.navigate('BlockBlastGame', { 
        game: game,
        studentData: studentData 
      });
    }
  };
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return COLORS.success;
      case 'Medium': return COLORS.warning;
      case 'Hard': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Student Dashboard"
        subtitle={`Welcome, ${studentData?.name || 'Student'}`}
        variant="student"
        rightIcon={<Text style={styles.logoutIcon}>👋</Text>}
        onRightPress={handleLogout}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Student Info Card */}
          <Card variant="student" style={styles.studentCard}>
            <View style={styles.studentContent}>
              <Text style={styles.studentIcon}>🎓</Text>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{studentData?.name}</Text>
                <Text style={styles.studentDetails}>
                  Grade {studentData?.grade} • {studentData?.className}
                </Text>
                <Text style={styles.studentSchool}>{studentData?.schoolName}</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreValue}>{dashboardData.totalScore}</Text>
                <Text style={styles.scoreLabel}>Total Score</Text>
              </View>
            </View>
          </Card>
          
          {/* Progress Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.statsRow}>
              <Card style={styles.statCard} elevation="low">
                <View style={styles.statContent}>
                  <Text style={styles.statIcon}>🎮</Text>
                  <Text style={styles.statValue}>{dashboardData.availableGames.length}</Text>
                  <Text style={styles.statLabel}>Available</Text>
                </View>
              </Card>
              
              <Card style={styles.statCard} elevation="low">
                <View style={styles.statContent}>
                  <Text style={styles.statIcon}>✅</Text>
                  <Text style={styles.statValue}>{dashboardData.completedGames.length}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
              </Card>
              
              <Card style={styles.statCard} elevation="low">
                <View style={styles.statContent}>
                  <Text style={styles.statIcon}>🏆</Text>
                  <Text style={styles.statValue}>{dashboardData.badges.length}</Text>
                  <Text style={styles.statLabel}>Badges</Text>
                </View>
              </Card>
            </View>
          </View>
          
          {/* Available Games */}
          <View style={styles.gamesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Games</Text>
              <Button
                title="View All"
                variant="ghost"
                size="small"
                onPress={() => navigation.navigate('GameSelection')}
                style={styles.viewAllButton}
              />
            </View>
            {dashboardData.availableGames.length > 0 ? (
              dashboardData.availableGames.map((game) => (
                <Card
                  key={game.id}
                  onPress={() => handleGamePress(game)}
                  style={styles.gameCard}
                  elevation="medium"
                >
                  <View style={styles.gameContent}>
                    <Text style={styles.gameIcon}>{game.icon}</Text>
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameTitle}>{game.title}</Text>
                      <Text style={styles.gameSubject}>{game.subject}</Text>
                      <View style={styles.gameDetails}>
                        <Text 
                          style={[styles.gameDifficulty, { color: getDifficultyColor(game.difficulty) }]}
                        >
                          {game.difficulty}
                        </Text>
                        <Text style={styles.gameTime}>• {game.estimatedTime}</Text>
                        <Text style={styles.gameQuestions}>• {game.totalQuestions} questions</Text>
                      </View>
                      {!game.isDownloaded && (
                        <Text style={styles.downloadRequired}>📱 Download required</Text>
                      )}
                    </View>
                    <View style={styles.gameAction}>
                      <Text style={styles.playIcon}>▶️</Text>
                    </View>
                  </View>
                </Card>
              ))
            ) : (
              <Card>
                <View style={styles.emptyGames}>
                  <Text style={styles.emptyGamesIcon}>🎮</Text>
                  <Text style={styles.emptyGamesText}>
                    No games available right now.{'\n'}
                    Ask your teacher to publish some games!
                  </Text>
                </View>
              </Card>
            )}
          </View>
          
          {/* Completed Games */}
          {dashboardData.completedGames.length > 0 && (
            <View style={styles.completedSection}>
              <Text style={styles.sectionTitle}>Completed Games</Text>
              {dashboardData.completedGames.map((game) => (
                <Card
                  key={game.id}
                  onPress={() => handleGamePress(game)}
                  style={styles.completedGameCard}
                  elevation="low"
                >
                  <View style={styles.gameContent}>
                    <Text style={styles.gameIcon}>{game.icon}</Text>
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameTitle}>{game.title}</Text>
                      <Text style={styles.gameSubject}>{game.subject}</Text>
                      <Text style={styles.completedScore}>Score: {game.score}%</Text>
                    </View>
                    <View style={styles.gameAction}>
                      <Text style={styles.replayIcon}>🔄</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
          
          {/* Badges Section */}
          <View style={styles.badgesSection}>
            <Text style={styles.sectionTitle}>Your Badges</Text>
            <Card>
              <View style={styles.badgesContent}>
                {dashboardData.badges.length > 0 ? (
                  dashboardData.badges.map((badge, index) => (
                    <Text key={index} style={styles.badge}>{badge}</Text>
                  ))
                ) : (
                  <Text style={styles.noBadges}>Complete games to earn badges!</Text>
                )}
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
    backgroundColor: COLORS.background,
  },
  
  scrollView: {
    flex: 1,
  },
  
  content: {
    padding: SPACING.lg,
  },
  
  // Student Info Card
  studentCard: {
    marginBottom: SPACING.xl,
  },
  
  studentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  studentIcon: {
    fontSize: 48,
    marginRight: SPACING.lg,
  },
  
  studentInfo: {
    flex: 1,
  },
  
  studentName: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  studentDetails: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.accent,
    marginBottom: 2,
  },
  
  studentSchool: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  
  scoreContainer: {
    alignItems: 'center',
  },
  
  scoreValue: {
    ...TEXT_STYLES.title,
    color: COLORS.accent,
    marginBottom: SPACING.xs,
  },
  
  scoreLabel: {
    ...TEXT_STYLES.caption,
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
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  
  viewAllButton: {
    paddingHorizontal: 0,
  },
  
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'start',
  },
  
  statCard: {
    width:"47%",
    height: 120,
    backgroundColor:"skyblue",
    marginHorizontal: SPACING.xs,
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
  
  statLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  // Games Section
  gamesSection: {
    marginBottom: SPACING.xl,
  },
  
  gameCard: {
    marginBottom: SPACING.md,
  },
  
  gameContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  gameIcon: {
    fontSize: 40,
    marginRight: SPACING.lg,
  },
  
  gameInfo: {
    flex: 1,
  },
  
  gameTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  gameSubject: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.accent,
    marginBottom: SPACING.sm,
  },
  
  gameDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  gameDifficulty: {
    ...TEXT_STYLES.caption,
    fontWeight: '600',
  },
  
  gameTime: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  
  gameQuestions: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  
  downloadRequired: {
    ...TEXT_STYLES.caption,
    color: COLORS.warning,
    marginTop: SPACING.xs,
  },
  
  gameAction: {
    padding: SPACING.sm,
  },
  
  playIcon: {
    fontSize: 24,
  },
  
  replayIcon: {
    fontSize: 20,
  },
  
  // Completed Games
  completedSection: {
    marginBottom: SPACING.xl,
  },
  
  completedGameCard: {
    marginBottom: SPACING.sm,
    opacity: 0.8,
  },
  
  completedScore: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.success,
    fontWeight: '600',
  },
  
  // Empty States
  emptyGames: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  emptyGamesIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  
  emptyGamesText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  // Badges Section
  badgesSection: {
    marginBottom: SPACING.xl,
  },
  
  badgesContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    flexWrap: 'wrap',
  },
  
  badge: {
    fontSize: 32,
    marginHorizontal: SPACING.sm,
  },
  
  noBadges: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  // Header Icons
  logoutIcon: {
    fontSize: 24,
  },
});

export default StudentDashboard;