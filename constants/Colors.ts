/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Modern color palette inspired by the design image
const primaryGreen = '#6BA34F';
const softGreen = '#DDEEE9';
const lightBlueGreen = '#C9E0DD';
const warmOrange = '#F2994A';
const warmYellow = '#F2C94C';
const warmBeige = '#D2C9BD';
const softBlue = '#E3F2FD';
const softPurple = '#F3E5F5';

export const Colors = {
  light: {
    text: '#2D3748',
    background: '#FAFAFA',
    tint: primaryGreen,
    icon: '#718096',
    tabIconDefault: '#A0AEC0',
    tabIconSelected: primaryGreen,
    // New modern colors
    primary: primaryGreen,
    secondary: softGreen,
    accent: warmOrange,
    success: '#48BB78',
    warning: warmYellow,
    error: '#F56565',
    info: lightBlueGreen,
    surface: '#FFFFFF',
    surfaceVariant: softGreen,
    border: '#E2E8F0',
    // Task card colors
    taskOrange: warmOrange,
    taskYellow: warmYellow,
    taskBeige: warmBeige,
    taskBlue: softBlue,
    taskPurple: softPurple,
  },
  dark: {
    text: '#F7FAFC',
    background: '#1A202C',
    tint: primaryGreen,
    icon: '#A0AEC0',
    tabIconDefault: '#718096',
    tabIconSelected: primaryGreen,
    // New modern colors
    primary: primaryGreen,
    secondary: '#2D3748',
    accent: warmOrange,
    success: '#48BB78',
    warning: warmYellow,
    error: '#F56565',
    info: '#2C5282',
    surface: '#2D3748',
    surfaceVariant: '#4A5568',
    border: '#4A5568',
    // Task card colors
    taskOrange: warmOrange,
    taskYellow: warmYellow,
    taskBeige: warmBeige,
    taskBlue: '#2C5282',
    taskPurple: '#553C9A',
  },
};
