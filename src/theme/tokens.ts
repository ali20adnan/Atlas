export const lightColors = {
  bg: '#F5F4EF',
  surface: '#FFFFFF',
  surfaceMuted: '#EDEBE3',
  text: '#101815',
  textSecondary: '#3A4A43',
  textMuted: '#68786F',
  border: '#E3E1D8',
  overlay: 'rgba(10, 14, 12, 0.55)',
  accent: '#0E6B4A',
  accentPressed: '#0A563B',
  accentDeep: '#0C5C3F',
  onAccent: '#FFFFFF',
  accentSoft: '#E3F2EA',
  accentBorder: '#B9DCC9',
  gold: '#A5823C',
  goldSoft: '#F4EDDD',
  goldBorder: '#E0D2AC',
  warning: '#9A6700',
  warningSoft: '#FBF3DC',
  warningBorder: '#EBD79E',
  danger: '#B42318',
  dangerSoft: '#FBEBE9',
  dangerBorder: '#EFBDB6',
  info: '#1D4E89',
  infoSoft: '#E9F0F8',
  infoBorder: '#C6D6EA',
  reserved: '#5B3CC4',
  reservedSoft: '#EFEBFB',
  reservedBorder: '#D4CBF0',
  shadow: 'rgba(16, 24, 21, 0.10)',
  accentGradient: ['#18A572', '#0C5C3F'] as [string, string],
};

export const darkColors = {
  bg: '#0A0F0D',
  surface: '#131A16',
  surfaceMuted: '#1D2621',
  text: '#F2F6F3',
  textSecondary: '#C3CFC8',
  textMuted: '#8FA198',
  border: '#27322C',
  overlay: 'rgba(0, 0, 0, 0.66)',
  accent: '#43DE9B',
  accentPressed: '#2FC283',
  accentDeep: '#1E9E6E',
  onAccent: '#062518',
  accentSoft: '#103425',
  accentBorder: '#1F5B41',
  gold: '#D8BC80',
  goldSoft: '#2C2415',
  goldBorder: '#5B4C2B',
  warning: '#F0C24E',
  warningSoft: '#33290F',
  warningBorder: '#6E5518',
  danger: '#EF9187',
  dangerSoft: '#371712',
  dangerBorder: '#733028',
  info: '#9CC3EE',
  infoSoft: '#142636',
  infoBorder: '#28507A',
  reserved: '#C2B4F2',
  reservedSoft: '#271E49',
  reservedBorder: '#4E3F7E',
  shadow: 'rgba(0, 0, 0, 0.5)',
  accentGradient: ['#4FE6AC', '#1E9E6E'] as [string, string],
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
  xl: 26,
  full: 999,
} as const;

export const type = {
  micro: 11,
  label: 13,
  body: 16,
  title: 20,
  display: 40,
} as const;

/** Layered shadows: pair with a hairline border of the same hue. */
export const elevation = {
  card(colors: Colors) {
    return {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 24,
      shadowOpacity: 1,
      elevation: 4,
    };
  },
  float(colors: Colors) {
    return {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 16 },
      shadowRadius: 32,
      shadowOpacity: 1,
      elevation: 8,
    };
  },
  cta(colors: Colors) {
    return {
      shadowColor: colors.accentDeep,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 22,
      shadowOpacity: 0.35,
      elevation: 6,
    };
  },
};

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
