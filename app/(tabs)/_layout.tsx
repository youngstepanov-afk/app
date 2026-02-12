import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';

import { HomeIcon } from '@/assets/svg/home'
import { HearthIcon } from '@/assets/svg/hearth';
import { SettingsIcon } from '@/assets/svg/settings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const tabBarRadius = 24;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: tabBarRadius, overflow: 'hidden' },
            ]}>
            <BlurView
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              intensity={60}
              experimentalBlurMethod={
                Platform.OS === 'android' ? 'dimezisBlurView' : undefined
              }
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor:
                    colorScheme === 'dark'
                      ? 'rgba(0,0,0,0.20)'
                      : 'rgba(255,255,255,0.18)',
                },
              ]}
            />
          </View>
        ),
        tabBarStyle: {
          height: 60,
          position: 'absolute',
          bottom: Math.max(insets.bottom + 16),
          marginHorizontal: 24,
          borderRadius: tabBarRadius,
          backgroundColor: 'transparent',
          elevation: 0,
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
        name="hearth"
        options={{
          title: 'Hearth',
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
