import { Platform } from 'react-native';

// Typography Constants for Flat Design
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  title: 32,
  hero: 36,
};

export const FONT_WEIGHTS = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const LINE_HEIGHTS = {
  xs: 16,
  sm: 20,
  md: 22,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 36,
  title: 40,
  hero: 44,
};

// Font Family Configuration
export const FONT_FAMILY = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
  }),
};

// Text Styles for consistent usage
export const TEXT_STYLES = {
  hero: {
    fontSize: FONT_SIZES.hero,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.hero,
    fontFamily: FONT_FAMILY.bold,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.title,
    fontFamily: FONT_FAMILY.bold,
  },
  subtitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.xl,
    fontFamily: FONT_FAMILY.medium,
  },
  heading: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.lg,
    fontFamily: FONT_FAMILY.medium,
  },
  body: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.md,
    fontFamily: FONT_FAMILY.regular,
  },
  bodySmall: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.sm,
    fontFamily: FONT_FAMILY.regular,
  },
  caption: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.xs,
    fontFamily: FONT_FAMILY.regular,
  },
  button: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.md,
    fontFamily: FONT_FAMILY.medium,
  },
  buttonLarge: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.lg,
    fontFamily: FONT_FAMILY.medium,
  },
};