import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  helperText,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  size = 'medium',
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };
  
  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };
  
  const getInputContainerStyle = () => {
    const baseStyle = [styles.inputContainer];
    
    // Size variations
    if (size === 'small') {
      baseStyle.push(styles.inputContainerSmall);
    } else if (size === 'large') {
      baseStyle.push(styles.inputContainerLarge);
    } else {
      baseStyle.push(styles.inputContainerMedium);
    }
    
    // Variant styles
    switch (variant) {
      case 'outlined':
        baseStyle.push(styles.inputContainerOutlined);
        break;
      case 'filled':
        baseStyle.push(styles.inputContainerFilled);
        break;
      default:
        baseStyle.push(styles.inputContainerDefault);
    }
    
    // State styles
    if (isFocused) {
      baseStyle.push(styles.inputContainerFocused);
    }
    
    if (error) {
      baseStyle.push(styles.inputContainerError);
    }
    
    if (disabled) {
      baseStyle.push(styles.inputContainerDisabled);
    }
    
    return baseStyle;
  };
  
  const getInputStyle = () => {
    const baseStyle = [styles.input];
    
    // Size text styles
    if (size === 'small') {
      baseStyle.push(styles.inputTextSmall);
    } else if (size === 'large') {
      baseStyle.push(styles.inputTextLarge);
    } else {
      baseStyle.push(styles.inputTextMedium);
    }
    
    if (multiline) {
      baseStyle.push(styles.inputMultiline);
    }
    
    if (disabled) {
      baseStyle.push(styles.inputDisabled);
    }
    
    if (inputStyle) {
      baseStyle.push(inputStyle);
    }
    
    return baseStyle;
  };
  
  const getLabelStyle = () => {
    const baseStyle = [styles.label];
    
    if (isFocused) {
      baseStyle.push(styles.labelFocused);
    }
    
    if (error) {
      baseStyle.push(styles.labelError);
    }
    
    if (disabled) {
      baseStyle.push(styles.labelDisabled);
    }
    
    if (labelStyle) {
      baseStyle.push(labelStyle);
    }
    
    return baseStyle;
  };
  
  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity onPress={toggleSecureEntry} style={styles.iconButton}>
          <Text style={styles.iconText}>{isSecure ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      );
    }
    
    if (rightIcon) {
      return (
        <TouchableOpacity onPress={onRightIconPress} style={styles.iconButton}>
          {rightIcon}
        </TouchableOpacity>
      );
    }
    
    return null;
  };
  
  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={getLabelStyle()}>{label}</Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          {...props}
        />
        
        {renderRightIcon()}
      </View>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
      
      {helperText && !error && (
        <Text style={[styles.helperText, helperStyle]}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  
  label: {
    ...TEXT_STYLES.bodySmall,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  labelFocused: {
    color: COLORS.primary,
  },
  labelError: {
    color: COLORS.error,
  },
  labelDisabled: {
    color: COLORS.textLight,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  
  // Size variations
  inputContainerSmall: {
    minHeight: 40,
    paddingHorizontal: SPACING.sm,
  },
  inputContainerMedium: {
    minHeight: 48,
    paddingHorizontal: SPACING.md,
  },
  inputContainerLarge: {
    minHeight: 56,
    paddingHorizontal: SPACING.lg,
  },
  
  // Variant styles
  inputContainerDefault: {
    backgroundColor: COLORS.background,
  },
  inputContainerOutlined: {
    backgroundColor: COLORS.transparent,
    borderWidth: 2,
  },
  inputContainerFilled: {
    backgroundColor: COLORS.surface,
    borderWidth: 0,
  },
  
  // State styles
  inputContainerFocused: {
    borderColor: COLORS.primary,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.borderLight,
  },
  
  input: {
    flex: 1,
    ...TEXT_STYLES.body,
    color: COLORS.text,
    paddingVertical: 0, // Remove default padding
  },
  
  // Input text sizes
  inputTextSmall: {
    fontSize: TEXT_STYLES.bodySmall.fontSize,
  },
  inputTextMedium: {
    fontSize: TEXT_STYLES.body.fontSize,
  },
  inputTextLarge: {
    fontSize: TEXT_STYLES.heading.fontSize,
  },
  
  inputMultiline: {
    textAlignVertical: 'top',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  inputDisabled: {
    color: COLORS.textLight,
  },
  
  leftIconContainer: {
    marginRight: SPACING.sm,
  },
  
  iconButton: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
  iconText: {
    fontSize: 16,
  },
  
  errorText: {
    ...TEXT_STYLES.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  
  helperText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});

export default Input;