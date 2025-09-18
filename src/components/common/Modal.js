import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Dimensions 
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, SHADOWS, Z_INDEX } from '../../constants/layout';
import { TEXT_STYLES } from '../../constants/typography';
import Button from './Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ModalComponent = ({
  visible = false,
  onClose,
  title,
  subtitle,
  children,
  primaryButton,
  secondaryButton,
  variant = 'default',
  size = 'medium',
  animationType = 'fade',
  dismissOnBackdrop = true,
  showCloseButton = true,
  style,
  contentStyle,
  headerStyle,
  footerStyle,
  ...props
}) => {
  const getModalStyle = () => {
    const baseStyle = [styles.modal];
    
    // Size variations
    switch (size) {
      case 'small':
        baseStyle.push(styles.modalSmall);
        break;
      case 'large':
        baseStyle.push(styles.modalLarge);
        break;
      case 'fullscreen':
        baseStyle.push(styles.modalFullscreen);
        break;
      default:
        baseStyle.push(styles.modalMedium);
    }
    
    // Variant styles
    switch (variant) {
      case 'success':
        baseStyle.push(styles.modalSuccess);
        break;
      case 'error':
        baseStyle.push(styles.modalError);
        break;
      case 'warning':
        baseStyle.push(styles.modalWarning);
        break;
      case 'game':
        baseStyle.push(styles.modalGame);
        break;
      default:
        baseStyle.push(styles.modalDefault);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };
  
  const handleBackdropPress = () => {
    if (dismissOnBackdrop && onClose) {
      onClose();
    }
  };
  
  const renderHeader = () => {
    if (!title && !subtitle && !showCloseButton) {
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
            <Text style={styles.subtitle} numberOfLines={3}>
              {subtitle}
            </Text>
          )}
        </View>
        
        {showCloseButton && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  const renderContent = () => {
    if (!children) {
      return null;
    }
    
    return (
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    );
  };
  
  const renderFooter = () => {
    if (!primaryButton && !secondaryButton) {
      return null;
    }
    
    return (
      <View style={[styles.footer, footerStyle]}>
        {secondaryButton && (
          <Button
            {...secondaryButton}
            variant={secondaryButton.variant || 'outline'}
            style={[styles.footerButton, secondaryButton.style]}
          />
        )}
        
        {primaryButton && (
          <Button
            {...primaryButton}
            variant={primaryButton.variant || 'primary'}
            style={[styles.footerButton, primaryButton.style]}
          />
        )}
      </View>
    );
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      {...props}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={getModalStyle()}>
              {renderHeader()}
              {renderContent()}
              {renderFooter()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  
  modal: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.large,
    maxHeight: SCREEN_HEIGHT * 0.9,
    width: '100%',
    elevation: Z_INDEX.modal,
  },
  
  // Size variations
  modalSmall: {
    maxWidth: 280,
  },
  modalMedium: {
    maxWidth: 400,
  },
  modalLarge: {
    maxWidth: SCREEN_WIDTH - SPACING.xl * 2,
  },
  modalFullscreen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderRadius: 0,
    margin: 0,
  },
  
  // Variant styles
  modalDefault: {
    backgroundColor: COLORS.background,
  },
  modalSuccess: {
    backgroundColor: COLORS.background,
    borderTopWidth: 4,
    borderTopColor: COLORS.success,
  },
  modalError: {
    backgroundColor: COLORS.background,
    borderTopWidth: 4,
    borderTopColor: COLORS.error,
  },
  modalWarning: {
    backgroundColor: COLORS.background,
    borderTopWidth: 4,
    borderTopColor: COLORS.warning,
  },
  modalGame: {
    backgroundColor: COLORS.background,
    borderTopWidth: 4,
    borderTopColor: COLORS.gamePurple,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  
  headerContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  
  title: {
    ...TEXT_STYLES.subtitle,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  
  subtitle: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  closeIcon: {
    fontSize: 24,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  
  content: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: SPACING.md,
  },
  
  footerButton: {
    minWidth: 100,
  },
});

export default ModalComponent;