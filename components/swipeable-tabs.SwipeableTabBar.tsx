import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  Animated,
  Keyboard,
  type LayoutChangeEvent,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import {
  SELECTOR_RADIUS,
  SELECTOR_SIZE,
  SELECTOR_TOP,
  TAB_BAR_BORDER_WIDTH,
  TAB_BAR_BOTTOM_OFFSET,
  TAB_BAR_HEIGHT,
  TAB_BAR_RADIUS,
  TAB_BAR_SIDE_INSET,
} from '@/constants/swipeable-tabs';

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const styles = StyleSheet.create({
  tabBarContainer: {
    height: TAB_BAR_HEIGHT,
    position: 'absolute',
    left: TAB_BAR_SIDE_INSET,
    right: TAB_BAR_SIDE_INSET,
    backgroundColor: 'transparent',
  },
  tabBarRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selector: {
    position: 'absolute',
    width: SELECTOR_SIZE,
    height: SELECTOR_SIZE,
    borderWidth: 1.5,
    borderRadius: SELECTOR_RADIUS,
  },
});

export function SwipeableTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [previewIndex, setPreviewIndex] = React.useState<number | null>(null);
  const [selectorReady, setSelectorReady] = React.useState(false);

  const androidBlurMethod =
    Platform.OS === 'android' ? 'dimezisBlurView' : undefined;

  React.useEffect(() => {
    // iOS supports "will", Android reliably supports "did".
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const subShow = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const subHide = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  const palette = React.useMemo(() => {
    const scheme = colorScheme ?? 'light';
    const activeTintColor = Colors[scheme].tint;

    const isDark = scheme === 'dark';
    return {
      scheme,
      isDark,
      activeTintColor,
      inactiveTintColor: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
      tabBarBorderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.10)',
      overlayColor: isDark ? 'rgba(0,0,0,0.20)' : 'rgba(255,255,255,0.18)',
    };
  }, [colorScheme]);

  const containerRef = React.useRef<View>(null);
  const containerMetricsRef = React.useRef({ x: 0, width: 0 });
  const isDraggingRef = React.useRef(false);
  const previewIndexRef = React.useRef<number | null>(null);
  const selectorTranslateX = React.useRef(new Animated.Value(0)).current;
  const hasPositionedInitiallyRef = React.useRef(false);
  const lastWidthRef = React.useRef(0);

  const clearPreviewIndex = React.useCallback(() => {
    previewIndexRef.current = null;
    setPreviewIndex(null);
  }, []);

  const measureContainer = React.useCallback(() => {
    containerRef.current?.measureInWindow((x, _y, width) => {
      containerMetricsRef.current = { x, width };
    });
  }, []);

  const onContainerLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width;
      if (width !== lastWidthRef.current) {
        lastWidthRef.current = width;
        hasPositionedInitiallyRef.current = false;
        setSelectorReady(false);
      }
      setContainerWidth(width);
      containerMetricsRef.current = { ...containerMetricsRef.current, width };
      requestAnimationFrame(measureContainer);
    },
    [measureContainer],
  );

  const computeIndexFromMoveX = React.useCallback(
    (moveX: number) => {
      const { x, width } = containerMetricsRef.current;
      if (!width) return state.index;
      const relativeX = moveX - x;
      const itemWidth = width / state.routes.length;
      const rawIndex = Math.floor(relativeX / itemWidth);
      return Math.max(0, Math.min(state.routes.length - 1, rawIndex));
    },
    [state.index, state.routes.length],
  );

  const indexToSelectorX = React.useCallback(
    (index: number) => {
      const width = containerWidth || containerMetricsRef.current.width;
      if (!width) return 0;
      const itemWidth = width / state.routes.length;
      return index * itemWidth + (itemWidth - SELECTOR_SIZE) / 2;
    },
    [containerWidth, state.routes.length],
  );

  const animateSelectorToIndex = React.useCallback(
    (index: number) => {
      Animated.spring(selectorTranslateX, {
        toValue: indexToSelectorX(index),
        useNativeDriver: true,
        speed: 22,
        bounciness: 0,
        overshootClamping: true,
      }).start();
    },
    [indexToSelectorX, selectorTranslateX],
  );

  React.useEffect(() => {
    if (isDraggingRef.current) return;
    // Keep preview until navigation finishes and the active tab catches up.
    if (previewIndex == null) return;
    if (previewIndex !== state.index) return;
    clearPreviewIndex();
  }, [clearPreviewIndex, previewIndex, state.index]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, gestureState) => {
          const dx = Math.abs(gestureState.dx);
          const dy = Math.abs(gestureState.dy);
          return dx > 6 && dy < 20;
        },
        onPanResponderGrant: () => {
          isDraggingRef.current = true;

          previewIndexRef.current = state.index;
          setPreviewIndex(state.index);

          selectorTranslateX.stopAnimation();
        },
        onPanResponderMove: (_evt, gestureState) => {
          const { x, width } = containerMetricsRef.current;
          if (!width) return;

          const relativeX = gestureState.moveX - x;
          const nextX = clampNumber(
            relativeX - SELECTOR_SIZE / 2,
            0,
            width - SELECTOR_SIZE,
          );
          selectorTranslateX.setValue(nextX);

          const idx = computeIndexFromMoveX(gestureState.moveX);
          if (idx !== previewIndexRef.current) {
            previewIndexRef.current = idx;
            setPreviewIndex(idx);
          }
        },
        onPanResponderRelease: (_evt, gestureState) => {
          const { width } = containerMetricsRef.current;
          if (!width) {
            isDraggingRef.current = false;
            animateSelectorToIndex(state.index);
            previewIndexRef.current = null;
            setPreviewIndex(null);
            return;
          }

          const index = computeIndexFromMoveX(gestureState.moveX);

          animateSelectorToIndex(index);

          previewIndexRef.current = index;
          setPreviewIndex(index);

          if (index !== state.index) {
            navigation.navigate(state.routes[index]!.name);
          } else {
            clearPreviewIndex();
          }
          isDraggingRef.current = false;
        },
        onPanResponderTerminate: () => {
          isDraggingRef.current = false;
          animateSelectorToIndex(state.index);
          clearPreviewIndex();
        },
      }),
    [
      animateSelectorToIndex,
      clearPreviewIndex,
      computeIndexFromMoveX,
      navigation,
      selectorTranslateX,
      state.index,
      state.routes,
    ],
  );

  React.useEffect(() => {
    const id = requestAnimationFrame(measureContainer);
    return () => cancelAnimationFrame(id);
  }, [measureContainer, state.routes.length]);

  React.useEffect(() => {
    if (isDraggingRef.current) return;
    if (!containerWidth) return;

    if (!hasPositionedInitiallyRef.current) {
      selectorTranslateX.setValue(indexToSelectorX(state.index));
      hasPositionedInitiallyRef.current = true;
      setSelectorReady(true);
      return;
    }

    animateSelectorToIndex(state.index);
  }, [
    animateSelectorToIndex,
    containerWidth,
    indexToSelectorX,
    selectorTranslateX,
    state.index,
  ]);

  if (keyboardVisible) return null;

  const visualIndex = previewIndex ?? state.index;

  return (
    <View
      ref={containerRef}
      onLayout={onContainerLayout}
      style={[
        styles.tabBarContainer,
        {
          bottom: insets.bottom + TAB_BAR_BOTTOM_OFFSET,
          borderRadius: TAB_BAR_RADIUS,
          overflow: 'hidden',
        },
      ]}
      {...panResponder.panHandlers}>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: TAB_BAR_RADIUS, overflow: 'hidden' },
        ]}>
        <BlurView
          tint={palette.isDark ? 'dark' : 'light'}
          intensity={60}
          experimentalBlurMethod={androidBlurMethod}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: palette.overlayColor,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderWidth: TAB_BAR_BORDER_WIDTH,
              borderColor: palette.tabBarBorderColor,
              borderRadius: TAB_BAR_RADIUS,
            },
          ]}
        />
      </View>

      <View style={styles.tabBarRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]!;
          const isFocused = visualIndex === index;
          const color = isFocused ? palette.activeTintColor : palette.inactiveTintColor;

          const onPress = () => {
            clearPreviewIndex();
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
              style={styles.tabBarItem}>
              {options.tabBarIcon?.({ focused: isFocused, color, size: 24 })}
            </Pressable>
          );
        })}

        {selectorReady ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.selector,
              {
                top: SELECTOR_TOP,
                borderColor: palette.activeTintColor,
                transform: [{ translateX: selectorTranslateX }],
              },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}
