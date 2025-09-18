import React, { useState, useEffect } from 'react';
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
  }, [games, searchQuery, selectedSubject, selectedDifficulty]);

  const loadAvailableGames = async () => {
    try {
      // Mock game data - replace with API call
      const mockGames = [
        {
          id: 'game_1',
          title: 'Math Basics Quiz',
          subject: 'Mathematics',
          type: 'matching',
          difficulty: 'Easy',
          totalQuestions: 10,
          estimatedTime: '5-8 min',
          description: 'Basic arithmetic operations and number patterns',
          isDownloaded: true,
          isCompleted: false,
          icon: '🔢',
          rating: 4.5,
          playCount: 125,
          tags: ['arithmetic', 'basic'],
        },
        {
          id: 'game_2',
          title: 'Science Explorer',
          subject: 'Science',
          type: 'blockblast',
          difficulty: 'Medium',
          totalQuestions: 15,
          estimatedTime: '10-15 min',
          description: 'Explore the wonders of basic science concepts',
          isDownloaded: true,
          isCompleted: true,
          icon: '🧪',
          rating: 4.8,
          playCount: 89,
          tags: ['chemistry', 'physics'],
        },
        {
          id: 'game_3',
          title: 'English Vocabulary Builder',
          subject: 'English',
          type: 'matching',
          difficulty: 'Easy',
          totalQuestions: 12,
          estimatedTime: '8-12 min',
          description: 'Improve your vocabulary with fun word matching',
          isDownloaded: false,
          isCompleted: false,
          icon: '📚',
          rating: 4.3,
          playCount: 203,
          tags: ['vocabulary', 'words'],
        },
        {
          id: 'game_4',
          title: 'Advanced Algebra',
          subject: 'Mathematics',
          type: 'blockblast',
          difficulty: 'Hard',
          totalQuestions: 20,
          estimatedTime: '15-20 min',
          description: 'Challenge yourself with complex algebraic problems',
          isDownloaded: true,
          isCompleted: false,
          icon: '📐',
          rating: 4.6,
          playCount: 67,
          tags: ['algebra', 'advanced'],
        },
        {
          id: 'game_5',
          title: 'Hindi Literature',
          subject: 'Hindi',
          type: 'matching',
          difficulty: 'Medium',
          totalQuestions: 14,
          estimatedTime: '10-14 min',
          description: 'Discover famous Hindi poets and their works',
          isDownloaded: true,
          isCompleted: false,
          icon: '📖',
          rating: 4.4,
          playCount: 156,
          tags: ['literature', 'poetry'],
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

  const filterGames = () => {
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
  };

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
      navigation.navigate('MatchingGame', { game });
    } else if (game.type === 'blockblast') {
      navigation.navigate('BlockBlastGame', { game });
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
    backgroundColor: COLORS.background,
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