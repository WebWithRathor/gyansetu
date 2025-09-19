import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';

const StudentInfoCard = ({ studentData, totalScore }) => {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.studentCard}>
        {/* Highlight overlay for 3D effect */}
        <View style={styles.highlight} />
        
        <View style={styles.studentContent}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>
              {studentData?.name || 'Student'}
            </Text>
            
            <Text style={styles.studentDetails}>
              Grade {studentData?.grade} • {studentData?.className}
            </Text>
            
            {totalScore !== undefined && (
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreIcon}>⭐</Text>
                <Text style={styles.scoreText}>
                  Score: {totalScore}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Inner shadow for depth */}
        <View style={styles.innerShadow} />
      </View>
      
      {/* Avatar image coming out of the card */}
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: 'https://www.avatarsinpixels.com/minipix/5/1758275385167155/avatar.png' }}
          style={styles.avatarImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    // borderBottomWidth: 7,
    // borderBottomColor: '#b1b1b186',
    // borderRadius: 20,
    position: 'relative',
  },
  
  studentCard: {
    backgroundColor: '#3e5d45ff',
    borderRadius: 15,
    borderWidth: 4,
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
    marginLeft: 60, // Make more space for the bigger avatar
  },

  studentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    paddingLeft: SPACING.xl, // Extra padding for avatar space
    position: 'relative',
    zIndex: 2,
  },

  avatarContainer: {
    position: 'absolute',
    left: 5,
    top: '50%',
    transform: [{ translateY: "-50%" }],
    zIndex: 3,
    overflow: 'hidden',
  },

  avatarImage: {
    width: 100,
    height: 170,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#000000ff',
    backgroundColor: '#fff',
  
  },

  studentInfo: {
    flex: 1,
    alignItems: 'center',
  },

  studentName: {
    ...TEXT_STYLES.heading,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  studentDetails: {
    ...TEXT_STYLES.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    fontWeight: '600',
  },

  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  scoreIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },

  scoreText: {
    ...TEXT_STYLES.bodySmall,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // 3D Effect styles

  // Inner shadow for depth
  innerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
});

export default StudentInfoCard;