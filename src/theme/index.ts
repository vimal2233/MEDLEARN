import { colors, type ColorScale, type SubjectColorKey } from './colors';
import { spacing, borderRadius, shadows, type Spacing, type BorderRadius, type Shadow } from './spacing';
import { typography, fontFamilies, fontSizes, lineHeights, fontWeights, type TypographyVariant } from './typography';

export { colors, type ColorScale, type SubjectColorKey };
export { spacing, borderRadius, shadows, type Spacing, type BorderRadius, type Shadow };
export { typography, fontFamilies, fontSizes, lineHeights, fontWeights, type TypographyVariant };

export interface Theme {
  colors: typeof colors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  typography: typeof typography;
  fontFamilies: typeof fontFamilies;
  fontSizes: typeof fontSizes;
  lineHeights: typeof lineHeights;
  fontWeights: typeof fontWeights;
}

export const lightTheme: Theme = {
  colors: {
    ...colors,
    // Override with light-specific colors
    background: colors.light.background,
    surface: colors.light.surface,
    surfaceElevated: colors.light.surfaceElevated,
    surfaceVariant: colors.light.surfaceVariant,
    border: colors.light.border,
    borderStrong: colors.light.borderStrong,
    text: colors.light.text,
    textSecondary: colors.light.textSecondary,
    textTertiary: colors.light.textTertiary,
    textInverse: colors.light.textInverse,
    placeholder: colors.light.placeholder,
    icon: colors.light.icon,
    iconSecondary: colors.light.iconSecondary,
    overlay: colors.light.overlay,
    shadow: colors.light.shadow,
    divider: colors.light.divider,
  },
  spacing,
  borderRadius,
  shadows,
  typography,
  fontFamilies,
  fontSizes,
  lineHeights,
  fontWeights,
};

export const darkTheme: Theme = {
  colors: {
    ...colors,
    // Override with dark-specific colors
    background: colors.dark.background,
    surface: colors.dark.surface,
    surfaceElevated: colors.dark.surfaceElevated,
    surfaceVariant: colors.dark.surfaceVariant,
    border: colors.dark.border,
    borderStrong: colors.dark.borderStrong,
    text: colors.dark.text,
    textSecondary: colors.dark.textSecondary,
    textTertiary: colors.dark.textTertiary,
    textInverse: colors.dark.textInverse,
    placeholder: colors.dark.placeholder,
    icon: colors.dark.icon,
    iconSecondary: colors.dark.iconSecondary,
    overlay: colors.dark.overlay,
    shadow: colors.dark.shadow,
    divider: colors.dark.divider,
  },
  spacing,
  borderRadius,
  shadows,
  typography,
  fontFamilies,
  fontSizes,
  lineHeights,
  fontWeights,
};

export type { Theme as MedLearnTheme };

// Helper to get subject color
export const getSubjectColor = (subject: SubjectColorKey): string => {
  return colors.subjects[subject] || colors.primary[500];
};

// Helper to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Default export for convenience
export default {
  light: lightTheme,
  dark: darkTheme,
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  getSubjectColor,
  withOpacity,
};