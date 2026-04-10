// Clay-inspired design tokens from DESIGN.md

export const colors = {
  // Primary
  black: '#000000',
  white: '#ffffff',
  warmCream: '#faf9f7',

  // Swatch palette
  matcha300: '#84e7a5',
  matcha600: '#078a52',
  matcha800: '#02492a',

  slushie500: '#3bd3fd',
  slushie800: '#0089ad',

  lemon400: '#f8cc65',
  lemon500: '#fbbd41',
  lemon700: '#d08a11',
  lemon800: '#9d6a09',

  ube300: '#c1b0ff',
  ube800: '#43089f',
  ube900: '#32037d',

  pomegranate400: '#fc7981',

  blueberry800: '#01418d',

  // Neutrals
  warmSilver: '#9f9b93',
  warmCharcoal: '#55534e',
  darkCharcoal: '#333333',

  // Surface & Border
  oatBorder: '#dad4c8',
  oatLight: '#eee9df',
  coolBorder: '#e6e8ec',

  // Badge
  badgeBlueBg: '#f0f8ff',
  badgeBlueText: '#3859f9',

  // Focus
  focusRing: 'rgb(20, 110, 245)',
};

export const STATUS_COLORS: Record<string, string> = {
  new: colors.slushie500,
  in_progress: colors.lemon500,
  done: colors.matcha600,
  archived: colors.warmSilver,
};

export const shadows = {
  clay: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  hardOffset: {
    shadowColor: '#000',
    shadowOffset: { width: -7, height: 7 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
};

export const radii = {
  sharp: 4,
  standard: 8,
  badge: 11,
  card: 12,
  feature: 24,
  section: 40,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};
