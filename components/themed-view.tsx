import type { ViewProps } from 'react-native';
import { Platform, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const TOP_OVERLAY_LOCATIONS = [0, 0.12, 0.28, 0.48, 0.72, 1] as const;
const TOP_BLUR_SLICES = 50;
const TOP_BLUR_MAX_INTENSITY = 25;
const TOP_BLUR_EASING_POWER = 1.5;

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
  children,
}: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const insets = useSafeAreaInsets();

  const safeAreaPadding = {
    paddingTop: insets.top + addPadding,
    paddingBottom: insets.bottom + addPadding,
    paddingLeft: insets.left + addPadding,
    paddingRight: insets.right + addPadding,
  };

  const paddingStyle = isModal ? { padding: addPadding } : safeAreaPadding;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {!isModal && insets.top > 0 ? (
        <View
          pointerEvents="none"
          style={[styles.topSafeAreaOverlay, { height: insets.top }]}>
          {Array.from({ length: TOP_BLUR_SLICES }).map((_, idx) => {
            const sliceHeight = insets.top / TOP_BLUR_SLICES;
            const top = idx * sliceHeight;
            const t = (idx + 0.5) / TOP_BLUR_SLICES;
            const eased = Math.pow(1 - t, TOP_BLUR_EASING_POWER);
            const intensity = Math.round(TOP_BLUR_MAX_INTENSITY * eased);

            if (sliceHeight <= 0 || intensity <= 0) return null;

            return (
              <View
                key={idx}
                style={[styles.topSafeAreaSlice, { top, height: sliceHeight + 0.5 }]}>
                <BlurView
                  tint={colorScheme === 'dark' ? 'dark' : 'light'}
                  intensity={intensity}
                  experimentalBlurMethod={
                    Platform.OS === 'android' ? 'dimezisBlurView' : undefined
                  }
                  style={StyleSheet.absoluteFill}
                />
              </View>
            );
          })}
          <LinearGradient
            colors={
              colorScheme === 'dark'
                ? [
                    'rgba(255, 255, 255, 0.5)',
                    'rgba(255, 255, 255, 0.4)',
                    'rgba(255, 255, 255, 0.3)',
                    'rgba(255, 255, 255, 0.2)',
                    'rgba(255, 255, 255, 0.1)',
                    'rgba(255, 255, 255, 0)',
                  ]
                : [
                    'rgba(0, 0, 0, 0.5)',
                    'rgba(0, 0, 0, 0.4)',
                    'rgba(0, 0, 0, 0.3)',
                    'rgba(0, 0, 0, 0.2)',
                    'rgba(0, 0, 0, 0.1)',
                    'rgba(0, 0, 0, 0)',
                  ]
            }
            locations={[...TOP_OVERLAY_LOCATIONS]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      ) : null}
      <ScrollView contentContainerStyle={paddingStyle}>{children}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSafeAreaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  topSafeAreaSlice: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
});
