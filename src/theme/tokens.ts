export const lightColors = {
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  border: '#E2E8F0',
  overlay: 'rgba(15, 23, 42, 0.45)',
  accent: '#059669',
  accentPressed: '#047857',
  onAccent: '#FFFFFF',
  accentSoft: '#ECFDF5',
  accentBorder: '#A7F3D0',
  warning: '#D97706',
  warningSoft: '#FFFBEB',
  warningBorder: '#FDE68A',
  danger: '#DC2626',
  dangerSoft: '#FEF2F2',
  dangerBorder: '#FECACA',
  info: '#1D4ED8',
  infoSoft: '#EFF6FF',
  infoBorder: '#BFDBFE',
  reserved: '#7C3AED',
  reservedSoft: '#F5F3FF',
  shadow: 'rgba(15, 23, 42, 0.08)',
};

export const darkColors = {
  bg: '#0B1220',
  surface: '#111827',
  surfaceMuted: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  border: '#243044',
  overlay: 'rgba(2, 6, 23, 0.62)',
  accent: '#34D399',
  accentPressed: '#10B981',
  onAccent: '#06281F',
  accentSoft: '#064E3B',
  accentBorder: '#047857',
  warning: '#FBBF24',
  warningSoft: '#3B2A05',
  warningBorder: '#92400E',
  danger: '#F87171',
  dangerSoft: '#3F1212',
  dangerBorder: '#7F1D1D',
  info: '#93C5FD',
  infoSoft: '#1E3A5F',
  infoBorder: '#1D4ED8',
  reserved: '#C4B5FD',
  reservedSoft: '#2E1065',
  shadow: 'rgba(0, 0, 0, 0.35)',
};

export type Colors = typeof lightColors;

export const space = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  48: 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  full: 999,
} as const;

export const type = {
  label: 13,
  body: 15,
  title: 18,
  display: 28,
} as const;

export const fontsLatin = {
  regular: 'NotoSans_400Regular',
  medium: 'NotoSans_500Medium',
  semibold: 'NotoSans_600SemiBold',
  bold: 'NotoSans_700Bold',
};

export const fontsArabic = {
  regular: 'NotoSansArabic_400Regular',
  medium: 'NotoSansArabic_500Medium',
  semibold: 'NotoSansArabic_600SemiBold',
  bold: 'NotoSansArabic_700Bold',
};

export type FontKey = keyof typeof fontsLatin;
