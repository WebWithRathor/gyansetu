import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Screen Dimensions
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Spacing Constants (following 8pt grid system)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Border Radius for Flat Design
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 50,
};

// Elevation/Shadow for Cards
export const ELEVATION = {
  none: 0,
  low: 2,
  medium: 4,
  high: 8,
};

// Shadow Styles
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Icon Sizes
export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
};

// Common Layout Constants
export const LAYOUT = {
  headerHeight: Platform.OS === 'ios' ? 88 : 64,
  tabBarHeight: Platform.OS === 'ios' ? 83 : 64,
  statusBarHeight: Platform.OS === 'ios' ? 44 : 24,
  bottomSafeArea: Platform.OS === 'ios' ? 34 : 0,
};

// Game Specific Constants
export const GAME_CONSTANTS = {
  // Matching Game
  cardWidth: (SCREEN_WIDTH - SPACING.xl * 2 - SPACING.md * 3) / 4,
  cardHeight: 80,
  cardGridColumns: 4,
  
  // Block Blast Game
  gridSize: 8,
  gridCellSize: (SCREEN_WIDTH - SPACING.xl * 2) / 8,
  blockSize: 40,
  
  // Animation Durations
  animationDuration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  // Score System
  scorePerCorrectAnswer: 10,
  scorePerWrongAnswer: -5,
  bonusMultiplier: 2,
};

// Breakpoints for Responsive Design
export const BREAKPOINTS = {
  small: 320,
  medium: 375,
  large: 414,
  tablet: 768,
};

// Z-Index Constants
export const Z_INDEX = {
  background: 0,
  content: 1,
  overlay: 10,
  modal: 100,
  tooltip: 1000,
};