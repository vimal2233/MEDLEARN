import { TextStyle } from 'react-native';

export const fontFamilies = {
  heading: 'SpaceGrotesk_600SemiBold',
  headingBold: 'SpaceGrotesk_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  mono: 'SpaceMono_400Regular',
} as const;

export const fontSizes = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.6,
  loose: 2,
} as const;

export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const typography = {
  // Display styles
  displayLarge: {
    fontFamily: fontFamilies.headingBold,
    fontSize: fontSizes['5xl'],
    lineHeight: fontSizes['5xl'] * lineHeights.tight,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.5,
  } as TextStyle,
  displayMedium: {
    fontFamily: fontFamilies.headingBold,
    fontSize: fontSizes['4xl'],
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.25,
  } as TextStyle,
  displaySmall: {
    fontFamily: fontFamilies.headingBold,
    fontSize: fontSizes['3xl'],
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
    fontWeight: fontWeights.bold,
  } as TextStyle,

  // Heading styles
  headlineLarge: {
    fontFamily: fontFamilies.headingBold,
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * lineHeights.normal,
    fontWeight: fontWeights.bold,
  } as TextStyle,
  headlineMedium: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.normal,
    fontWeight: fontWeights.semibold,
  } as TextStyle,
  headlineSmall: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
    fontWeight: fontWeights.semibold,
  } as TextStyle,

  // Title styles
  titleLarge: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
    fontWeight: fontWeights.semibold,
  } as TextStyle,
  titleMedium: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    fontWeight: fontWeights.semibold,
  } as TextStyle,
  titleSmall: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    fontWeight: fontWeights.medium,
  } as TextStyle,

  // Body styles
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.relaxed,
    fontWeight: fontWeights.normal,
  } as TextStyle,
  bodyMedium: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.relaxed,
    fontWeight: fontWeights.normal,
  } as TextStyle,
  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.relaxed,
    fontWeight: fontWeights.normal,
  } as TextStyle,

  // Label styles
  labelLarge: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    fontWeight: fontWeights.medium,
  } as TextStyle,
  labelMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    fontWeight: fontWeights.medium,
  } as TextStyle,
  labelSmall: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    fontWeight: fontWeights.medium,
  } as TextStyle,

  // Special styles
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } as TextStyle,
  button: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
    fontWeight: fontWeights.semibold,
  } as TextStyle,
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    fontWeight: fontWeights.normal,
  } as TextStyle,
  overline: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    fontWeight: fontWeights.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;
export type FontFamily = keyof typeof fontFamilies;
export type FontSize = keyof typeof fontSizes;
export type LineHeight = keyof typeof lineHeights;