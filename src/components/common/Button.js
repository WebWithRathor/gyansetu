import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, Animated } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 50,
    }).start();
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    // Size variations
    if (size === 'small') {
      baseStyle.push(styles.buttonSmall);
    } else if (size === 'large') {
      baseStyle.push(styles.buttonLarge);
    } else {
      baseStyle.push(styles.buttonMedium);
    }
    
    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.buttonPrimary);
        break;
      case 'secondary':
        baseStyle.push(styles.buttonSecondary);
        break;
      case 'success':
        baseStyle.push(styles.buttonSuccess);
        break;
      case 'error':
        baseStyle.push(styles.buttonError);
        break;
      case 'warning':
        baseStyle.push(styles.buttonWarning);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutline);
        break;
      case 'ghost':
        baseStyle.push(styles.buttonGhost);
        break;
      default:
        baseStyle.push(styles.buttonPrimary);
    }
    
    // State styles
    if (disabled) {
      baseStyle.push(styles.buttonDisabled);
    }
    
    if (fullWidth) {
      baseStyle.push(styles.buttonFullWidth);
    }
    
    // Custom style
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    // Size text styles
    if (size === 'small') {
      baseStyle.push(styles.buttonTextSmall);
    } else if (size === 'large') {
      baseStyle.push(styles.buttonTextLarge);
    } else {
      baseStyle.push(styles.buttonTextMedium);
    }
    
    // Variant text styles
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.buttonTextPrimary);
        break;
      case 'secondary':
        baseStyle.push(styles.buttonTextSecondary);
        break;
      case 'success':
        baseStyle.push(styles.buttonTextSuccess);
        break;
      case 'error':
        baseStyle.push(styles.buttonTextError);
        break;
      case 'warning':
        baseStyle.push(styles.buttonTextWarning);
        break;
      case 'outline':
        baseStyle.push(styles.buttonTextOutline);
        break;
      case 'ghost':
        baseStyle.push(styles.buttonTextGhost);
        break;
      default:
        baseStyle.push(styles.buttonTextPrimary);
    }
    
    if (disabled) {
      baseStyle.push(styles.buttonTextDisabled);
    }
    
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.background} 
            size="small" 
          />
          {title && <Text style={[getTextStyle(), styles.loadingText]}>{title}</Text>}
        </View>
      );
    }
    
    if (icon && iconPosition === 'left') {
      return (
        <View style={styles.contentContainer}>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      );
    }
    
    if (icon && iconPosition === 'right') {
      return (
        <View style={styles.contentContainer}>
          <Text style={getTextStyle()}>{title}</Text>
          {icon}
        </View>
      );
    }
    
    return <Text style={getTextStyle()}>{title}</Text>;
  };
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        {...props}
      >
        {/* Inner highlight overlay for 3D effect */}
        <View style={styles.highlight} />
        {renderContent()}
        {/* Inner shadow for depth */}
        <View style={styles.innerShadow} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#000000ff',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  
  // Size styles
  buttonSmall: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 36,
  },
  buttonMedium: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 48,
  },
  buttonLarge: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    minHeight: 56,
  },
  
  // Variant styles
  buttonPrimary: {
    backgroundColor: '#4a5bb8',
    shadowColor: '#4a5bb8',
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
    shadowColor: '#6c757d',
  },
  buttonSuccess: {
    backgroundColor: '#28a745',
    shadowColor: '#28a745',
  },
  buttonError: {
    backgroundColor: '#dc3545',
    shadowColor: '#dc3545',
  },
  buttonWarning: {
    backgroundColor: '#ffc107',
    shadowColor: '#ffc107',
  },
  buttonOutline: {
    backgroundColor: COLORS.transparent,
    borderWidth: 3,
    borderColor: '#4a5bb8',
    shadowColor: '#4a5bb8',
  },
  buttonGhost: {
    backgroundColor: COLORS.transparent,
    borderWidth: 0,
    shadowColor: '#ffffffff',
  },
  
  // State styles
  buttonDisabled: {
    backgroundColor: COLORS.textLight,
    opacity: 0.6,
  },
  buttonFullWidth: {
    width: '100%',
  },
  
  // Text styles
  buttonText: {
    textAlign: 'center',
    fontWeight: TEXT_STYLES.button.fontWeight,
  },
  buttonTextSmall: {
    fontSize: TEXT_STYLES.bodySmall.fontSize,
  },
  buttonTextMedium: {
    fontSize: TEXT_STYLES.button.fontSize,
  },
  buttonTextLarge: {
    fontSize: TEXT_STYLES.buttonLarge.fontSize,
  },
  
  // Variant text styles
  buttonTextPrimary: {
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonTextSecondary: {
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonTextSuccess: {
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonTextError: {
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonTextWarning: {
    color: '#000000',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonTextOutline: {
    color: '#4a5bb8',
    fontWeight: 'bold',
  },
  buttonTextGhost: {
    color: '#4a5bb8',
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: COLORS.textSecondary,
  },
  
  // Content layout
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  loadingText: {
    marginLeft: SPACING.sm,
  },

  // 3D Effect styles
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
    borderTopLeftRadius: BORDER_RADIUS.md - 2,
    borderTopRightRadius: BORDER_RADIUS.md - 2,
  },

  innerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
    borderBottomLeftRadius: BORDER_RADIUS.md - 2,
    borderBottomRightRadius: BORDER_RADIUS.md - 2,
  },
});

export default Button;