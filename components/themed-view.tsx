import type { ViewProps } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  isModal?: boolean;
  addPadding?: number;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  isModal = false,
  addPadding = 16,
  children,
  ...otherProps
}: ThemedViewProps) {
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
    <View style={[styles.container, { backgroundColor }, style]} {...otherProps}>
      <ScrollView contentContainerStyle={paddingStyle}>{children}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
