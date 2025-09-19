import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, Input, Header } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { validatePhoneNumber, validateName, validateSchoolName } from '../../utils/helpers';
import { storeTeacherData, storeUserType } from '../../utils/storage';
import { useApp } from '../../context/AppContext';

const TeacherAuth = ({ navigation }) => {
  const { setTeacherData } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    phoneNumber: '',
    name: '',
    schoolName: '',
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    if (!isLogin) {
      if (!validateName(formData.name)) {
        newErrors.name = 'Please enter a valid name (at least 2 characters)';
      }
      
      if (!validateSchoolName(formData.schoolName)) {
        newErrors.schoolName = 'Please enter a valid school name (at least 3 characters)';
      }
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
      // Mock authentication - replace with actual API call
      const teacherData = {
        id: `teacher_${Date.now()}`,
        phoneNumber: formData.phoneNumber,
        name: isLogin ? 'Teacher Name' : formData.name,
        schoolName: isLogin ? 'School Name' : formData.schoolName,
        createdAt: new Date().toISOString(),
      };
      
      // Store data locally
      await storeTeacherData(teacherData);
      await storeUserType('teacher');
      
      // Update app context
      setTeacherData(teacherData);
      
      // Navigate to dashboard
      navigation.replace('TeacherDashboard');
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
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
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      phoneNumber: formData.phoneNumber,
      name: '',
      schoolName: '',
    });
  };
  
  return (
    <View style={styles.container}>
      <Header
        title={isLogin ? 'Teacher Login' : 'Teacher Registration'}
        variant="teacher"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Icon name="school" size={48} color={COLORS.primary} />
              <Text style={styles.welcomeTitle}>
                {isLogin ? 'Welcome Back!' : 'Join Gyansetu'}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {isLogin 
                  ? 'Sign in to manage your classes and create learning games'
                  : 'Create your teacher account and start building engaging lessons'
                }
              </Text>
            </View>
            
            {/* Form Section */}
            <View style={styles.formSection}>
              <Input
                label="Phone Number"
                placeholder="Enter your 10-digit phone number"
                value={formData.phoneNumber}
                onChangeText={(text) => updateFormData('phoneNumber', text)}
                keyboardType="phone-pad"
                maxLength={10}
                error={errors.phoneNumber}
                leftIcon={<Icon name="phone" size={20} color={COLORS.textSecondary} />}
              />
              
              {!isLogin && (
                <>
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChangeText={(text) => updateFormData('name', text)}
                    error={errors.name}
                    leftIcon={<Icon name="person" size={20} color={COLORS.textSecondary} />}
                  />
                  
                  <Input
                    label="School Name"
                    placeholder="Enter your school name"
                    value={formData.schoolName}
                    onChangeText={(text) => updateFormData('schoolName', text)}
                    error={errors.schoolName}
                    leftIcon={<Icon name="school" size={20} color={COLORS.textSecondary} />}
                  />
                </>
              )}
              
              <Button
                title={isLogin ? 'Sign In' : 'Create Account'}
                onPress={handleSubmit}
                loading={loading}
                variant="primary"
                fullWidth
                style={styles.submitButton}
              />
            </View>
            
            {/* Toggle Section */}
            <View style={styles.toggleSection}>
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </Text>
              <Button
                title={isLogin ? 'Register' : 'Sign In'}
                onPress={toggleMode}
                variant="ghost"
                size="small"
              />
            </View>
            
          
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.authBackground,
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
  
  welcomeTitle: {
    ...TEXT_STYLES.title,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.md,
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
  
  submitButton: {
    marginTop: SPACING.lg,
  },
  
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  
  toggleText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  
  infoSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  
  infoTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  
  infoText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
});

export default TeacherAuth;