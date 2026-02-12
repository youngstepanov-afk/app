import type { ViewProps } from 'react-native';
import { StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopSafeAreaGradient } from '@/components/top-safe-area-gradient';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  isModal?: boolean;
  addPadding?: number;
  isBluer?: boolean;
  isGradient?: boolean;
};

export function ThemedView({
  lightColor,
  darkColor,
  isModal = false,
  addPadding = 16,
  isBluer = true,
  isGradient = true,
  children,
}: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const safeAreaPadding = {
    paddingTop: insets.top + addPadding,
    paddingBottom: insets.bottom + addPadding + 80,
    paddingLeft: insets.left + addPadding,
    paddingRight: insets.right + addPadding,
  };

  const paddingStyle = isModal ? { padding: addPadding } : safeAreaPadding;
  const topOverlayHeight = insets.top + addPadding;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={paddingStyle}>
        {children}
      </Animated.ScrollView>
      {isGradient && !isModal && insets.top > 0 ? (
        <TopSafeAreaGradient
          height={topOverlayHeight}
          scheme={colorScheme === 'dark' ? 'dark' : 'light'}
          scrollY={scrollY}
          enableBlur={isBluer}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
