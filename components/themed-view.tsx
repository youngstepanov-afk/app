import type { ViewProps } from 'react-native';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const EXTRA_BOTTOM_PADDING = 80;

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  isModal?: boolean;
  addPadding?: number;
};

export function ThemedView({
  lightColor,
  darkColor,
  isModal = false,
  addPadding = 16,
  style,
  children,
  ...viewProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  const safeAreaPaddingStyle = {
    paddingTop: insets.top + addPadding,
    paddingBottom: insets.bottom + addPadding + EXTRA_BOTTOM_PADDING,
    paddingLeft: insets.left + addPadding,
    paddingRight: insets.right + addPadding,
  };

  const contentPaddingStyle = isModal ? { padding: addPadding } : safeAreaPaddingStyle;    

  return (
    <View {...viewProps} style={[styles.container, { backgroundColor }, style]}>
      <ScrollView contentContainerStyle={contentPaddingStyle}>{children}</ScrollView>
      {!isModal && insets.top > 0 && (
        <LinearGradient
          pointerEvents="none"
          colors={colorScheme === 'dark'
            ? ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0)']
            : ['rgba(0, 0, 0, 0.35)', 'rgba(0, 0, 0, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.topSafeAreaGradient, { height: safeAreaPaddingStyle.paddingTop }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  topSafeAreaGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
