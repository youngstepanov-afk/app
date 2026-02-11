import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { Platform, useColorScheme } from 'react-native';

import { HomeIcon } from '@/assets/svg/home'
import { HearthIcon } from '@/assets/svg/hearth';
import { SettingsIcon } from '@/assets/svg/settings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
          bottom: Math.max(insets.bottom + 16),
          marginHorizontal: 24,
          borderRadius: 24,
        },
        tabBarItemStyle: {
          ...(Platform.OS === 'web'
            ? { alignSelf: 'center' }
            : { marginTop: 10 }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <HearthIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
