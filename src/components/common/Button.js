import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/layout';
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
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...SHADOWS.small,
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
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonSuccess: {
    backgroundColor: COLORS.success,
  },
  buttonError: {
    backgroundColor: COLORS.error,
  },
  buttonWarning: {
    backgroundColor: COLORS.warning,
  },
  buttonOutline: {
    backgroundColor: COLORS.transparent,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonGhost: {
    backgroundColor: COLORS.transparent,
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
    color: COLORS.background,
  },
  buttonTextSecondary: {
    color: COLORS.background,
  },
  buttonTextSuccess: {
    color: COLORS.background,
  },
  buttonTextError: {
    color: COLORS.background,
  },
  buttonTextWarning: {
    color: COLORS.background,
  },
  buttonTextOutline: {
    color: COLORS.primary,
  },
  buttonTextGhost: {
    color: COLORS.primary,
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
});

export default Button;