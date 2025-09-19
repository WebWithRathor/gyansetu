import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Header, Card } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { validatePhoneNumber } from '../../utils/helpers';
import { storeStudentData, storeUserType } from '../../utils/storage';
import { useApp } from '../../context/AppContext';

const StudentAuth = ({ navigation }) => {
  const { setStudentData } = useApp();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [showStudentSelection, setShowStudentSelection] = useState(false);
  
  const handlePhoneSubmit = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Mock API call to get students by phone number
      // In real app, this would be an API call
      const mockStudents = [
        {
          id: 'student_1',
          name: 'Rahul Kumar',
          phoneNumber: phoneNumber,
          grade: 8,
          classId: 'class_1',
          className: 'Class 8A',
          schoolName: 'Rural Government School',
        },
        {
          id: 'student_2',
          name: 'Priya Kumari',
          phoneNumber: phoneNumber,
          grade: 10,
          classId: 'class_2',
          className: 'Class 10B',
          schoolName: 'Rural Government School',
        },
      ];
      
      if (mockStudents.length > 0) {
        setStudents(mockStudents);
        setShowStudentSelection(true);
      } else {
        Alert.alert(
          'No Account Found',
          'No student account found with this phone number. Please contact your teacher.',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.error('Phone verification error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStudentSelect = async (student) => {
    setLoading(true);
    
    try {
      // Store student data locally
      await storeStudentData(student);
      await storeUserType('student');
      
      // Update app context
      setStudentData(student);
      
      // Navigate to dashboard
      navigation.replace('StudentDashboard');
    } catch (err) {
      console.error('Student selection error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    if (showStudentSelection) {
      setShowStudentSelection(false);
      setStudents([]);
    } else {
      navigation.goBack();
    }
  };
  
  const updatePhoneNumber = (text) => {
    setPhoneNumber(text);
    if (error) {
      setError('');
    }
  };
  
  if (showStudentSelection) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Select Your Profile"
          variant="student"
          showBackButton
          onLeftPress={handleBack}
        />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.selectionHeader}>
              <Text style={styles.selectionIcon}>👥</Text>
              <Text style={styles.selectionTitle}>Multiple profiles found</Text>
              <Text style={styles.selectionSubtitle}>
                Select your profile to continue
              </Text>
            </View>
            
            <View style={styles.studentsContainer}>
              {students.map((student) => (
                <Card
                  key={student.id}
                  variant="student"
                  onPress={() => handleStudentSelect(student)}
                  style={styles.studentCard}
                >
                  <View style={styles.studentContent}>
                    <Text style={styles.studentIcon}>🎓</Text>
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName}>{student.name}</Text>
                      <Text style={styles.studentDetails}>
                        Grade {student.grade} • {student.className}
                      </Text>
                      <Text style={styles.studentSchool}>{student.schoolName}</Text>
                    </View>
                    <Text style={styles.selectIcon}>→</Text>
                  </View>
                </Card>
              ))}
            </View>
            
            <View style={styles.helpSection}>
              <Text style={styles.helpText}>
                Don't see your name? Contact your teacher to add you to a class.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Student Login"
        variant="student"
        showBackButton
        onLeftPress={handleBack}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeIcon}>🎓</Text>
              <Text style={styles.welcomeTitle}>Welcome Student!</Text>
              <Text style={styles.welcomeSubtitle}>
                Enter your phone number to access your learning games
              </Text>
            </View>
            
            {/* Form Section */}
            <View style={styles.formSection}>
              <Input
                label="Phone Number"
                placeholder="Enter your 10-digit phone number"
                value={phoneNumber}
                onChangeText={updatePhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
                error={error}
                leftIcon={<Text style={styles.inputIcon}>📱</Text>}
              />
              
              <Button
                title="Continue"
                onPress={handlePhoneSubmit}
                loading={loading}
                variant="primary"
                fullWidth
                style={styles.submitButton}
              />
            </View>
            
            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>What you can do:</Text>
              <Text style={styles.infoText}>• Play educational games</Text>
              <Text style={styles.infoText}>• Earn points and badges</Text>
              <Text style={styles.infoText}>• Track your progress</Text>
              <Text style={styles.infoText}>• Learn even when offline</Text>
              <Text style={styles.infoText}>• Compete with classmates</Text>
            </View>
            
            {/* Help Section */}
            <View style={styles.helpSection}>
              <Text style={styles.helpTitle}>Need Help?</Text>
              <Text style={styles.helpText}>
                If you don't have an account, ask your teacher to add you to their class. 
                They will provide you with the phone number to use for login.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd29d',
  },
  
  keyboardView: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  content: {
    padding: SPACING.xl,
  },
  
  welcomeSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  
  welcomeIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  
  welcomeTitle: {
    ...TEXT_STYLES.title,
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  welcomeSubtitle: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  
  formSection: {
    marginBottom: SPACING.xl,
  },
  
  inputIcon: {
    fontSize: 20,
  },
  
  submitButton: {
    marginTop: SPACING.lg,
  },
  
  // Student Selection Styles
  selectionHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  
  selectionIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  
  selectionTitle: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  selectionSubtitle: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  studentsContainer: {
    marginBottom: SPACING.xl,
  },
  
  studentCard: {
    marginBottom: SPACING.md,
  },
  
  studentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  studentIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  
  studentInfo: {
    flex: 1,
  },
  
  studentName: {
    ...TEXT_STYLES.heading,
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
  
  selectIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  
  // Info and Help Sections
  infoSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  
  infoTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  
  infoText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  
  helpSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  
  helpTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  
  helpText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default StudentAuth;