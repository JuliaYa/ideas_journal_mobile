import { MD3LightTheme as DefaultTheme, type MD3Theme } from 'react-native-paper';
import { colors } from './design';

const IdeasAppTheme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.ube800,
    onPrimary: colors.white,
    background: colors.warmCream,
    onBackground: colors.black,
    surface: colors.white,
    onSurface: colors.black,
    surfaceVariant: colors.oatLight,
    onSurfaceVariant: colors.warmCharcoal,
    secondary: colors.matcha600,
    onSecondary: colors.white,
    tertiary: colors.slushie500,
    outline: colors.oatBorder,
    outlineVariant: colors.oatLight,
    elevation: {
      ...DefaultTheme.colors.elevation,
      level0: colors.warmCream,
      level1: colors.white,
      level2: colors.white,
    },
  },
};
export default IdeasAppTheme;
