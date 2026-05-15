import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RPG } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: RPG.gold,
        tabBarInactiveTintColor: RPG.textDark,
        tabBarStyle: {
          backgroundColor: RPG.headerBg,
          borderTopColor: RPG.goldDim,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: Platform.select({ ios: 'ui-serif', default: 'serif' }),
          fontSize: 11,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ficha',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="magia"
        options={{
          title: 'Magia',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="sparkles" color={color} />,
        }}
      />
      <Tabs.Screen
        name="grimorio"
        options={{
          title: 'Grimório',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="regras"
        options={{
          title: 'Regras',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
