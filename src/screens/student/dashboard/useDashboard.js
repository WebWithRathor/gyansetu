import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { COLORS } from '../../../constants/colors';

// Custom hook for dashboard data management
export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    availableGames: [],
    completedGames: [],
    totalScore: 0,
    badges: [],
  });

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
          icon: 'calculate',
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
            },
          ],
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
              explanation:
                'Plants absorb carbon dioxide and release oxygen during photosynthesis.',
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
              explanation:
                'Animals that eat only plants are called herbivores.',
              type: 'blockblast',
            },
            {
              id: 'q5',
              question:
                'How many bones are in an adult human body approximately?',
              options: ['106', '156', '206', '256'],
              correctAnswer: 2,
              explanation: 'An adult human body has approximately 206 bones.',
              type: 'blockblast',
            },
          ],
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
          icon: 'book',
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
              explanation:
                'Happy is an adjective because it describes how someone feels.',
              type: 'matching',
            },
            {
              id: 'q4',
              question: 'Complete: "She _____ to school every day."',
              options: ['go', 'goes', 'going', 'gone'],
              correctAnswer: 1,
              explanation: 'With "she" (third person singular), we use "goes".',
              type: 'matching',
            },
          ],
        },
      ];

      const available = mockGames.filter(game => !game.isCompleted);
      const completed = mockGames.filter(game => game.isCompleted);
      const totalScore = completed.reduce(
        (sum, game) => sum + (game.score || 0),
        0,
      );

      setDashboardData({
        availableGames: available,
        completedGames: completed,
        totalScore,
        badges: [
          { icon: 'star', type: 'MaterialIcons', name: 'First Star' },
          { icon: 'trophy', type: 'MaterialIcons', name: 'Champion' },
        //   { icon: 'book', type: 'MaterialIcons', name: 'Scholar' },
        //   { icon: 'gps-fixed', type: 'MaterialIcons', name: 'Focus Master' },
          { icon: 'medal', type: 'MaterialIcons', name: 'Winner' }
        ],
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return { dashboardData, loadDashboardData };
};

// Custom hook for game handling logic
export const useGameHandling = (navigation, studentData) => {
  const handleGamePress = game => {
    if (!game.isDownloaded) {
      Alert.alert(
        'Game Not Available',
        'This game needs to be downloaded. Please connect to internet to download.',
        [{ text: 'OK' }],
      );
      return;
    }

    if (game.type === 'matching') {
      navigation.navigate('MatchingGame', {
        game: game,
        studentData: studentData,
      });
    } else if (game.type === 'blockblast') {
      navigation.navigate('BlockBlastGame', {
        game: game,
        studentData: studentData,
      });
    }
  };

  const getDifficultyColor = difficulty => {
    switch (difficulty) {
      case 'Easy':
        return COLORS.success;
      case 'Medium':
        return COLORS.warning;
      case 'Hard':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const handleViewAllGames = () => {
    navigation.navigate('GameSelection');
  };

  return { 
    handleGamePress, 
    getDifficultyColor, 
    handleViewAllGames 
  };
};

// Custom hook for logout functionality
export const useLogout = (navigation, logout) => {
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.replace('UserTypeSelection');
        },
      },
    ]);
  };

  return { handleLogout };
};