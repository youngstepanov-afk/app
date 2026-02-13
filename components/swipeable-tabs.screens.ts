import React from 'react';

import { HomeIcon } from '@/assets/svg/home';
import { HearthIcon } from '@/assets/svg/hearth';
import { SettingsIcon } from '@/assets/svg/settings';

export type TabIconComponent = React.ComponentType<{ color?: string }>;

export type TabScreenConfig = {
  name: 'index' | 'hearth' | 'settings';
  title: string;
  Icon: TabIconComponent;
};

export const TAB_SCREENS: TabScreenConfig[] = [
  { name: 'index', title: 'Home', Icon: HomeIcon },
  { name: 'hearth', title: 'Hearth', Icon: HearthIcon },
  { name: 'settings', title: 'Settings', Icon: SettingsIcon },
];
