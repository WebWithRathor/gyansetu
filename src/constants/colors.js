// Flat Design Color Palette for Gyansetu
export const COLORS = {
  // Primary Colors - Bright and Solid
  primary: '#3498DB',        // Bright Blue
  secondary: '#E74C3C',      // Bright Red
  accent: '#F39C12',         // Bright Orange
  
  // Success and Error
  success: '#2ECC71',        // Bright Green
  error: '#E74C3C',          // Bright Red
  warning: '#F39C12',        // Bright Orange
  
  // Background Colors
  background: '#FFFFFF',     // Pure White
  surface: '#F8F9FA',        // Light Gray
  card: '#FFFFFF',           // Pure White
  
  // Text Colors
  text: '#2C3E50',           // Dark Blue-Gray
  textSecondary: '#7F8C8D',  // Medium Gray
  textLight: '#BDC3C7',      // Light Gray
  
  // Game Colors
  gameBlue: '#3498DB',       // Question cards
  gameRed: '#E74C3C',        // Answer cards
  gameGreen: '#2ECC71',      // Correct matches
  gameYellow: '#F1C40F',     // Score/points
  gamePurple: '#9B59B6',     // Special elements
  
  // Grid Game Colors
  gridBackground: '#ECF0F1', // Light grid background
  blockColors: [
    '#E74C3C',  // Red blocks
    '#3498DB',  // Blue blocks
    '#2ECC71',  // Green blocks
    '#F39C12',  // Orange blocks
    '#9B59B6',  // Purple blocks
  ],
  
  // Utility Colors
  transparent: 'transparent',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Status Colors
  online: '#2ECC71',
  offline: '#95A5A6',
  
  // Border Colors
  border: '#E1E8ED',
  borderLight: '#F1F3F4',
  
  // Gradient Colors (minimal use in flat design)
  gradientStart: '#3498DB',
  gradientEnd: '#2980B9',
};

// Color combinations for different themes
export const THEMES = {
  teacher: {
    primary: COLORS.primary,
    secondary: COLORS.gameBlue,
    background: COLORS.background,
  },
  student: {
    primary: COLORS.accent,
    secondary: COLORS.gameGreen,
    background: COLORS.background,
  },
  game: {
    primary: COLORS.gamePurple,
    secondary: COLORS.gameYellow,
    background: COLORS.surface,
  },
};