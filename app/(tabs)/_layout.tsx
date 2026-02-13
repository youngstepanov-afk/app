import { Tabs } from 'expo-router';
import React from 'react';

import { SwipeableTabBar } from '@/components/swipeable-tabs.SwipeableTabBar';
import { TabIcon } from '@/components/swipeable-tabs.TabIcon';
import { TAB_SCREENS } from '@/components/swipeable-tabs.screens';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <SwipeableTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      {TAB_SCREENS.map(({ name, title, Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color }) => <TabIcon Icon={Icon} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
