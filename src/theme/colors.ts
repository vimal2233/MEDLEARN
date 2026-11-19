export const colors = {
  // Primary palette - Deep navy/blue
  primary: {
    50: '#E6F0FA',
    100: '#CCE0F5',
    200: '#99C2EB',
    300: '#66A3E1',
    400: '#3385D7',
    500: '#1A6BB8', // Main primary
    600: '#155693',
    700: '#10416E',
    800: '#0B2B49',
    900: '#051625',
    950: '#030B13',
  },

  // Secondary palette - Teal/turquoise
  secondary: {
    50: '#E6FAF9',
    100: '#CCF5F1',
    200: '#99EBE2',
    300: '#66E1D3',
    400: '#33D7C4',
    500: '#14C9B0', // Main secondary
    600: '#10A18D',
    700: '#0D796A',
    800: '#095046',
    900: '#052823',
    950: '#021412',
  },

  // Accent - Warm coral/orange
  accent: {
    50: '#FFF5F0',
    100: '#FFE8DA',
    200: '#FFD1B5',
    300: '#FFBA90',
    400: '#FFA36B',
    500: '#FF8C46', // Main accent
    600: '#E67538',
    700: '#CC5E2A',
    800: '#B3471C',
    900: '#99300E',
    950: '#4D1807',
  },

  // Mint - Soft green
  mint: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Semantic colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Neutral palette
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Light theme surface colors
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
    text: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    placeholder: '#94A3B8',
    icon: '#475569',
    iconSecondary: '#94A3B8',
    overlay: 'rgba(15, 23, 42, 0.5)',
    shadow: 'rgba(15, 23, 42, 0.1)',
    divider: '#E2E8F0',
  },

  // Dark theme surface colors
  dark: {
    background: '#0A1628',
    surface: '#111D32',
    surfaceElevated: '#1A2A4A',
    surfaceVariant: '#1E2D4D',
    border: '#2D3D5E',
    borderStrong: '#3D4D6E',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textInverse: '#0F172A',
    placeholder: '#64748B',
    icon: '#94A3B8',
    iconSecondary: '#64748B',
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    divider: '#2D3D5E',
  },

  // Subject-specific colors for visual variety
  subjects: {
    anatomy: '#E11D48', // Rose
    physiology: '#0891B2', // Cyan
    biochemistry: '#7C3AED', // Violet
    pathology: '#DC2626', // Red
    pharmacology: '#EA580C', // Orange
    microbiology: '#16A34A', // Green
    forensic: '#4338CA', // Indigo
    community: '#059669', // Emerald
    ent: '#D97706', // Amber
    ophthalmology: '#0284C7', // Sky
    medicine: '#BE185D', // Pink
    surgery: '#C2410C', // Orange-red
    obstetrics: '#DB2777', // Pink-red
    pediatrics: '#F97316', // Orange
    orthopedics: '#65A30D', // Lime
    psychiatry: '#A855F7', // Purple
    dermatology: '#EC4899', // Pink
  },
} as const;

export type ColorScale = keyof typeof colors.primary;
export type SubjectColorKey = keyof typeof colors.subjects;