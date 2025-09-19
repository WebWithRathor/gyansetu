import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SPACING } from '../../../constants/layout';
import { TEXT_STYLES } from '../../../constants/typography';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TeacherInfoCard = ({ teacherData, dashboardData }) => {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.teacherCard}>
        {/* Highlight overlay for 3D effect */}
        <View style={styles.highlight} />
        
        <View style={styles.teacherContent}>
          <View style={styles.teacherInfo}>
            <Text style={styles.teacherName}>
              {teacherData?.name || 'Teacher'}
            </Text>
            
            <Text style={styles.teacherDetails}>
              {teacherData?.schoolName || 'School Name'}
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Icon name="school" size={16} color="rgba(255, 255, 255, 0.95)" style={styles.statIcon} />
                <Text style={styles.statText}>
                  {dashboardData?.totalClasses || 0} Classes
                </Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="people" size={16} color="rgba(255, 255, 255, 0.95)" style={styles.statIcon} />
                <Text style={styles.statText}>
                  {dashboardData?.totalStudents || 0} Students
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Inner shadow for depth */}
        <View style={styles.innerShadow} />
      </View>
      
      {/* Avatar image coming out of the card */}
      <View style={styles.avatarContainer}>
        <Image 
          source={require('../../../../android/app/src/main/assets/imgs/teacher.png')}
          defaultSource={{ uri: 'https://www.avatarsinpixels.com/minipix/5/175831079622519/avatar.png' }}
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
    position: 'relative',
  },
  
  teacherCard: {
    backgroundColor: '#4a5bb8',
    borderRadius: 15,
    borderWidth: 4,
    borderColor: '#000000ff',
    shadowColor: '#4a5bb8',
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

  teacherContent: {
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

  teacherInfo: {
    flex: 1,
    alignItems: 'center',
  },

  teacherName: {
    ...TEXT_STYLES.heading,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  teacherDetails: {
    ...TEXT_STYLES.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    fontWeight: '600',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  statIcon: {
    marginRight: SPACING.xs,
  },

  statText: {
    ...TEXT_STYLES.caption,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // 3D Effect styles
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    zIndex: 1,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
  },

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

export default TeacherInfoCard;