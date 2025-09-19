import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  onPress,
  variant = 'default',
  elevation = 'medium',
  style,
  headerStyle,
  bodyStyle,
  footerStyle,
  ...props
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleValue, {
        toValue: 0.97,
        useNativeDriver: true,
        tension: 300,
        friction: 50,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 50,
      }).start();
    }
  };

  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    // Elevation styles
    switch (elevation) {
      case 'none':
        baseStyle.push(styles.cardElevationNone);
        break;
      case 'low':
        baseStyle.push(styles.cardElevationLow);
        break;
      case 'medium':
        baseStyle.push(styles.cardElevationMedium);
        break;
      case 'high':
        baseStyle.push(styles.cardElevationHigh);
        break;
      default:
        baseStyle.push(styles.cardElevationMedium);
    }
    
    // Variant styles
    switch (variant) {
      case 'outlined':
        baseStyle.push(styles.cardOutlined);
        break;
      case 'filled':
        baseStyle.push(styles.cardFilled);
        break;
      case 'game':
        baseStyle.push(styles.cardGame);
        break;
      case 'teacher':
        baseStyle.push(styles.cardTeacher);
        break;
      case 'student':
        baseStyle.push(styles.cardStudent);
        break;
      default:
        baseStyle.push(styles.cardDefault);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };
  
  const renderHeader = () => {
    if (!title && !subtitle && !headerAction) {
      return null;
    }
    
    return (
      <View style={[styles.header, headerStyle]}>
        <View style={styles.headerContent}>
          {title && (
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        {headerAction && (
          <View style={styles.headerAction}>
            {headerAction}
          </View>
        )}
      </View>
    );
  };
  
  const renderBody = () => {
    if (!children) {
      return null;
    }
    
    return (
      <View style={[styles.body, bodyStyle]}>
        {children}
      </View>
    );
  };
  
  const renderFooter = () => {
    if (!footer) {
      return null;
    }
    
    return (
      <View style={[styles.footer, footerStyle]}>
        {footer}
      </View>
    );
  };
  
  const cardContent = (
    <View style={getCardStyle()} {...props}>
      {/* Highlight overlay for 3D effect */}
      <View style={styles.highlight} />
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
      {/* Inner shadow for depth */}
      <View style={styles.innerShadow} />
    </View>
  );
  
  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity 
          onPress={onPress} 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          {cardContent}
        </TouchableOpacity>
      </Animated.View>
    );
  }
  
  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#000000ff',
  },
  
  // Elevation styles
  cardElevationNone: {
    elevation: 0,
    shadowOpacity: 0,
  },
  cardElevationLow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardElevationMedium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  cardElevationHigh: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  
  // Variant styles
  cardDefault: {
    backgroundColor: COLORS.card,
  },
  cardOutlined: {
    backgroundColor: COLORS.transparent,
    borderWidth: 3,
    borderColor: '#4a5bb8',
    shadowColor: '#4a5bb8',
  },
  cardFilled: {
    backgroundColor: '#f8f9fa',
    shadowColor: '#6c757d',
  },
  cardGame: {
    backgroundColor: '#e7f3ff',
    borderLeftWidth: 6,
    borderLeftColor: '#4a5bb8',
    shadowColor: '#4a5bb8',
  },
  cardTeacher: {
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 6,
    borderLeftColor: '#28a745',
    shadowColor: '#28a745',
  },
  cardStudent: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 6,
    borderLeftColor: '#ffc107',
    shadowColor: '#ffc107',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  
  headerContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  
  headerAction: {
    flexShrink: 0,
  },
  
  title: {
    ...TEXT_STYLES.heading,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  subtitle: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.textSecondary,
  },
  
  body: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },

  // 3D Effect styles
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 1,
    borderTopLeftRadius: BORDER_RADIUS.lg - 2,
    borderTopRightRadius: BORDER_RADIUS.lg - 2,
  },

  innerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    zIndex: 1,
    borderBottomLeftRadius: BORDER_RADIUS.lg - 2,
    borderBottomRightRadius: BORDER_RADIUS.lg - 2,
  },
});

export default Card;