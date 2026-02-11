import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    tint: '#000000',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    tint: '#ffffff',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
  },
  android: {
    sans: 'Roboto',
  },
  default: {
    sans: 'System',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
});
