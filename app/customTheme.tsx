import { MD3LightTheme as DefaultTheme, type MD3Theme } from 'react-native-paper';

const IdeasAppTheme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // important keys that Paper components read
    primary: '#7c56a7',        // main brand color
    onPrimary: '#ffffff',
    background: '#c6bbd3ff',     // page background if you want purple
    onBackground: '#ffffff',
    surface: '#ffffff',        // cards, sheets
    onSurface: '#261d15ff',
    // optional: other useful tokens
    secondary: '#c68cf0',
    outline: '#e0d8ee',
    // keep other default tokens
  },
};
export default IdeasAppTheme;
