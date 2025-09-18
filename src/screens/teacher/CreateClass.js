import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Header, Card } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { validateGrade } from '../../utils/helpers';
import { addClass } from '../../utils/storage';
import { useApp } from '../../context/AppContext';

const CreateClass = ({ navigation }) => {
  const { teacherData } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    className: '',
    grade: '',
    subject: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  
  const subjects = [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 
    'Physics', 'Chemistry', 'Biology', 'History', 'Geography'
  ];
  
  const grades = ['6', '7', '8', '9', '10', '11', '12'];
  
  const validateForm = () => {
    const newErrors = {};
    
    if (formData.className.trim().length < 3) {
      newErrors.className = 'Class name must be at least 3 characters';
    }
    
    if (!validateGrade(formData.grade)) {
      newErrors.grade = 'Please select a valid grade (6-12)';
    }
    
    if (formData.subject.trim().length < 2) {
      newErrors.subject = 'Please enter a subject';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const newClass = {
        id: `class_${Date.now()}`,
        teacherId: teacherData?.id,
        className: formData.className.trim(),
        grade: formData.grade,
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        createdAt: new Date().toISOString(),
        studentCount: 0,
      };
      
      await addClass(newClass);
      
      Alert.alert(
        'Success',
        'Class created successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error creating class:', error);
      Alert.alert('Error', 'Failed to create class. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Create Class"
        variant="teacher"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header Card */}
          <Card variant="teacher" style={styles.headerCard}>
            <View style={styles.headerContent}>
              <Text style={styles.headerIcon}>🏫</Text>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Create New Class</Text>
                <Text style={styles.headerSubtitle}>
                  Set up a new class to organize your students and lessons
                </Text>
              </View>
            </View>
          </Card>
          
          {/* Form Section */}
          <View style={styles.formSection}>
            <Input
              label="Class Name"
              placeholder="e.g., Math Class 8A, Science Lab"
              value={formData.className}
              onChangeText={(text) => updateFormData('className', text)}
              error={errors.className}
              leftIcon={<Text style={styles.inputIcon}>📚</Text>}
            />
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.pickerLabel}>Grade</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.gradeSelector}
                >
                  {grades.map((grade) => (
                    <Button
                      key={grade}
                      title={`Grade ${grade}`}
                      variant={formData.grade === grade ? 'primary' : 'outline'}
                      size="small"
                      onPress={() => updateFormData('grade', grade)}
                      style={styles.gradeButton}
                    />
                  ))}
                </ScrollView>
                {errors.grade && (
                  <Text style={styles.errorText}>{errors.grade}</Text>
                )}
              </View>
            </View>
            
            <Input
              label="Subject"
              placeholder="e.g., Mathematics, Science, English"
              value={formData.subject}
              onChangeText={(text) => updateFormData('subject', text)}
              error={errors.subject}
              leftIcon={<Text style={styles.inputIcon}>📖</Text>}
            />
            
            <View style={styles.subjectSuggestions}>
              <Text style={styles.suggestionsLabel}>Common subjects:</Text>
              <View style={styles.suggestionsContainer}>
                {subjects.slice(0, 6).map((subject) => (
                  <Button
                    key={subject}
                    title={subject}
                    variant="ghost"
                    size="small"
                    onPress={() => updateFormData('subject', subject)}
                    style={styles.suggestionButton}
                  />
                ))}
              </View>
            </View>
            
            <Input
              label="Description (Optional)"
              placeholder="Brief description of the class"
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              multiline
              numberOfLines={3}
              leftIcon={<Text style={styles.inputIcon}>📝</Text>}
            />
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Button
              title="Create Class"
              onPress={handleSubmit}
              loading={loading}
              variant="primary"
              fullWidth
              style={styles.createButton}
            />
            
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              fullWidth
              style={styles.cancelButton}
            />
          </View>
          
          {/* Info Section */}
          <Card variant="filled" style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoTitle}>Next Steps</Text>
              <Text style={styles.infoText}>
                After creating your class:{'\n'}
                • Add students to the class{'\n'}
                • Create educational games{'\n'}
                • Publish games to your students
              </Text>
            </View>
          </Card>
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
  
  // Header Card
  headerCard: {
    marginBottom: SPACING.xl,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  headerIcon: {
    fontSize: 48,
    marginRight: SPACING.lg,
  },
  
  headerText: {
    flex: 1,
  },
  
  headerTitle: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  headerSubtitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  // Form Section
  formSection: {
    marginBottom: SPACING.xl,
  },
  
  inputIcon: {
    fontSize: 20,
  },
  
  row: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  
  halfWidth: {
    flex: 1,
  },
  
  pickerLabel: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  
  gradeSelector: {
    marginBottom: SPACING.xs,
  },
  
  gradeButton: {
    marginRight: SPACING.sm,
    minWidth: 80,
  },
  
  errorText: {
    ...TEXT_STYLES.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  
  subjectSuggestions: {
    marginBottom: SPACING.lg,
  },
  
  suggestionsLabel: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  suggestionButton: {
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  
  // Action Section
  actionSection: {
    marginBottom: SPACING.xl,
  },
  
  createButton: {
    marginBottom: SPACING.md,
  },
  
  cancelButton: {
    // No additional styles needed
  },
  
  // Info Section
  infoCard: {
    marginBottom: SPACING.xl,
  },
  
  infoContent: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  
  infoIcon: {
    fontSize: 32,
    marginBottom: SPACING.md,
  },
  
  infoTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  infoText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CreateClass;