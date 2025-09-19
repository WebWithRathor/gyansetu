import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Card, Input, Button, Modal } from '../../components/common';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import { validatePhoneNumber, validateName, formatStudentName, generateId } from '../../utils/helpers';
import { getClasses, addStudent, getStudents } from '../../utils/storage';
import { useApp } from '../../context/AppContext';

const AddStudents = ({ navigation }) => {
  const { teacherData } = useApp();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [addMode, setAddMode] = useState('single'); // 'single', 'bulk', 'excel'
  const [showClassModal, setShowClassModal] = useState(false);
  
  // Single student form
  const [singleStudentForm, setSingleStudentForm] = useState({
    name: '',
    rollNumber: '',
    phoneNumber: '',
    parentName: '',
    parentPhone: '',
  });
  const [singleStudentErrors, setSingleStudentErrors] = useState({});
  
  // Bulk students form
  const [bulkStudentsText, setBulkStudentsText] = useState('');
  const [bulkStudentsPreview, setBulkStudentsPreview] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const allClasses = await getClasses();
        const teacherClasses = allClasses.filter(cls => cls.teacherId === teacherData?.id);
        setClasses(teacherClasses);
        
        const allStudents = await getStudents();
        setStudents(allStudents);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [teacherData?.id]);

  const loadStudents = async () => {
    try {
      const allStudents = await getStudents();
      setStudents(allStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const validateSingleStudent = () => {
    const errors = {};
    
    if (!validateName(singleStudentForm.name)) {
      errors.name = 'Please enter a valid name (at least 2 characters)';
    }
    
    if (singleStudentForm.rollNumber.trim().length < 1) {
      errors.rollNumber = 'Roll number is required';
    }
    
    if (singleStudentForm.phoneNumber && !validatePhoneNumber(singleStudentForm.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    if (singleStudentForm.parentName && !validateName(singleStudentForm.parentName)) {
      errors.parentName = 'Please enter a valid parent name';
    }
    
    if (singleStudentForm.parentPhone && !validatePhoneNumber(singleStudentForm.parentPhone)) {
      errors.parentPhone = 'Please enter a valid 10-digit parent phone number';
    }
    
    // Check for duplicate roll number in selected class
    if (selectedClass) {
      const existingStudent = students.find(
        s => s.classId === selectedClass.id && 
             s.rollNumber.toLowerCase() === singleStudentForm.rollNumber.toLowerCase()
      );
      if (existingStudent) {
        errors.rollNumber = 'A student with this roll number already exists in this class';
      }
    }
    
    setSingleStudentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSingleStudent = async () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class first');
      return;
    }
    
    if (!validateSingleStudent()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const newStudent = {
        id: generateId(),
        classId: selectedClass.id,
        className: selectedClass.className,
        teacherId: teacherData?.id,
        name: formatStudentName(singleStudentForm.name),
        rollNumber: singleStudentForm.rollNumber.trim(),
        phoneNumber: singleStudentForm.phoneNumber.trim(),
        parentName: singleStudentForm.parentName.trim(),
        parentPhone: singleStudentForm.parentPhone.trim(),
        grade: selectedClass.grade,
        subject: selectedClass.subject,
        addedAt: new Date().toISOString(),
        isActive: true,
      };
      
      await addStudent(newStudent);
      
      Alert.alert(
        'Success',
        `Student ${newStudent.name} has been added to ${selectedClass.className}`,
        [{ text: 'OK', onPress: () => {
          setSingleStudentForm({
            name: '',
            rollNumber: '',
            phoneNumber: '',
            parentName: '',
            parentPhone: '',
          });
          setSingleStudentErrors({});
          loadStudents();
        }}]
      );
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('Error', 'Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseBulkStudents = () => {
    if (!bulkStudentsText.trim()) {
      setBulkStudentsPreview([]);
      return;
    }
    
    const lines = bulkStudentsText.trim().split('\n');
    const parsed = [];
    const errors = [];
    
    lines.forEach((line, index) => {
      const parts = line.split(',').map(part => part.trim());
      
      if (parts.length < 2) {
        errors.push(`Line ${index + 1}: Missing required fields (name, roll number)`);
        return;
      }
      
      const [name, rollNumber, phoneNumber = '', parentName = '', parentPhone = ''] = parts;
      
      if (!validateName(name)) {
        errors.push(`Line ${index + 1}: Invalid name "${name}"`);
        return;
      }
      
      if (!rollNumber) {
        errors.push(`Line ${index + 1}: Roll number is required`);
        return;
      }
      
      if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
        errors.push(`Line ${index + 1}: Invalid phone number "${phoneNumber}"`);
        return;
      }
      
      parsed.push({
        name: formatStudentName(name),
        rollNumber: rollNumber.trim(),
        phoneNumber: phoneNumber.trim(),
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        lineNumber: index + 1,
      });
    });
    
    if (errors.length > 0) {
      Alert.alert('Parsing Errors', errors.join('\n'));
      return;
    }
    
    setBulkStudentsPreview(parsed);
  };

  const handleAddBulkStudents = async () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class first');
      return;
    }
    
    if (bulkStudentsPreview.length === 0) {
      Alert.alert('Error', 'No valid students to add');
      return;
    }
    
    setLoading(true);
    
    try {
      const duplicates = [];
      const validStudents = [];
      
      // Check for duplicates
      bulkStudentsPreview.forEach(student => {
        const existing = students.find(
          s => s.classId === selectedClass.id && 
               s.rollNumber.toLowerCase() === student.rollNumber.toLowerCase()
        );
        
        if (existing) {
          duplicates.push(`${student.name} (Roll: ${student.rollNumber})`);
        } else {
          validStudents.push({
            id: generateId(),
            classId: selectedClass.id,
            className: selectedClass.className,
            teacherId: teacherData?.id,
            name: student.name,
            rollNumber: student.rollNumber,
            phoneNumber: student.phoneNumber,
            parentName: student.parentName,
            parentPhone: student.parentPhone,
            grade: selectedClass.grade,
            subject: selectedClass.subject,
            addedAt: new Date().toISOString(),
            isActive: true,
          });
        }
      });
      
      if (duplicates.length > 0) {
        const message = `The following students already exist:\n${duplicates.join('\n')}\n\nDo you want to add the remaining ${validStudents.length} students?`;
        
        if (validStudents.length === 0) {
          Alert.alert('Duplicates Found', 'All students already exist in this class.');
          setLoading(false);
          return;
        }
        
        Alert.alert(
          'Duplicates Found',
          message,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
            { text: 'Add Others', onPress: () => addValidStudents(validStudents) }
          ]
        );
      } else {
        await addValidStudents(validStudents);
      }
    } catch (error) {
      console.error('Error adding bulk students:', error);
      Alert.alert('Error', 'Failed to add students. Please try again.');
      setLoading(false);
    }
  };

  const addValidStudents = async (studentsToAdd) => {
    try {
      for (const student of studentsToAdd) {
        await addStudent(student);
      }
      
      Alert.alert(
        'Success',
        `${studentsToAdd.length} students have been added to ${selectedClass.className}`,
        [{ text: 'OK', onPress: () => {
          setBulkStudentsText('');
          setBulkStudentsPreview([]);
          loadStudents();
        }}]
      );
    } catch (error) {
      console.error('Error adding valid students:', error);
      Alert.alert('Error', 'Failed to add some students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateSingleStudentForm = (field, value) => {
    setSingleStudentForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (singleStudentErrors[field]) {
      setSingleStudentErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleExcelUpload = () => {
    Alert.alert(
      'Excel Upload',
      'Excel upload feature will be available in the next update. For now, you can use the bulk text input format.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Add Students"
        subtitle={selectedClass ? selectedClass.className : 'Select a class first'}
        variant="teacher"
        showBackButton
        onLeftPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Class Selection */}
          <Card style={styles.classSelectionCard}>
            <TouchableOpacity
              onPress={() => setShowClassModal(true)}
              style={styles.classSelector}
            >
              <View style={styles.classSelectorContent}>
                <Text style={styles.classSelectorIcon}>🏫</Text>
                <View style={styles.classSelectorText}>
                  <Text style={styles.classSelectorLabel}>Selected Class</Text>
                  <Text style={styles.classSelectorValue}>
                    {selectedClass ? selectedClass.className : 'Tap to select a class'}
                  </Text>
                  {selectedClass && (
                    <Text style={styles.classSelectorSubtitle}>
                      Grade {selectedClass.grade} • {selectedClass.subject}
                    </Text>
                  )}
                </View>
                <Text style={styles.classSelectorArrow}>▼</Text>
              </View>
            </TouchableOpacity>
          </Card>

          {/* Add Mode Selection */}
          <View style={styles.modeSection}>
            <Text style={styles.sectionTitle}>How would you like to add students?</Text>
            
            <View style={styles.modeButtons}>
              <TouchableOpacity
                style={[styles.modeButton, addMode === 'single' && styles.modeButtonActive]}
                onPress={() => setAddMode('single')}
              >
                <Text style={styles.modeButtonIcon}>👤</Text>
                <Text style={[styles.modeButtonText, addMode === 'single' && styles.modeButtonTextActive]}>
                  Single Student
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modeButton, addMode === 'bulk' && styles.modeButtonActive]}
                onPress={() => setAddMode('bulk')}
              >
                <Text style={styles.modeButtonIcon}>👥</Text>
                <Text style={[styles.modeButtonText, addMode === 'bulk' && styles.modeButtonTextActive]}>
                  Bulk Add
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modeButton, addMode === 'excel' && styles.modeButtonActive]}
                onPress={() => setAddMode('excel')}
              >
                <Text style={styles.modeButtonIcon}>📊</Text>
                <Text style={[styles.modeButtonText, addMode === 'excel' && styles.modeButtonTextActive]}>
                  Excel Upload
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Single Student Form */}
          {addMode === 'single' && selectedClass && (
            <Card style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Add Single Student</Text>
                <Text style={styles.formSubtitle}>Enter student details below</Text>
              </View>
              
              <View style={styles.formContent}>
                <Input
                  label="Student Name *"
                  placeholder="Enter full name"
                  value={singleStudentForm.name}
                  onChangeText={(text) => updateSingleStudentForm('name', text)}
                  error={singleStudentErrors.name}
                  leftIcon={<Text style={styles.inputIcon}>👤</Text>}
                />
                
                <Input
                  label="Roll Number *"
                  placeholder="Enter roll number"
                  value={singleStudentForm.rollNumber}
                  onChangeText={(text) => updateSingleStudentForm('rollNumber', text)}
                  error={singleStudentErrors.rollNumber}
                  leftIcon={<Text style={styles.inputIcon}>🔢</Text>}
                />
                
                <Input
                  label="Phone Number (Optional)"
                  placeholder="Enter 10-digit number"
                  value={singleStudentForm.phoneNumber}
                  onChangeText={(text) => updateSingleStudentForm('phoneNumber', text)}
                  error={singleStudentErrors.phoneNumber}
                  keyboardType="phone-pad"
                  leftIcon={<Text style={styles.inputIcon}>📱</Text>}
                />
                
                <Input
                  label="Parent Name (Optional)"
                  placeholder="Enter parent/guardian name"
                  value={singleStudentForm.parentName}
                  onChangeText={(text) => updateSingleStudentForm('parentName', text)}
                  error={singleStudentErrors.parentName}
                  leftIcon={<Text style={styles.inputIcon}>👨‍👩‍👧</Text>}
                />
                
                <Input
                  label="Parent Phone (Optional)"
                  placeholder="Enter parent's phone number"
                  value={singleStudentForm.parentPhone}
                  onChangeText={(text) => updateSingleStudentForm('parentPhone', text)}
                  error={singleStudentErrors.parentPhone}
                  keyboardType="phone-pad"
                  leftIcon={<Text style={styles.inputIcon}>☎️</Text>}
                />
                
                <Button
                  title="Add Student"
                  onPress={handleAddSingleStudent}
                  loading={loading}
                  variant="primary"
                  fullWidth
                  style={styles.addButton}
                />
              </View>
            </Card>
          )}

          {/* Bulk Add Form */}
          {addMode === 'bulk' && selectedClass && (
            <Card style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Bulk Add Students</Text>
                <Text style={styles.formSubtitle}>
                  Enter multiple students, one per line{'\n'}
                  Format: Name, Roll Number, Phone, Parent Name, Parent Phone
                </Text>
              </View>
              
              <View style={styles.formContent}>
                <Text style={styles.bulkInstructions}>
                  💡 Example format:{'\n'}
                  John Doe, 001, 9876543210, Jane Doe, 9876543211{'\n'}
                  Alice Smith, 002, , Bob Smith, 9876543212
                </Text>
                
                <Input
                  label="Students Data"
                  placeholder="Paste your student data here..."
                  value={bulkStudentsText}
                  onChangeText={setBulkStudentsText}
                  multiline
                  numberOfLines={6}
                  style={styles.bulkTextInput}
                />
                
                <Button
                  title="Parse and Preview"
                  onPress={parseBulkStudents}
                  variant="outline"
                  fullWidth
                  style={styles.parseButton}
                />
                
                {bulkStudentsPreview.length > 0 && (
                  <View style={styles.previewSection}>
                    <Text style={styles.previewTitle}>
                      Preview ({bulkStudentsPreview.length} students)
                    </Text>
                    
                    <View style={styles.previewList}>
                      {bulkStudentsPreview.slice(0, 5).map((student, index) => (
                        <View key={index} style={styles.previewItem}>
                          <Text style={styles.previewName}>{student.name}</Text>
                          <Text style={styles.previewDetails}>
                            Roll: {student.rollNumber}
                            {student.phoneNumber && ` • ${student.phoneNumber}`}
                          </Text>
                        </View>
                      ))}
                      
                      {bulkStudentsPreview.length > 5 && (
                        <Text style={styles.previewMore}>
                          ... and {bulkStudentsPreview.length - 5} more students
                        </Text>
                      )}
                    </View>
                    
                    <Button
                      title={`Add ${bulkStudentsPreview.length} Students`}
                      onPress={handleAddBulkStudents}
                      loading={loading}
                      variant="primary"
                      fullWidth
                      style={styles.addButton}
                    />
                  </View>
                )}
              </View>
            </Card>
          )}

          {/* Excel Upload */}
          {addMode === 'excel' && (
            <Card style={styles.formCard}>
              <View style={styles.excelContent}>
                <Text style={styles.excelIcon}>📊</Text>
                <Text style={styles.excelTitle}>Excel Upload</Text>
                <Text style={styles.excelDescription}>
                  Upload an Excel file with student data. The file should have columns:
                  {'\n\n'}• Name (required)
                  {'\n'}• Roll Number (required)
                  {'\n'}• Phone Number (optional)
                  {'\n'}• Parent Name (optional)
                  {'\n'}• Parent Phone (optional)
                </Text>
                
                <Button
                  title="Choose Excel File"
                  onPress={handleExcelUpload}
                  variant="primary"
                  fullWidth
                  style={styles.excelButton}
                />
                
                <Text style={styles.excelNote}>
                  Note: Excel upload feature is coming soon. Use bulk add for now.
                </Text>
              </View>
            </Card>
          )}

          {/* Instructions */}
          {!selectedClass && (
            <Card variant="filled" style={styles.instructionsCard}>
              <View style={styles.instructionsContent}>
                <Text style={styles.instructionsIcon}>ℹ️</Text>
                <Text style={styles.instructionsTitle}>Getting Started</Text>
                <Text style={styles.instructionsText}>
                  1. First, select a class from the dropdown above{'\n'}
                  2. Choose how you want to add students{'\n'}
                  3. Fill in the student details{'\n'}
                  4. Add students to your class
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Class Selection Modal */}
      <Modal
        visible={showClassModal}
        onClose={() => setShowClassModal(false)}
        title="Select Class"
      >
        <View style={styles.modalContent}>
          {classes.length > 0 ? (
            classes.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                style={[
                  styles.classOption,
                  selectedClass?.id === cls.id && styles.classOptionSelected
                ]}
                onPress={() => {
                  setSelectedClass(cls);
                  setShowClassModal(false);
                }}
              >
                <Text style={styles.classOptionIcon}>🏫</Text>
                <View style={styles.classOptionText}>
                  <Text style={styles.classOptionTitle}>{cls.className}</Text>
                  <Text style={styles.classOptionSubtitle}>
                    Grade {cls.grade} • {cls.subject}
                  </Text>
                </View>
                {selectedClass?.id === cls.id && (
                  <Text style={styles.classOptionCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noClasses}>
              <Text style={styles.noClassesIcon}>🏫</Text>
              <Text style={styles.noClassesText}>
                No classes found. Create a class first before adding students.
              </Text>
              <Button
                title="Create Class"
                onPress={() => {
                  setShowClassModal(false);
                  navigation.navigate('CreateClass');
                }}
                variant="primary"
                size="small"
                style={styles.createClassButton}
              />
            </View>
          )}
        </View>
      </Modal>
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
  
  // Class Selection
  classSelectionCard: {
    marginBottom: SPACING.xl,
  },
  
  classSelector: {
    padding: SPACING.lg,
  },
  
  classSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  classSelectorIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  
  classSelectorText: {
    flex: 1,
  },
  
  classSelectorLabel: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  
  classSelectorValue: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  classSelectorSubtitle: {
    ...TEXT_STYLES.caption,
    color: COLORS.primary,
  },
  
  classSelectorArrow: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  
  // Mode Selection
  modeSection: {
    marginBottom: SPACING.xl,
  },
  
  sectionTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  modeButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  
  modeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  
  modeButtonIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  
  modeButtonText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  modeButtonTextActive: {
    color: COLORS.background,
  },
  
  // Form Card
  formCard: {
    marginBottom: SPACING.xl,
  },
  
  formHeader: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  formTitle: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  formSubtitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  formContent: {
    padding: SPACING.lg,
  },
  
  inputIcon: {
    fontSize: 18,
  },
  
  addButton: {
    marginTop: SPACING.lg,
  },
  
  // Bulk Add
  bulkInstructions: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
    lineHeight: 18,
  },
  
  bulkTextInput: {
    minHeight: 120,
  },
  
  parseButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  
  previewSection: {
    marginTop: SPACING.lg,
  },
  
  previewTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  
  previewList: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  
  previewItem: {
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  previewName: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  
  previewDetails: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  
  previewMore: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
  
  // Excel Upload
  excelContent: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  excelIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  
  excelTitle: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  
  excelDescription: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  
  excelButton: {
    marginBottom: SPACING.lg,
  },
  
  excelNote: {
    ...TEXT_STYLES.caption,
    color: COLORS.warning,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Instructions
  instructionsCard: {
    backgroundColor: COLORS.primary + '20',
  },
  
  instructionsContent: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  
  instructionsIcon: {
    fontSize: 32,
    marginBottom: SPACING.md,
  },
  
  instructionsTitle: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  
  instructionsText: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Modal Content
  modalContent: {
    maxHeight: 400,
  },
  
  classOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  
  classOptionSelected: {
    backgroundColor: COLORS.primary + '20',
  },
  
  classOptionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  
  classOptionText: {
    flex: 1,
  },
  
  classOptionTitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  
  classOptionSubtitle: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  
  classOptionCheck: {
    ...TEXT_STYLES.body,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  
  noClasses: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  noClassesIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  
  noClassesText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  
  createClassButton: {
    marginTop: SPACING.md,
  },
});

export default AddStudents;