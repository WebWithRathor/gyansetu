import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/layout';
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
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {cardContent}
      </TouchableOpacity>
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
  },
  
  // Elevation styles
  cardElevationNone: {
    elevation: 0,
    shadowOpacity: 0,
  },
  cardElevationLow: {
    ...SHADOWS.small,
  },
  cardElevationMedium: {
    ...SHADOWS.medium,
  },
  cardElevationHigh: {
    ...SHADOWS.large,
  },
  
  // Variant styles
  cardDefault: {
    backgroundColor: COLORS.card,
  },
  cardOutlined: {
    backgroundColor: COLORS.transparent,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  cardFilled: {
    backgroundColor: COLORS.surface,
  },
  cardGame: {
    backgroundColor: COLORS.card,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gamePurple,
  },
  cardTeacher: {
    backgroundColor: COLORS.card,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardStudent: {
    backgroundColor: COLORS.card,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
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
});

export default Card;