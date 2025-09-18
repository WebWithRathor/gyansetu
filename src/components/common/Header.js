import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';

const Header = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  variant = 'default',
  showBackButton = false,
  backgroundColor,
  statusBarStyle = 'dark-content',
  style,
  titleStyle,
  subtitleStyle,
  ...props
}) => {
  const getHeaderStyle = () => {
    const baseStyle = [styles.header];
    
    // Variant styles
    switch (variant) {
      case 'teacher':
        baseStyle.push(styles.headerTeacher);
        break;
      case 'student':
        baseStyle.push(styles.headerStudent);
        break;
      case 'game':
        baseStyle.push(styles.headerGame);
        break;
      case 'transparent':
        baseStyle.push(styles.headerTransparent);
        break;
      default:
        baseStyle.push(styles.headerDefault);
    }
    
    if (backgroundColor) {
      baseStyle.push({ backgroundColor });
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };
  
  const getStatusBarColor = () => {
    if (backgroundColor) return backgroundColor;
    
    switch (variant) {
      case 'teacher':
        return COLORS.primary;
      case 'student':
        return COLORS.accent;
      case 'game':
        return COLORS.gamePurple;
      case 'transparent':
        return COLORS.transparent;
      default:
        return COLORS.background;
    }
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'teacher':
      case 'student':
      case 'game':
        return COLORS.background;
      case 'transparent':
        return COLORS.text;
      default:
        return COLORS.text;
    }
  };
  
  const renderLeftContent = () => {
    if (showBackButton) {
      return (
        <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
          <Text style={[styles.backIcon, { color: getTextColor() }]}>←</Text>
        </TouchableOpacity>
      );
    }
    
    if (leftIcon) {
      return (
        <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
          {leftIcon}
        </TouchableOpacity>
      );
    }
    
    return <View style={styles.placeholder} />;
  };
  
  const renderRightContent = () => {
    if (rightIcon) {
      return (
        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
          {rightIcon}
        </TouchableOpacity>
      );
    }
    
    return <View style={styles.placeholder} />;
  };
  
  const renderTitle = () => {
    const textColor = getTextColor();
    
    return (
      <View style={styles.titleContainer}>
        {title && (
          <Text 
            style={[styles.title, { color: textColor }, titleStyle]} 
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text 
            style={[styles.subtitle, { color: textColor }, subtitleStyle]} 
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>
    );
  };
  
  return (
    <>
      <StatusBar 
        backgroundColor={getStatusBarColor()} 
        barStyle={statusBarStyle}
        translucent={variant === 'transparent'}
      />
      <SafeAreaView 
        style={getHeaderStyle()} 
        edges={['top']}
        {...props}
      >
        <View style={styles.content}>
          {renderLeftContent()}
          {renderTitle()}
          {renderRightContent()}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  
  // Variant styles
  headerDefault: {
    backgroundColor: COLORS.background,
  },
  headerTeacher: {
    backgroundColor: COLORS.primary,
  },
  headerStudent: {
    backgroundColor: COLORS.accent,
  },
  headerGame: {
    backgroundColor: COLORS.gamePurple,
  },
  headerTransparent: {
    backgroundColor: COLORS.transparent,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: Platform.OS === 'ios' ? 44 : 56,
  },
  
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACING.md,
  },
  
  title: {
    ...TEXT_STYLES.heading,
    textAlign: 'center',
  },
  
  subtitle: {
    ...TEXT_STYLES.bodySmall,
    textAlign: 'center',
    marginTop: 2,
  },
  
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  placeholder: {
    width: 44,
    height: 44,
  },
});

export default Header;