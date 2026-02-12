import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

export type TopSafeAreaGradientProps = {
  height: number;
  scheme: 'light' | 'dark';
  scrollY?: SharedValue<number>;
  blurDistance?: number;
  blurIntensity?: number;
  enableBlur?: boolean;
};

const DARK_COLORS = [
  'rgba(255, 255, 255, 0.5)',
  'rgba(255, 255, 255, 0.4)',
  'rgba(255, 255, 255, 0.3)',
  'rgba(255, 255, 255, 0.2)',
  'rgba(255, 255, 255, 0.1)',
  'rgba(255, 255, 255, 0)',
] as const;

const LIGHT_COLORS = [
  'rgba(0, 0, 0, 0.5)',
  'rgba(0, 0, 0, 0.4)',
  'rgba(0, 0, 0, 0.3)',
  'rgba(0, 0, 0, 0.2)',
  'rgba(0, 0, 0, 0.1)',
  'rgba(0, 0, 0, 0)',
] as const;

export function TopSafeAreaGradient({
  height,
  scheme,
  scrollY,
  blurDistance = 300,
  blurIntensity = 30,
  enableBlur = true,
}: TopSafeAreaGradientProps) {
  if (height <= 0) return null;

  const blurAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY || !enableBlur) return { opacity: 0 };

    const y = Math.max(0, scrollY.value);
    const opacity = interpolate(y, [0, blurDistance], [0, 1], Extrapolate.CLAMP);
    return { opacity };
  }, [blurDistance, enableBlur]);

  return (
    <View pointerEvents="none" style={[styles.topSafeAreaOverlay, { height }]}>
      <LinearGradient
        colors={scheme === 'dark' ? [...DARK_COLORS] : [...LIGHT_COLORS]}
        locations={[0, 0.12, 0.28, 0.48, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />
      {enableBlur ? (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, blurAnimatedStyle]}>
          <BlurView
            tint={scheme}
            intensity={blurIntensity}
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor:
                  scheme === 'dark' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)',
              },
            ]}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topSafeAreaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
});
