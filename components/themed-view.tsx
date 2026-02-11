import type { ViewProps } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  isModal?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  isModal = false,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const insets = useSafeAreaInsets();

  const safeAreaPadding = {
    paddingTop: insets.top + 16,
    paddingBottom: insets.bottom + 16,
    paddingLeft: insets.left + 16,
    paddingRight: insets.right + 16,
  };

  const paddingStyle = isModal ? styles.modalPadding : safeAreaPadding;

  return (
    <View
      style={[styles.container, { backgroundColor }, paddingStyle, style]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalPadding: {
    padding: 16,
  },
});
