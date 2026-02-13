import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { TabIconComponent } from '@/components/swipeable-tabs.screens';
import { SELECTOR_SIZE } from '@/constants/swipeable-tabs';

export function TabIcon({ Icon, color }: { Icon: TabIconComponent; color: string }) {
  return (
    <View style={styles.tabIconWrapper}>
      <Icon color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabIconWrapper: {
    width: SELECTOR_SIZE,
    height: SELECTOR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
