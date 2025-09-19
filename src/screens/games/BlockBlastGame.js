import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Vibration
} from 'react-native';
import { Header, Button, Modal } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { shuffleArray } from '../../utils/helpers';
import { addScore } from '../../utils/storage';

const GRID_SIZE = 8;

// Block shapes (Tetris-like pieces)
const BLOCK_SHAPES = [
  [[1]], // Single block
  [[1, 1]], // Two blocks horizontal
  [[1], [1]], // Two blocks vertical
  [[1, 1, 1]], // Three blocks horizontal
  [[1], [1], [1]], // Three blocks vertical
  [[1, 1], [1, 1]], // Square 2x2
  [[1, 1, 1], [0, 1, 0]], // T-shape
  [[1, 1, 0], [0, 1, 1]], // Z-shape
];

const BlockBlastGame = ({ navigation, route }) => {
  const { game, studentData } = route?.params || {};
  
  // Game state
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0)));
  const [currentBlocks, setCurrentBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionStreak, setQuestionStreak] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  
  // Animation values
  const scoreAnim = useRef(new Animated.Value(1)).current;
  const gridAnim = useRef(new Animated.Value(1)).current;
  const blockAnim = useRef(new Animated.Value(1)).current;
  
  // Initialize game
  const initializeGame = useCallback(() => {
    if (!game?.questions) return;
    
    const gameQuestions = shuffleArray([...game.questions]);
    setQuestions(gameQuestions);
    setGrid(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0)));
    setScore(0);
    setLines(0);
    setMovesCount(0);
    setQuestionStreak(0);
    generateNewBlocks();
  }, [game?.questions]);
  
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  const generateNewBlocks = () => {
    const newBlocks = [];
    for (let i = 0; i < 3; i++) {
      const randomShape = BLOCK_SHAPES[Math.floor(Math.random() * BLOCK_SHAPES.length)];
      const colors = [COLORS.primary, COLORS.accent, COLORS.success, COLORS.warning];
      newBlocks.push({
        id: Date.now() + i,
        shape: randomShape,
        color: colors[Math.floor(Math.random() * colors.length)],
        used: false,
      });
    }
    setCurrentBlocks(newBlocks);
    // Auto-select the first block
    setSelectedBlockId(newBlocks[0]?.id || null);
  };
  
  const startGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
  };
  
  const canPlaceBlock = (gameGrid, block, row, col) => {
    for (let r = 0; r < block.shape.length; r++) {
      for (let c = 0; c < block.shape[r].length; c++) {
        if (block.shape[r][c] === 1) {
          const newRow = row + r;
          const newCol = col + c;
          
          if (newRow >= GRID_SIZE || newCol >= GRID_SIZE || newRow < 0 || newCol < 0) {
            return false;
          }
          
          if (gameGrid[newRow][newCol] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  };
  
  const placeBlock = (blockId, row, col) => {
    const block = currentBlocks.find(b => b.id === blockId);
    if (!block || block.used) return;
    
    if (!canPlaceBlock(grid, block, row, col)) {
      Vibration.vibrate(200);
      return;
    }
    
    // Place block on grid
    const newGrid = grid.map(r => [...r]);
    for (let r = 0; r < block.shape.length; r++) {
      for (let c = 0; c < block.shape[r].length; c++) {
        if (block.shape[r][c] === 1) {
          newGrid[row + r][col + c] = block.color;
        }
      }
    }
    
    setGrid(newGrid);
    
    // Mark block as used
    setCurrentBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, used: true } : b
    ));
    
    // Auto-select next available block
    const remainingBlocks = currentBlocks.filter(b => b.id !== blockId && !b.used);
    if (remainingBlocks.length > 0) {
      setSelectedBlockId(remainingBlocks[0].id);
    } else {
      setSelectedBlockId(null);
    }
    
    setMovesCount(prev => prev + 1);
    
    // Check for completed lines
    checkAndClearLines(newGrid);
    
    // Show question every 3 moves
    if ((movesCount + 1) % 3 === 0) {
      showRandomQuestion();
    }
    
    // Check if all blocks are used
    const updatedBlocks = currentBlocks.map(b => 
      b.id === blockId ? { ...b, used: true } : b
    );
    if (updatedBlocks.every(b => b.used)) {
      setTimeout(() => generateNewBlocks(), 500);
    }
    
    // Check for game over
    checkGameOver(newGrid);
  };
  
  const checkAndClearLines = (currentGrid) => {
    let newGrid = [...currentGrid];
    let linesCleared = 0;
    
    // Check rows
    for (let row = 0; row < GRID_SIZE; row++) {
      if (newGrid[row].every(cell => cell !== 0)) {
        newGrid[row] = Array(GRID_SIZE).fill(0);
        linesCleared++;
      }
    }
    
    // Check columns
    for (let col = 0; col < GRID_SIZE; col++) {
      if (newGrid.every(row => row[col] !== 0)) {
        newGrid.forEach(row => {
          row[col] = 0;
        });
        linesCleared++;
      }
    }
    
    if (linesCleared > 0) {
      setGrid(newGrid);
      setLines(prev => prev + linesCleared);
      const points = linesCleared * 100 * (questionStreak + 1);
      setScore(prev => prev + points);
      
      // Animate score increase
      Animated.sequence([
        Animated.timing(scoreAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(scoreAnim, { toValue: 1, duration: 200, useNativeDriver: true })
      ]).start();
      
      Vibration.vibrate(100);
    }
  };
  
  const showRandomQuestion = () => {
    if (questions.length === 0) return;
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setShowQuestionModal(true);
  };
  
  const handleQuestionAnswer = (selectedIndex) => {
    const correct = selectedIndex === currentQuestion.correctAnswer;
    
    if (correct) {
      setQuestionStreak(prev => prev + 1);
      setScore(prev => prev + 50);
      // Show success feedback without blocking Alert
      console.log('Correct answer! +50 bonus points!');
    } else {
      setQuestionStreak(0);
      // Show correct answer feedback without blocking Alert
      console.log(`Incorrect. Correct answer: ${currentQuestion.options[currentQuestion.correctAnswer]}`);
    }
    
    setShowQuestionModal(false);
    setCurrentQuestion(null);
  };
  
  const checkGameOver = (currentGrid) => {
    // Check if any remaining block can be placed
    const unusedBlocks = currentBlocks.filter(b => !b.used);
    
    for (const block of unusedBlocks) {
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (canPlaceBlock(currentGrid, block, row, col)) {
            return; // Game can continue
          }
        }
      }
    }
    
    // If no blocks can be placed, game over
    endGame();
  };
  
  const endGame = useCallback(async () => {
    const finalScore = {
      studentId: studentData?.id,
      gameId: game?.id,
      score: score,
      linesCleared: lines,
      moves: movesCount,
      questionStreak: questionStreak,
      gameType: 'blockblast',
      playedAt: new Date().toISOString(),
    };
    
    try {
      await addScore(finalScore);
    } catch (error) {
      console.error('Error saving score:', error);
    }
    
    // Navigate to ScoreFeedback with results
    navigation.navigate('ScoreFeedback', {
      gameResults: finalScore,
      studentData: studentData,
      game: game
    });
  }, [score, lines, movesCount, questionStreak, studentData, game, navigation]);
  
  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.gridRow}>
        {row.map((cell, colIndex) => {
          const cellStyle = [
            styles.gridCell,
            { backgroundColor: cell || COLORS.surface },
            cell ? styles.gridCellFilled : styles.gridCellEmpty
          ];
          
          return (
            <TouchableOpacity
              key={`${rowIndex}-${colIndex}`}
              style={cellStyle}
              onPress={() => {
                // Handle block placement logic here
                if (selectedBlockId) {
                  const selectedBlock = currentBlocks.find(b => b.id === selectedBlockId && !b.used);
                  if (selectedBlock) {
                    placeBlock(selectedBlock.id, rowIndex, colIndex);
                  }
                }
              }}
            />
          );
        })}
      </View>
    ));
  };
  
  const renderBlocks = () => {
    return currentBlocks.map((block, index) => (
      <Animated.View 
        key={block.id}
        style={{ transform: [{ scale: blockAnim }] }}
      >
        <TouchableOpacity 
          style={styles.blockContainer}
          onPress={() => {
            if (!block.used) {
              // Add pressing animation
              Animated.sequence([
                Animated.timing(blockAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
                Animated.timing(blockAnim, { toValue: 1, duration: 100, useNativeDriver: true })
              ]).start();
              
              setSelectedBlockId(block.id);
            }
          }}
          disabled={block.used}
        >
          <Text style={styles.blockLabel}>Block {index + 1}</Text>
          <View style={[
            styles.blockPreview, 
            block.used && styles.blockUsed,
            selectedBlockId === block.id && !block.used && styles.blockSelected
          ]}>
            {block.shape.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.blockRow}>
                {row.map((cell, colIndex) => {
                  const cellStyle = [
                    styles.blockCell,
                    cell ? { backgroundColor: block.color } : styles.blockCellEmpty,
                    block.used && styles.blockCellUsed
                  ];
                  
                  return (
                    <View
                      key={`${rowIndex}-${colIndex}`}
                      style={cellStyle}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Animated.View>
    ));
  };
  
  if (!game?.questions) {
    return (
      <View style={styles.container}>
        <Header
          title="Block Blast Game"
          subtitle="No game data"
          variant="student"
          showBackButton
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No game data available</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="primary"
          />
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Header
        title="Block Blast Game"
        subtitle={game?.title || 'Game Title'}
        variant="student"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />
      
      {!gameStarted ? (
        <View style={styles.instructionsContainer}>
          <Text style={styles.gameIcon}>🧩</Text>
          <Text style={styles.instructionsTitle}>How to Play</Text>
          <Text style={styles.instructionsText}>
            1. Place blocks on the 8×8 grid{'\n'}
            2. Clear full rows or columns to score points{'\n'}
            3. Answer questions for bonus points{'\n'}
            4. Game ends when no more blocks can be placed
          </Text>
          
          <View style={styles.gameInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Grid Size:</Text>
              <Text style={styles.infoValue}>8×8</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Line Clear:</Text>
              <Text style={styles.infoValue}>100 points</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Question Bonus:</Text>
              <Text style={styles.infoValue}>50 points</Text>
            </View>
          </View>
          
          <Button
            title="Start Game"
            onPress={startGame}
            variant="primary"
            style={styles.startButton}
          />
        </View>
      ) : (
        <View style={styles.gameContainer}>
          {/* Game Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Score</Text>
              <Animated.Text style={[styles.statValue, { transform: [{ scale: scoreAnim }] }]}>
                {score}
              </Animated.Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Lines</Text>
              <Text style={styles.statValue}>{lines}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Moves</Text>
              <Text style={styles.statValue}>{movesCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Streak</Text>
              <Text style={[styles.statValue, { color: questionStreak > 0 ? COLORS.success : COLORS.text }]}>
                {questionStreak}
              </Text>
            </View>
          </View>
          
          {/* Game Grid */}
          <Animated.View style={[styles.gridContainer, { transform: [{ scale: gridAnim }] }]}>
            {renderGrid()}
          </Animated.View>
          
          {/* Available Blocks */}
          <View style={styles.blocksContainer}>
            <Text style={styles.blocksTitle}>Available Blocks</Text>
            <View style={styles.blocksRow}>
              {renderBlocks()}
            </View>
          </View>
        </View>
      )}
      
      {/* Instructions Modal */}
      <Modal
        visible={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Block Blast Instructions"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            🧩 Drag blocks onto the grid{'\n\n'}
            🎯 Clear full rows or columns{'\n\n'}
            📚 Answer questions for bonus points{'\n\n'}
            🏆 Try to score as many points as possible!
          </Text>
          <Button
            title="Got it!"
            onPress={() => setShowInstructions(false)}
            variant="primary"
            fullWidth
          />
        </View>
      </Modal>
      
      {/* Question Modal */}
      <Modal
        visible={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        title="Bonus Question"
      >
        {currentQuestion && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleQuestionAnswer(index)}
                >
                  <Text style={styles.optionText}>
                    {String.fromCharCode(65 + index)}) {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.studentBackground,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  errorText: {
    ...TEXT_STYLES.body,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  instructionsContainer: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  
  gameIcon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  instructionsTitle: {
    ...TEXT_STYLES.title,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  instructionsText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  
  gameInfo: {
    backgroundColor: '#e7f3ff',
    borderRadius: 15,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: '#000000ff',
    shadowColor: '#4a5bb8',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  
  infoLabel: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  infoValue: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
  },
  
  startButton: {
    marginTop: SPACING.lg,
  },
  
  gameContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e8f5e8',
    borderRadius: 15,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: '#000000ff',
    shadowColor: '#28a745',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  
  statValue: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  
  gridContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 15,
    padding: SPACING.sm,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000ff',
    shadowColor: '#ffc107',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  
  gridRow: {
    flexDirection: 'row',
  },
  
  gridCell: {
    width: 35,
    height: 35,
    margin: 1,
    borderRadius: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  gridCellFilled: {
    borderColor: '#000000ff',
    borderWidth: 2,
  },
  
  gridCellEmpty: {
    borderColor: '#dee2e6',
    backgroundColor: '#ffffff',
  },
  
  blocksContainer: {
    backgroundColor: '#f8d7da',
    borderRadius: 15,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: '#000000ff',
    shadowColor: '#dc3545',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
    height: 180,
  },
  
  blocksTitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  blocksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  blockContainer: {
    alignItems: 'center',
    flex: 1,
  },
  
  blockLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  
  blockPreview: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: SPACING.sm,
    borderWidth: 2,
    borderColor: '#6c757d',
    shadowColor: '#6c757d',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  
  blockUsed: {
    opacity: 0.4,
    backgroundColor: '#e9ecef',
  },
  
  blockSelected: {
    borderWidth: 3,
    borderColor: '#4a5bb8',
    backgroundColor: '#e7f3ff',
    shadowColor: '#4a5bb8',
    shadowOpacity: 0.4,
    elevation: 12,
    transform: [{ scale: 1.05 }],
  },
  
  blockRow: {
    flexDirection: 'row',
  },
  
  blockCell: {
    width: 20,
    height: 20,
    margin: 1,
    borderRadius: 2,
  },
  
  blockCellEmpty: {
    backgroundColor: 'transparent',
  },
  
  blockCellUsed: {
    opacity: 0.3,
  },
  
  modalContent: {
    padding: SPACING.lg,
  },
  
  modalText: {
    ...TEXT_STYLES.body,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  
  questionContainer: {
    padding: SPACING.lg,
  },
  
  questionText: {
    ...TEXT_STYLES.body,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  
  optionsContainer: {
    marginBottom: SPACING.lg,
  },
  
  optionButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: '#6c757d',
    shadowColor: '#6c757d',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  
  optionText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
  },
});

export default BlockBlastGame;