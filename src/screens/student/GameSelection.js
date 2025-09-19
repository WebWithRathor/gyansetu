import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Card, Input, Button } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { useApp } from '../../context/AppContext';

const GameSelection = ({ navigation }) => {
  const { studentData } = useApp();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);

  const subjects = ['All', 'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    loadAvailableGames();
  }, []);

  useEffect(() => {
    filterGames();
  }, [games, searchQuery, selectedSubject, selectedDifficulty, filterGames]);

  const loadAvailableGames = async () => {
    try {
      // Mock game data with complete questions for testing
      const mockGames = [
        {
          id: 'game_1',
          title: 'Math Basics Quiz',
          subject: 'Mathematics',
          type: 'matching',
          difficulty: 'Easy',
          totalQuestions: 5,
          estimatedTime: '5-8 min',
          description: 'Basic arithmetic operations and number patterns',
          isDownloaded: true,
          isCompleted: false,
          icon: '🔢',
          rating: 4.5,
          playCount: 125,
          tags: ['arithmetic', 'basic'],
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
          title: 'Science Explorer',
          subject: 'Science',
          type: 'blockblast',
          difficulty: 'Medium',
          totalQuestions: 5,
          estimatedTime: '10-15 min',
          description: 'Explore the wonders of basic science concepts',
          isDownloaded: true,
          isCompleted: false,
          icon: '🧪',
          rating: 4.8,
          playCount: 89,
          tags: ['chemistry', 'physics'],
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
          title: 'English Vocabulary Builder',
          subject: 'English',
          type: 'matching',
          difficulty: 'Easy',
          totalQuestions: 4,
          estimatedTime: '8-12 min',
          description: 'Improve your vocabulary with fun word matching',
          isDownloaded: true,
          isCompleted: false,
          icon: '📚',
          rating: 4.3,
          playCount: 203,
          tags: ['vocabulary', 'words'],
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
        {
          id: 'game_4',
          title: 'Advanced Algebra',
          subject: 'Mathematics',
          type: 'blockblast',
          difficulty: 'Hard',
          totalQuestions: 5,
          estimatedTime: '15-20 min',
          description: 'Challenge yourself with complex algebraic problems',
          isDownloaded: true,
          isCompleted: false,
          icon: '📐',
          rating: 4.6,
          playCount: 67,
          tags: ['algebra', 'advanced'],
          questions: [
            {
              id: 'q1',
              question: 'Solve for x: 2x + 5 = 13',
              options: ['3', '4', '5', '6'],
              correctAnswer: 1,
              explanation: '2x + 5 = 13, so 2x = 8, therefore x = 4',
              type: 'blockblast',
            },
            {
              id: 'q2',
              question: 'What is x² if x = 7?',
              options: ['14', '49', '21', '35'],
              correctAnswer: 1,
              explanation: '7² = 7 × 7 = 49',
              type: 'blockblast',
            },
            {
              id: 'q3',
              question: 'Simplify: 3x + 2x',
              options: ['5x', '6x', '5x²', '6x²'],
              correctAnswer: 0,
              explanation: '3x + 2x = (3+2)x = 5x',
              type: 'blockblast',
            },
            {
              id: 'q4',
              question: 'If y = 2x + 3 and x = 4, what is y?',
              options: ['9', '10', '11', '12'],
              correctAnswer: 2,
              explanation: 'y = 2(4) + 3 = 8 + 3 = 11',
              type: 'blockblast',
            },
            {
              id: 'q5',
              question: 'Factor: x² + 5x + 6',
              options: ['(x+2)(x+3)', '(x+1)(x+6)', '(x+4)(x+2)', '(x+5)(x+1)'],
              correctAnswer: 0,
              explanation: 'x² + 5x + 6 = (x+2)(x+3) because 2×3=6 and 2+3=5',
              type: 'blockblast',
            }
          ]
        },
        {
          id: 'game_5',
          title: 'Hindi Literature',
          subject: 'Hindi',
          type: 'matching',
          difficulty: 'Medium',
          totalQuestions: 4,
          estimatedTime: '10-14 min',
          description: 'Discover famous Hindi poets and their works',
          isDownloaded: true,
          isCompleted: false,
          icon: '📖',
          rating: 4.4,
          playCount: 156,
          tags: ['literature', 'poetry'],
          questions: [
            {
              id: 'q1',
              question: 'Who wrote "Godan"?',
              options: ['Harivansh Rai Bachchan', 'Premchand', 'Maithili Sharan Gupt', 'Sumitranandan Pant'],
              correctAnswer: 1,
              explanation: '"Godan" is a famous novel written by Munshi Premchand.',
              type: 'matching',
            },
            {
              id: 'q2',
              question: 'Which is the national song of India?',
              options: ['Jana Gana Mana', 'Vande Mataram', 'Saare Jahan Se Achha', 'Iqbal'],
              correctAnswer: 1,
              explanation: '"Vande Mataram" is the national song of India.',
              type: 'matching',
            },
            {
              id: 'q3',
              question: 'Who is known as "Rashtra Kavi"?',
              options: ['Maithili Sharan Gupt', 'Harivansh Rai Bachchan', 'Sumitranandan Pant', 'Ramdhari Singh Dinkar'],
              correctAnswer: 0,
              explanation: 'Maithili Sharan Gupt is known as "Rashtra Kavi" (National Poet).',
              type: 'matching',
            },
            {
              id: 'q4',
              question: 'Complete this line: "Saare jahan se ___"',
              options: ['sundar', 'achha', 'pyara', 'mahaan'],
              correctAnswer: 1,
              explanation: 'The famous line is "Saare jahan se achha, Hindustan hamara".',
              type: 'matching',
            }
          ]
        },
      ];

      setGames(mockGames);
      setLoading(false);
    } catch (error) {
      console.error('Error loading games:', error);
      Alert.alert('Error', 'Failed to load games. Please try again.');
      setLoading(false);
    }
  };

  const filterGames = useCallback(() => {
    let filtered = games;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by subject
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(game => game.subject === selectedSubject);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(game => game.difficulty === selectedDifficulty);
    }

    setFilteredGames(filtered);
  }, [games, searchQuery, selectedSubject, selectedDifficulty]);

  const handleGamePress = (game) => {
    if (!game.isDownloaded) {
      Alert.alert(
        'Download Required',
        'This game needs to be downloaded first. Connect to the internet to download.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Download', onPress: () => handleDownloadGame(game) }
        ]
      );
      return;
    }

    // Navigate to the appropriate game screen
    if (game.type === 'matching') {
      navigation.navigate('MatchingGame', { game, studentData });
    } else if (game.type === 'blockblast') {
      navigation.navigate('BlockBlastGame', { game, studentData });
    }
  };

  const handleDownloadGame = async (game) => {
    // Mock download functionality
    Alert.alert('Download Started', `Downloading ${game.title}...`);
    // In real app, implement actual download logic
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return COLORS.success;
      case 'Medium': return COLORS.warning;
      case 'Hard': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '⭐';
    }
    if (hasHalfStar) {
      stars += '✨';
    }
    
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Game Selection"
        subtitle={`${filteredGames.length} games available`}
        variant="student"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Search and Filter Section */}
          <View style={styles.filterSection}>
            <Input
              placeholder="Search games..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
              style={styles.searchInput}
            />

            {/* Subject Filter */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Subject:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {subjects.map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    onPress={() => setSelectedSubject(subject)}
                    style={[
                      styles.filterChip,
                      selectedSubject === subject && styles.filterChipActive
                    ]}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedSubject === subject && styles.filterChipTextActive
                    ]}>
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Difficulty Filter */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Difficulty:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {difficulties.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    onPress={() => setSelectedDifficulty(difficulty)}
                    style={[
                      styles.filterChip,
                      selectedDifficulty === difficulty && styles.filterChipActive
                    ]}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedDifficulty === difficulty && styles.filterChipTextActive
                    ]}>
                      {difficulty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Games List */}
          <View style={styles.gamesSection}>
            {loading ? (
              <Card>
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading games...</Text>
                </View>
              </Card>
            ) : filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <Card
                  key={game.id}
                  onPress={() => handleGamePress(game)}
                  style={[
                    styles.gameCard,
                    !game.isDownloaded && styles.gameCardDisabled
                  ]}
                  elevation="medium"
                >
                  <View style={styles.gameContent}>
                    <View style={styles.gameHeader}>
                      <Text style={styles.gameIcon}>{game.icon}</Text>
                      <View style={styles.gameMainInfo}>
                        <Text style={styles.gameTitle}>{game.title}</Text>
                        <Text style={styles.gameSubject}>{game.subject}</Text>
                        <View style={styles.gameRating}>
                          <Text style={styles.stars}>{renderStars(game.rating)}</Text>
                          <Text style={styles.ratingText}>({game.rating})</Text>
                          <Text style={styles.playCount}>• {game.playCount} plays</Text>
                        </View>
                      </View>
                      <View style={styles.gameStatus}>
                        {game.isCompleted && (
                          <Text style={styles.completedBadge}>✅</Text>
                        )}
                        {!game.isDownloaded && (
                          <Text style={styles.downloadBadge}>📱</Text>
                        )}
                      </View>
                    </View>

                    <Text style={styles.gameDescription}>{game.description}</Text>

                    <View style={styles.gameDetails}>
                      <View style={styles.gameDetailItem}>
                        <Text style={styles.gameDetailLabel}>Difficulty:</Text>
                        <Text style={[
                          styles.gameDetailValue,
                          { color: getDifficultyColor(game.difficulty) }
                        ]}>
                          {game.difficulty}
                        </Text>
                      </View>
                      <View style={styles.gameDetailItem}>
                        <Text style={styles.gameDetailLabel}>Questions:</Text>
                        <Text style={styles.gameDetailValue}>{game.totalQuestions}</Text>
                      </View>
                      <View style={styles.gameDetailItem}>
                        <Text style={styles.gameDetailLabel}>Time:</Text>
                        <Text style={styles.gameDetailValue}>{game.estimatedTime}</Text>
                      </View>
                    </View>

                    <View style={styles.gameActions}>
                      {game.isDownloaded ? (
                        <Button
                          title={game.isCompleted ? "Play Again" : "Start Game"}
                          variant="primary"
                          size="small"
                          onPress={() => handleGamePress(game)}
                        />
                      ) : (
                        <Button
                          title="Download"
                          variant="outline"
                          size="small"
                          onPress={() => handleDownloadGame(game)}
                        />
                      )}
                    </View>
                  </View>
                </Card>
              ))
            ) : (
              <Card>
                <View style={styles.emptyGames}>
                  <Text style={styles.emptyGamesIcon}>🎮</Text>
                  <Text style={styles.emptyGamesTitle}>No Games Found</Text>
                  <Text style={styles.emptyGamesText}>
                    Try adjusting your filters or search terms to find games.
                  </Text>
                  <Button
                    title="Clear Filters"
                    variant="outline"
                    size="small"
                    onPress={() => {
                      setSearchQuery('');
                      setSelectedSubject('All');
                      setSelectedDifficulty('All');
                    }}
                    style={styles.clearFiltersButton}
                  />
                </View>
              </Card>
            )}
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
  
  // Filter Section
  filterSection: {
    marginBottom: SPACING.xl,
  },
  
  searchInput: {
    marginBottom: SPACING.lg,
  },
  
  searchIcon: {
    fontSize: 18,
  },
  
  filterRow: {
    marginBottom: SPACING.md,
  },
  
  filterLabel: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  
  filterChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  filterChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  
  filterChipText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  filterChipTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  
  // Games Section
  gamesSection: {
    flex: 1,
  },
  
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  
  loadingText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  
  gameCard: {
    marginBottom: SPACING.lg,
  },
  
  gameCardDisabled: {
    opacity: 0.7,
  },
  
  gameContent: {
    padding: SPACING.lg,
  },
  
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  
  gameIcon: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  
  gameMainInfo: {
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
    marginBottom: SPACING.xs,
  },
  
  gameRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  stars: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  
  ratingText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  
  playCount: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  
  gameStatus: {
    alignItems: 'center',
  },
  
  completedBadge: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  
  downloadBadge: {
    fontSize: 20,
  },
  
  gameDescription: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  
  gameDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  gameDetailItem: {
    alignItems: 'center',
  },
  
  gameDetailLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  
  gameDetailValue: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
  },
  
  gameActions: {
    alignItems: 'flex-end',
  },
  
  // Empty State
  emptyGames: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  emptyGamesIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  
  emptyGamesTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  emptyGamesText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  clearFiltersButton: {
    marginTop: SPACING.md,
  },
});

export default GameSelection;