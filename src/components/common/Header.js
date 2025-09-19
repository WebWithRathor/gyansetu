import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform, Animated } from 'react-native';
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
  const leftButtonScale = React.useRef(new Animated.Value(1)).current;
  const rightButtonScale = React.useRef(new Animated.Value(1)).current;

  const handleButtonPressIn = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 50,
    }).start();
  };

  const handleButtonPressOut = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 50,
    }).start();
  };
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
        return '#4a5bb8';
      case 'student':
        return '#28a745';
      case 'game':
        return '#8e44ad';
      case 'transparent':
        return COLORS.transparent;
      default:
        return '#ffd29d';
    }
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'teacher':
      case 'student':
      case 'game':
        return '#ffffff';
      case 'transparent':
        return COLORS.text;
      default:
        return '#333333'; // Dark text for light background
    }
  };
  
  const renderLeftContent = () => {
    if (showBackButton) {
      return (
        <Animated.View style={{ transform: [{ scale: leftButtonScale }] }}>
          <TouchableOpacity 
            onPress={onLeftPress} 
            style={styles.iconButton}
            onPressIn={() => handleButtonPressIn(leftButtonScale)}
            onPressOut={() => handleButtonPressOut(leftButtonScale)}
            activeOpacity={0.9}
          >
            {/* Highlight overlay for 3D effect */}
            <View style={styles.buttonHighlight} />
            <Text style={[styles.backIcon, { color: getTextColor() }]}>←</Text>
            {/* Inner shadow for depth */}
            <View style={styles.buttonInnerShadow} />
          </TouchableOpacity>
        </Animated.View>
      );
    }
    
    if (leftIcon) {
      return (
        <Animated.View style={{ transform: [{ scale: leftButtonScale }] }}>
          <TouchableOpacity 
            onPress={onLeftPress} 
            style={styles.iconButton}
            onPressIn={() => handleButtonPressIn(leftButtonScale)}
            onPressOut={() => handleButtonPressOut(leftButtonScale)}
            activeOpacity={0.9}
          >
            {/* Highlight overlay for 3D effect */}
            <View style={styles.buttonHighlight} />
            {leftIcon}
            {/* Inner shadow for depth */}
            <View style={styles.buttonInnerShadow} />
          </TouchableOpacity>
        </Animated.View>
      );
    }
    
    return <View style={styles.placeholder} />;
  };
  
  const renderRightContent = () => {
    if (rightIcon) {
      return (
        <Animated.View style={{ transform: [{ scale: rightButtonScale }] }}>
          <TouchableOpacity 
            onPress={onRightPress} 
            style={styles.iconButton}
            onPressIn={() => handleButtonPressIn(rightButtonScale)}
            onPressOut={() => handleButtonPressOut(rightButtonScale)}
            activeOpacity={0.9}
          >
            {/* Highlight overlay for 3D effect */}
            <View style={styles.buttonHighlight} />
            {rightIcon}
            {/* Inner shadow for depth */}
            <View style={styles.buttonInnerShadow} />
          </TouchableOpacity>
        </Animated.View>
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
        translucent={false}
      />
      <View 
        style={getHeaderStyle()} 
        {...props}
      >
        {/* Header highlight overlay for 3D effect */}
        {variant !== 'transparent' && <View style={styles.headerHighlight} />}
        
        <View style={styles.content}>
          {renderLeftContent()}
          {renderTitle()}
          {renderRightContent()}
        </View>
        
        {/* Header inner shadow for depth */}
        {variant !== 'transparent' && <View style={styles.headerInnerShadow} />}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24, // Account for status bar
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 3,
    borderBottomColor: '#000000ff',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
  },
  
  // Variant styles
  headerDefault: {
    backgroundColor: '#ffd29d',
    shadowColor: '#ffd29d',
  },
  headerTeacher: {
    backgroundColor: '#4a5bb8',
    shadowColor: '#4a5bb8',
  },
  headerStudent: {
    backgroundColor: '#28a745',
    shadowColor: '#28a745',
  },
  headerGame: {
    backgroundColor: '#8e44ad',
    shadowColor: '#8e44ad',
  },
  headerTransparent: {
    backgroundColor: COLORS.transparent,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: Platform.OS === 'ios' ? 44 : 46,
    position: 'relative',
    zIndex: 2,
  },
  
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACING.md,
  },
  
  title: {
    ...TEXT_STYLES.heading,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  subtitle: {
    ...TEXT_STYLES.bodySmall,
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    shadowColor: '#000000',
  },
  
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    zIndex: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  placeholder: {
    width: 44,
    height: 44,
  },

  // 3D Effect styles for header
  headerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    zIndex: 1,
  },

  headerInnerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },

  // 3D Effect styles for buttons
  buttonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  buttonInnerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default Header;