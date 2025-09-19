import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StarIcon = ({ starSize, starColor, shadowColor }) => (
  <View style={[styles.starContainer, { width: starSize, height: starSize }]}>
    <Icon 
      name="star" 
      size={starSize} 
      color={starColor}
      style={styles.star}
    />
    {/* Star glow effect */}
    <View style={[styles.starGlow, { 
      width: starSize + 10, 
      height: starSize + 10,
      backgroundColor: starColor + '20'
    }]} />
  </View>
);

const VIPText = ({ isVIP, text, textSize, starColor, shadowColor }) => (
  isVIP ? (
    <Text style={[styles.vipText, { 
      fontSize: textSize,
      color: starColor,
      textShadowColor: shadowColor
    }]}>
      VIP
    </Text>
  ) : text ? (
    <Text style={[styles.badgeText, { 
      fontSize: textSize,
      color: starColor
    }]}>
      {text}
    </Text>
  ) : null
);

const Badge3D = ({ 
  variant = 'green', 
  size = 'large', 
  text = '', 
  isVIP = false,
  style 
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'green':
        return {
          outerGradient: ['#7ED321', '#56A80F'],
          middleGradient: ['#FFD700', '#FFA500'],
          innerGradient: ['#9AFF9A', '#32CD32'],
          shadowColor: '#56A80F',
          starColor: '#FFFFFF',
        };
      case 'blue':
        return {
          outerGradient: ['#4A90E2', '#2E5984'],
          middleGradient: ['#FFD700', '#FFA500'],
          innerGradient: ['#87CEEB', '#4169E1'],
          shadowColor: '#2E5984',
          starColor: '#FFFFFF',
        };
      case 'purple':
        return {
          outerGradient: ['#9013FE', '#6A1B9A'],
          middleGradient: ['#FFD700', '#FFA500'],
          innerGradient: ['#DA70D6', '#8A2BE2'],
          shadowColor: '#6A1B9A',
          starColor: '#FFFFFF',
        };
      case 'red':
        return {
          outerGradient: ['#FF4444', '#CC0000'],
          middleGradient: ['#FFD700', '#FFA500'],
          innerGradient: ['#FF69B4', '#DC143C'],
          shadowColor: '#CC0000',
          starColor: '#FFFFFF',
        };
      case 'vip':
        return {
          outerGradient: ['#00CED1', '#20B2AA'],
          middleGradient: ['#FFD700', '#FFA500'],
          innerGradient: ['#E0E0E0', '#C0C0C0'],
          shadowColor: '#20B2AA',
          starColor: '#FF1493',
        };
      default:
        return {
          outerGradient: ['#7ED321', '#56A80F'],
          middleGradient: ['#FFD700', '#FFA500'],
          innerGradient: ['#9AFF9A', '#32CD32'],
          shadowColor: '#56A80F',
          starColor: '#FFFFFF',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { width: 80, height: 80 },
          outer: { width: 80, height: 80, borderRadius: 20 },
          middle: { width: 60, height: 60, borderRadius: 15 },
          inner: { width: 40, height: 40, borderRadius: 10 },
          starSize: 24,
          textSize: 10,
        };
      case 'medium':
        return {
          container: { width: 100, height: 100 },
          outer: { width: 100, height: 100, borderRadius: 25 },
          middle: { width: 75, height: 75, borderRadius: 18 },
          inner: { width: 50, height: 50, borderRadius: 12 },
          starSize: 30,
          textSize: 12,
        };
      case 'large':
      default:
        return {
          container: { width: 120, height: 120 },
          outer: { width: 120, height: 120, borderRadius: 30 },
          middle: { width: 90, height: 90, borderRadius: 22 },
          inner: { width: 60, height: 60, borderRadius: 15 },
          starSize: 36,
          textSize: 14,
        };
    }
  };

  const colors = getVariantColors();
  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.container, sizeStyles.container, style]}>
      {/* Outer shadow */}
      <View style={[styles.shadow, sizeStyles.outer, { 
        backgroundColor: colors.shadowColor + '40' 
      }]} />
      
      {/* Outer ring */}
      <LinearGradient
        colors={colors.outerGradient}
        style={[styles.outerRing, sizeStyles.outer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Middle ring with golden gradient */}
        <LinearGradient
          colors={colors.middleGradient}
          style={[styles.middleRing, sizeStyles.middle]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Inner star container */}
          <LinearGradient
            colors={colors.innerGradient}
            style={[styles.innerRing, sizeStyles.inner]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <StarIcon 
              starSize={sizeStyles.starSize}
              starColor={colors.starColor}
              shadowColor={colors.shadowColor}
            />
            <VIPText 
              isVIP={isVIP}
              text={text}
              textSize={sizeStyles.textSize}
              starColor={colors.starColor}
              shadowColor={colors.shadowColor}
            />
          </LinearGradient>
        </LinearGradient>
      </LinearGradient>
      
      {/* 3D highlight effect */}
      <View style={[styles.highlight, sizeStyles.outer]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  shadow: {
    position: 'absolute',
    top: 4,
    left: 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  
  outerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  
  middleRing: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  
  innerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  
  starContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  star: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    elevation: 5,
  },
  
  starGlow: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.3,
  },
  
  highlight: {
    position: 'absolute',
    top: 2,
    left: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '30%',
    width: '80%',
  },
  
  vipText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  
  badgeText: {
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default Badge3D;
