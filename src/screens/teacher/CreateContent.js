import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Header, Card, Input, Button, Modal } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { validateQuestion, generateId, shuffleArray } from '../../utils/helpers';
import { saveGame } from '../../utils/storage';
import { useApp } from '../../context/AppContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CreateContent = ({ navigation }) => {
  const { teacherData } = useApp();
  const [gameType, setGameType] = useState('matching'); // 'matching' or 'blockblast'
  const [step, setStep] = useState(1); // 1: Game Info, 2: Add Questions, 3: Preview & Save
  const [loading, setLoading] = useState(false);
  
  // Game Information
  const [gameInfo, setGameInfo] = useState({
    title: '',
    subject: '',
    grade: '',
    difficulty: 'Easy',
    description: '',
    estimatedTime: '5-10 min',
    tags: [],
  });
  const [gameInfoErrors, setGameInfoErrors] = useState({});
  
  // Questions and Answers
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
  });
  const [questionErrors, setQuestionErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(-1);
  
  // Modals
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Physics', 'Chemistry', 'Biology'];
  const grades = ['6', '7', '8', '9', '10', '11', '12'];
  const difficulties = ['Easy',  'Hard','Medium',];
  const timeOptions = ['5-10 min', '10-15 min', '15-20 min', '20-30 min'];

  useEffect(() => {
    // Auto-save progress periodically
    const saveProgress = setInterval(() => {
      if (questions.length > 0) {
        console.log('Auto-saving progress...');
        // In real app, save to local storage
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveProgress);
  }, [questions]);

  const validateGameInfo = () => {
    const errors = {};
    
    if (gameInfo.title.trim().length < 3) {
      errors.title = 'Game title must be at least 3 characters';
    }
    
    if (!gameInfo.subject.trim()) {
      errors.subject = 'Please select a subject';
    }
    
    if (!gameInfo.grade) {
      errors.grade = 'Please select a grade';
    }
    
    if (gameInfo.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    setGameInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCurrentQuestion = () => {
    const errors = {};
    
    if (!validateQuestion(currentQuestion.question)) {
      errors.question = 'Question must be at least 5 characters';
    }
    
    // Check options
    const filledOptions = currentQuestion.options.filter(opt => opt.trim().length > 0);
    if (filledOptions.length < 2) {
      errors.options = 'At least 2 options are required';
    }
    
    // Check if correct answer is valid
    if (currentQuestion.correctAnswer >= filledOptions.length || 
        !currentQuestion.options[currentQuestion.correctAnswer].trim()) {
      errors.correctAnswer = 'Please select a valid correct answer';
    }
    
    setQuestionErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateGameInfo()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (questions.length === 0) {
        Alert.alert('No Questions', 'Please add at least one question before proceeding.');
        return;
      }
      setStep(3);
    }
  };

  const handleAddQuestion = () => {
    if (!validateCurrentQuestion()) {
      return;
    }
    
    const newQuestion = {
      id: generateId(),
      question: currentQuestion.question.trim(),
      options: currentQuestion.options.filter(opt => opt.trim().length > 0),
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation.trim(),
      type: gameType,
    };
    
    if (editingIndex >= 0) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setEditingIndex(-1);
    } else {
      // Add new question
      setQuestions([...questions, newQuestion]);
    }
    
    // Reset form
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    });
    setQuestionErrors({});
  };

  const handleEditQuestion = (index) => {
    const question = questions[index];
    setCurrentQuestion({
      question: question.question,
      options: [...question.options, '', '', '', ''].slice(0, 4), // Ensure 4 options
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    });
    setEditingIndex(index);
  };

  const handleDeleteQuestion = (index) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedQuestions = questions.filter((_, i) => i !== index);
            setQuestions(updatedQuestions);
          }
        }
      ]
    );
  };

  const handleSaveGame = async () => {
    if (questions.length < 2) {
      Alert.alert('Insufficient Questions', 'Please add at least 2 questions for testing purposes.');
      return;
    }
    
    setLoading(true);
    
    try {
      const gameData = {
        id: generateId(),
        ...gameInfo,
        type: gameType,
        questions: shuffleArray(questions), // Shuffle questions for variety
        totalQuestions: questions.length,
        createdBy: teacherData?.id,
        createdAt: new Date().toISOString(),
        isPublished: false,
        version: '1.0',
        playCount: 0,
        rating: 0,
      };
      
      await saveGame(gameData);
      
      Alert.alert(
        'Game Created!',
        `"${gameInfo.title}" has been created successfully. You can now publish it to your classes.`,
        [
          { text: 'Create Another', onPress: () => {
            // Reset all forms
            setGameInfo({
              title: '',
              subject: '',
              grade: '',
              difficulty: 'Easy',
              description: '',
              estimatedTime: '5-10 min',
              tags: [],
            });
            setQuestions([]);
            setStep(1);
          }},
          { text: 'Go to Dashboard', onPress: () => navigation.navigate('TeacherDashboard') }
        ]
      );
    } catch (error) {
      console.error('Error saving game:', error);
      Alert.alert('Error', 'Failed to save the game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = (templateType) => {
    const templates = {
      mathBasic: {
        title: 'Basic Math Quiz',
        subject: 'Mathematics',
        grade: '6',
        difficulty: 'Easy',
        description: 'Basic arithmetic operations and number patterns',
        questions: [
          {
            id: generateId(),
            question: 'What is 12 + 8?',
            options: ['18', '20', '22', '24'],
            correctAnswer: 1,
            explanation: '12 + 8 = 20',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'Which number comes next in the sequence: 2, 4, 6, 8, ?',
            options: ['9', '10', '11', '12'],
            correctAnswer: 1,
            explanation: 'This is an even number sequence, so 10 comes next.',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'What is 15 - 7?',
            options: ['6', '7', '8', '9'],
            correctAnswer: 2,
            explanation: '15 - 7 = 8',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'How many sides does a triangle have?',
            options: ['2', '3', '4', '5'],
            correctAnswer: 1,
            explanation: 'A triangle has exactly 3 sides.',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'What is 6 × 4?',
            options: ['20', '22', '24', '26'],
            correctAnswer: 2,
            explanation: '6 × 4 = 24',
            type: gameType,
          }
        ]
      },
      scienceBasic: {
        title: 'Science Fundamentals',
        subject: 'Science',
        grade: '7',
        difficulty: 'Easy',
        description: 'Basic science concepts and natural phenomena',
        questions: [
          {
            id: generateId(),
            question: 'What gas do plants absorb from the air during photosynthesis?',
            options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
            correctAnswer: 1,
            explanation: 'Plants absorb carbon dioxide and release oxygen during photosynthesis.',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'What is the largest planet in our solar system?',
            options: ['Earth', 'Jupiter', 'Saturn', 'Mars'],
            correctAnswer: 1,
            explanation: 'Jupiter is the largest planet in our solar system.',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'Which organ pumps blood throughout the human body?',
            options: ['Brain', 'Heart', 'Lungs', 'Liver'],
            correctAnswer: 1,
            explanation: 'The heart pumps blood throughout the human body.',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'What do we call animals that eat only plants?',
            options: ['Carnivores', 'Herbivores', 'Omnivores', 'Predators'],
            correctAnswer: 1,
            explanation: 'Animals that eat only plants are called herbivores.',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'How many bones are there approximately in an adult human body?',
            options: ['106', '156', '206', '256'],
            correctAnswer: 2,
            explanation: 'An adult human body has approximately 206 bones.',
            type: gameType,
          }
        ]
      },
      englishBasic: {
        title: 'English Grammar Basics',
        subject: 'English',
        grade: '6',
        difficulty: 'Easy',
        description: 'Basic English grammar and vocabulary concepts',
        questions: [
          {
            id: generateId(),
            question: 'Which of these is a noun?',
            options: ['Run', 'Beautiful', 'Cat', 'Quickly'],
            correctAnswer: 2,
            explanation: 'Cat is a noun because it names a thing (animal).',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'What is the plural of "child"?',
            options: ['Childs', 'Children', 'Childes', 'Child'],
            correctAnswer: 1,
            explanation: 'The plural of "child" is "children".',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'Which word is an adjective?',
            options: ['Sing', 'Happy', 'Book', 'Dance'],
            correctAnswer: 1,
            explanation: 'Happy is an adjective because it describes how someone feels.',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'Complete the sentence: "She _____ to school every day."',
            options: ['go', 'goes', 'going', 'gone'],
            correctAnswer: 1,
            explanation: 'With "she" (third person singular), we use "goes".',
            type: gameType,
          },
          {
            id: generateId(),
            question: 'What is the opposite of "big"?',
            options: ['Large', 'Huge', 'Small', 'Tall'],
            correctAnswer: 2,
            explanation: 'Small is the opposite of big.',
            type: gameType,
          }
        ]
      }
    };
    
    const template = templates[templateType];
    if (template) {
      setGameInfo({
        title: template.title,
        subject: template.subject,
        grade: template.grade,
        difficulty: template.difficulty,
        description: template.description,
        estimatedTime: '5-10 min',
        tags: [],
      });
      setQuestions(template.questions);
      setShowTemplateModal(false);
      setStep(2);
    }
  };

  const updateGameInfo = (field, value) => {
    setGameInfo(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (gameInfoErrors[field]) {
      setGameInfoErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateCurrentQuestion = (field, value) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (questionErrors[field]) {
      setQuestionErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  return (
    <View style={styles.container}>
      <Header
        title="Create Content"
        subtitle={`Step ${step} of 3 • ${gameType === 'matching' ? 'Matching Game' : 'Block Blast Game'}`}
        variant="teacher"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]}>
                <Text style={[styles.progressStepText, step >= 1 && styles.progressStepTextActive]}>1</Text>
              </View>
              <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
              <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
                <Text style={[styles.progressStepText, step >= 2 && styles.progressStepTextActive]}>2</Text>
              </View>
              <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
              <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]}>
                <Text style={[styles.progressStepText, step >= 3 && styles.progressStepTextActive]}>3</Text>
              </View>
            </View>
            
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Game Info</Text>
              <Text style={styles.progressLabel}>Questions</Text>
              <Text style={styles.progressLabel}>Review</Text>
            </View>
          </View>

          {/* Game Type Selection */}
          <View style={styles.gameTypeSection}>
            <Text style={styles.sectionTitle}>Game Type</Text>
            <View style={styles.gameTypeButtons}>
              <TouchableOpacity
                style={[styles.gameTypeButton, gameType === 'matching' && styles.gameTypeButtonActive]}
                onPress={() => setGameType('matching')}
              >
                <Icon name="drag-indicator" size={32} color={gameType === 'matching' ? COLORS.gamePurple : COLORS.textSecondary} />
                <Text style={[styles.gameTypeText, gameType === 'matching' && styles.gameTypeTextActive]}>
                  Matching Game
                </Text>
                <Text style={styles.gameTypeDescription}>
                  Drag & drop to match questions with answers
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.gameTypeButton, gameType === 'blockblast' && styles.gameTypeButtonActive]}
                onPress={() => setGameType('blockblast')}
              >
                <MaterialCommunityIcons name="puzzle" size={32} color={gameType === 'blockblast' ? COLORS.gamePurple : COLORS.textSecondary} />
                <Text style={[styles.gameTypeText, gameType === 'blockblast' && styles.gameTypeTextActive]}>
                  Block Blast Game
                </Text>
                <Text style={styles.gameTypeDescription}>
                  Clear blocks while answering questions
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Step 1: Game Information */}
          {step === 1 && (
            <Card style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Game Information</Text>
                <Text style={styles.stepSubtitle}>Set up basic details for your game</Text>
              </View>
              
              <View style={styles.stepContent}>
                <Input
                  label="Game Title *"
                  placeholder="e.g., Math Quiz Level 1"
                  value={gameInfo.title}
                  onChangeText={(text) => updateGameInfo('title', text)}
                  error={gameInfoErrors.title}
                  leftIcon={<Icon name="gamepad" size={18} color={COLORS.primary} />}
                />
                
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.pickerLabel}>Subject *</Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.subjectScrollContainer}
                      style={styles.subjectScrollView}
                    >
                      {subjects.map((subject) => (
                        <TouchableOpacity
                          key={subject}
                          style={[
                            styles.pickerChip,
                            gameInfo.subject === subject && styles.pickerChipActive
                          ]}
                          onPress={() => updateGameInfo('subject', subject)}
                        >
                          <Text style={[
                            styles.pickerChipText,
                            gameInfo.subject === subject && styles.pickerChipTextActive
                          ]}>
                            {subject}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    {gameInfoErrors.subject && (
                      <Text style={styles.errorText}>{gameInfoErrors.subject}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.pickerLabel}>Grade *</Text>
                    <View style={styles.gradeSelector}>
                      {grades.map((grade) => (
                        <TouchableOpacity
                          key={grade}
                          style={[
                            styles.gradeChip,
                            gameInfo.grade === grade && styles.gradeChipActive
                          ]}
                          onPress={() => updateGameInfo('grade', grade)}
                        >
                          <Text style={[
                            styles.gradeChipText,
                            gameInfo.grade === grade && styles.gradeChipTextActive
                          ]}>
                            {grade}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {gameInfoErrors.grade && (
                      <Text style={styles.errorText}>{gameInfoErrors.grade}</Text>
                    )}
                  </View>
                  
                  <View style={styles.halfWidth}>
                    <Text style={styles.pickerLabel}>Difficulty</Text>
                    <View style={styles.difficultySelector}>
                      {difficulties.map((difficulty) => (
                        <TouchableOpacity
                          key={difficulty}
                          style={[
                            styles.difficultyChip,
                            gameInfo.difficulty === difficulty && styles.difficultyChipActive
                          ]}
                          onPress={() => updateGameInfo('difficulty', difficulty)}
                        >
                          <Text style={[
                            styles.difficultyChipText,
                            gameInfo.difficulty === difficulty && styles.difficultyChipTextActive
                          ]}>
                            {difficulty}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
                
                <Input
                  label="Description *"
                  placeholder="Brief description of what students will learn"
                  value={gameInfo.description}
                  onChangeText={(text) => updateGameInfo('description', text)}
                  error={gameInfoErrors.description}
                  multiline
                  numberOfLines={3}
                  leftIcon={<Icon name="description" size={18} color={COLORS.primary} />}
                />
                
                <View style={styles.timeSection}>
                  <Text style={styles.pickerLabel}>Estimated Time</Text>
                  <View style={styles.timeSelector}>
                    {timeOptions.map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.timeChip,
                          gameInfo.estimatedTime === time && styles.timeChipActive
                        ]}
                        onPress={() => updateGameInfo('estimatedTime', time)}
                      >
                        <Text style={[
                          styles.timeChipText,
                          gameInfo.estimatedTime === time && styles.timeChipTextActive
                        ]}>
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.templateSection}>
                  <Button
                    title="Use Template"
                    variant="outline"
                    size="small"
                    onPress={() => setShowTemplateModal(true)}
                    style={styles.templateButton}
                  />
                </View>
              </View>
            </Card>
          )}

          {/* Step 2: Add Questions */}
          {step === 2 && (
            <>
              {/* Questions List */}
              {questions.length > 0 && (
                <Card style={styles.questionsListCard}>
                  <View style={styles.questionsHeader}>
                    <Text style={styles.questionsTitle}>
                      Questions ({questions.length})
                    </Text>
                  </View>
                  
                  <View style={styles.questionsList}>
                    {questions.map((question, index) => (
                      <View key={question.id} style={styles.questionItem}>
                        <View style={styles.questionContent}>
                          <Text style={styles.questionNumber}>Q{index + 1}</Text>
                          <View style={styles.questionText}>
                            <Text style={styles.questionTitle} numberOfLines={2}>
                              {question.question}
                            </Text>
                            <Text style={styles.questionAnswer}>
                              Answer: {question.options[question.correctAnswer]}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.questionActions}>
                          <TouchableOpacity
                            onPress={() => handleEditQuestion(index)}
                            style={styles.questionActionButton}
                          >
                            <Icon name="edit" size={16} color={COLORS.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteQuestion(index)}
                            style={styles.questionActionButton}
                          >
                            <Icon name="delete" size={16} color={COLORS.error} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </Card>
              )}

              {/* Add/Edit Question Form */}
              <Card style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>
                    {editingIndex >= 0 ? 'Edit Question' : 'Add Question'}
                  </Text>
                  <Text style={styles.stepSubtitle}>
                    Create engaging questions for your {gameType === 'matching' ? 'matching' : 'block blast'} game
                  </Text>
                </View>
                
                <View style={styles.stepContent}>
                  <Input
                    label="Question *"
                    placeholder="Enter your question here"
                    value={currentQuestion.question}
                    onChangeText={(text) => updateCurrentQuestion('question', text)}
                    error={questionErrors.question}
                    multiline
                    numberOfLines={2}
                    leftIcon={<Icon name="help-outline" size={18} color={COLORS.primary} />}
                  />
                  
                  <View style={styles.optionsSection}>
                    <Text style={styles.optionsTitle}>Answer Options *</Text>
                    {currentQuestion.options.map((option, index) => (
                      <View key={index} style={styles.optionRow}>
                        <TouchableOpacity
                          style={[
                            styles.optionSelector,
                            currentQuestion.correctAnswer === index && styles.optionSelectorActive
                          ]}
                          onPress={() => updateCurrentQuestion('correctAnswer', index)}
                        >
                          <Text style={[
                            styles.optionSelectorText,
                            currentQuestion.correctAnswer === index && styles.optionSelectorTextActive
                          ]}>
                            {String.fromCharCode(65 + index)}
                          </Text>
                        </TouchableOpacity>
                        
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + index)}${index < 2 ? ' (required)' : ' (optional)'}`}
                          value={option}
                          onChangeText={(text) => updateOption(index, text)}
                          style={styles.optionInput}
                        />
                      </View>
                    ))}
                    {questionErrors.options && (
                      <Text style={styles.errorText}>{questionErrors.options}</Text>
                    )}
                    {questionErrors.correctAnswer && (
                      <Text style={styles.errorText}>{questionErrors.correctAnswer}</Text>
                    )}
                  </View>
                  
                  <Input
                    label="Explanation (Optional)"
                    placeholder="Explain why this is the correct answer"
                    value={currentQuestion.explanation}
                    onChangeText={(text) => updateCurrentQuestion('explanation', text)}
                    multiline
                    numberOfLines={2}
                    leftIcon={<Icon name="lightbulb-outline" size={18} color={COLORS.primary} />}
                  />
                  
                  <Button
                    title={editingIndex >= 0 ? 'Update Question' : 'Add Question'}
                    onPress={handleAddQuestion}
                    variant="primary"
                    fullWidth
                    style={styles.addQuestionButton}
                  />
                  
                  {editingIndex >= 0 && (
                    <Button
                      title="Cancel Edit"
                      onPress={() => {
                        setEditingIndex(-1);
                        setCurrentQuestion({
                          question: '',
                          options: ['', '', '', ''],
                          correctAnswer: 0,
                          explanation: '',
                        });
                        setQuestionErrors({});
                      }}
                      variant="ghost"
                      fullWidth
                      style={styles.cancelEditButton}
                    />
                  )}
                </View>
              </Card>
            </>
          )}

          {/* Step 3: Preview & Save */}
          {step === 3 && (
            <Card style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>Review & Save</Text>
                <Text style={styles.stepSubtitle}>Review your game before saving</Text>
              </View>
              
              <View style={styles.stepContent}>
                <View style={styles.gamePreview}>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Title:</Text>
                    <Text style={styles.previewValue}>{gameInfo.title}</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Subject:</Text>
                    <Text style={styles.previewValue}>{gameInfo.subject}</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Grade:</Text>
                    <Text style={styles.previewValue}>{gameInfo.grade}</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Difficulty:</Text>
                    <Text style={styles.previewValue}>{gameInfo.difficulty}</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Questions:</Text>
                    <Text style={styles.previewValue}>{questions.length}</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Est. Time:</Text>
                    <Text style={styles.previewValue}>{gameInfo.estimatedTime}</Text>
                  </View>
                </View>
                
                <Button
                  title="Preview Game"
                  onPress={() => setShowPreviewModal(true)}
                  variant="outline"
                  fullWidth
                  style={styles.previewButton}
                />
                
                <Button
                  title="Save Game"
                  onPress={handleSaveGame}
                  loading={loading}
                  variant="primary"
                  fullWidth
                  style={styles.saveButton}
                />
              </View>
            </Card>
          )}

          {/* Navigation Buttons */}
          <View style={styles.navigationSection}>
            {step > 1 && (
              <Button
                title="Previous"
                onPress={() => setStep(step - 1)}
                variant="outline"
                style={styles.navButton}
              />
            )}
            
            {step < 3 && (
              <Button
                title="Next"
                onPress={handleNext}
                variant="primary"
                style={styles.navButton}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Template Selection Modal */}
      <Modal
        visible={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Choose Template"
      >
        <View style={styles.templateModalContent}>
          <TouchableOpacity
            style={styles.templateOption}
            onPress={() => loadTemplate('mathBasic')}
          >
            <MaterialCommunityIcons name="calculator" size={32} color={COLORS.primary} />
            <View style={styles.templateText}>
              <Text style={styles.templateTitle}>Basic Math</Text>
              <Text style={styles.templateDescription}>Arithmetic and number patterns (5 questions)</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.templateOption}
            onPress={() => loadTemplate('scienceBasic')}
          >
            <MaterialCommunityIcons name="flask" size={32} color={COLORS.primary} />
            <View style={styles.templateText}>
              <Text style={styles.templateTitle}>Science Basics</Text>
              <Text style={styles.templateDescription}>Fundamental science concepts (5 questions)</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.templateOption}
            onPress={() => loadTemplate('englishBasic')}
          >
            <MaterialCommunityIcons name="book-open" size={32} color={COLORS.primary} />
            <View style={styles.templateText}>
              <Text style={styles.templateTitle}>English Grammar</Text>
              <Text style={styles.templateDescription}>Basic grammar and vocabulary (5 questions)</Text>
            </View>
          </TouchableOpacity>
          
          <Button
            title="Start from Scratch"
            onPress={() => setShowTemplateModal(false)}
            variant="ghost"
            fullWidth
            style={styles.scratchButton}
          />
        </View>
      </Modal>

      {/* Game Preview Modal */}
      <Modal
        visible={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Game Preview"
      >
        <ScrollView style={styles.previewModalContent}>
          <Text style={styles.previewGameTitle}>{gameInfo.title}</Text>
          <Text style={styles.previewGameDescription}>{gameInfo.description}</Text>
          
          <View style={styles.previewQuestions}>
            {questions.slice(0, 3).map((question, index) => (
              <View key={question.id} style={styles.previewQuestion}>
                <Text style={styles.previewQuestionTitle}>
                  Q{index + 1}: {question.question}
                </Text>
                {question.options.map((option, optIndex) => (
                  <Text
                    key={optIndex}
                    style={[
                      styles.previewOption,
                      optIndex === question.correctAnswer && styles.previewOptionCorrect
                    ]}
                  >
                    {String.fromCharCode(65 + optIndex)}) {option}
                  </Text>
                ))}
              </View>
            ))}
            
            {questions.length > 3 && (
              <Text style={styles.previewMore}>
                ... and {questions.length - 3} more questions
              </Text>
            )}
          </View>
        </ScrollView>
      </Modal>
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
  
  // Progress Section
  progressSection: {
    marginBottom: SPACING.xl,
  },
  
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  progressStepActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  
  progressStepText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  
  progressStepTextActive: {
    color: COLORS.background,
  },
  
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.sm,
  },
  
  progressLineActive: {
    backgroundColor: COLORS.primary,
  },
  
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  progressLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    flex: 1,
  },
  
  // Game Type Section
  gameTypeSection: {
    marginBottom: SPACING.xl,
  },
  
  sectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  
  gameTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  gameTypeButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  
  gameTypeButtonActive: {
    backgroundColor: COLORS.gamePurple + '20',
    borderColor: COLORS.gamePurple,
  },
  
  gameTypeIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  
  gameTypeText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  
  gameTypeTextActive: {
    color: COLORS.gamePurple,
  },
  
  gameTypeDescription: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  // Step Card
  stepCard: {
    marginBottom: SPACING.xl,
  },
  
  stepHeader: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  stepTitle: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  stepSubtitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  stepContent: {
    padding: SPACING.lg,
  },
  
  inputIcon: {
    fontSize: 18,
  },
  
  row: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  
  halfWidth: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  
  pickerLabel: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  
  pickerChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 80, // Ensure minimum width
    alignItems: 'center',
  },
  
  pickerChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  
  pickerChipText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  pickerChipTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  
  gradeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  gradeChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 50,
    alignItems: 'center',
  },
  
  gradeChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  
  gradeChipText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  gradeChipTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  
  difficultySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  
  difficultyChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    // flex: 1,
    alignItems: 'center',
    width:'max-content',
  },
  
  difficultyChipActive: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
  },
  
  difficultyChipText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    whiteSpace: 'nowrap',
  },
  
  difficultyChipTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  
  timeSection: {
    marginBottom: SPACING.lg,
  },
  
  timeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  timeChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  timeChipActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  
  timeChipText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  timeChipTextActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  
  templateSection: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  
  templateButton: {
    marginTop: SPACING.md,
  },
  
  errorText: {
    ...TEXT_STYLES.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  
  // Questions List
  questionsListCard: {
    marginBottom: SPACING.lg,
  },
  
  questionsHeader: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  questionsTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
  },
  
  questionsList: {
    maxHeight: 200,
  },
  
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  questionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  questionNumber: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: SPACING.md,
    minWidth: 30,
  },
  
  questionText: {
    flex: 1,
  },
  
  questionTitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  questionAnswer: {
    ...TEXT_STYLES.caption,
    color: COLORS.success,
  },
  
  questionActions: {
    flexDirection: 'row',
  },
  
  questionActionButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  
  questionActionText: {
    fontSize: 16,
  },
  
  // Options Section
  optionsSection: {
    marginBottom: SPACING.lg,
  },
  
  optionsTitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    marginBottom: SPACING.md,
    fontWeight: '500',
  },
  
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  optionSelector: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  
  optionSelectorActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  
  optionSelectorText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  
  optionSelectorTextActive: {
    color: COLORS.background,
  },
  
  optionInput: {
    flex: 1,
  },
  
  addQuestionButton: {
    marginTop: SPACING.lg,
  },
  
  cancelEditButton: {
    marginTop: SPACING.md,
  },
  
  // Preview Section
  gamePreview: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  
  previewLabel: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  previewValue: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
  },
  
  previewButton: {
    marginBottom: SPACING.md,
  },
  
  saveButton: {
    marginBottom: SPACING.xl,
  },
  
  // Navigation
  navigationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  
  navButton: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  
  // Template Modal
  templateModalContent: {
    maxHeight: 400,
  },
  
  templateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  templateIcon: {
    fontSize: 32,
    marginRight: SPACING.lg,
  },
  
  templateText: {
    flex: 1,
  },
  
  templateTitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  
  templateDescription: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  
  scratchButton: {
    marginTop: SPACING.lg,
  },
  
  // Preview Modal
  previewModalContent: {
    maxHeight: 400,
  },
  
  previewGameTitle: {
    ...TEXT_STYLES.title,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  previewGameDescription: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  
  previewQuestions: {
    // No specific styles needed
  },
  
  previewQuestion: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  
  previewQuestionTitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  
  previewOption: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.md,
  },
  
  previewOptionCorrect: {
    color: COLORS.success,
    fontWeight: '600',
  },
  
  previewMore: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: SPACING.lg,
  },
  
  subjectScrollView: {
    flexGrow: 0,
  },
  
  subjectScrollContainer: {
    paddingRight: SPACING.lg, // Add padding at the end
    alignItems: 'center',
  },
});

export default CreateContent;