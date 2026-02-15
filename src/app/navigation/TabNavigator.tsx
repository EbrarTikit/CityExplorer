import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../shared/hooks/useTheme';
import { TabParamList } from './types';
import { ExploreScreen } from '../../features/places/screens/ExploreScreen';
import { MapScreen } from '../../features/map/screens/MapScreen';
import { PlanScreen } from '../../features/plan/screens/PlanScreen';
import { FavoritesScreen } from '../../features/places/screens/FavoritesScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<
  keyof TabParamList,
  { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }
> = {
  Explore: { focused: 'compass', default: 'compass-outline' },
  Map: { focused: 'map', default: 'map-outline' },
  Plan: { focused: 'calendar', default: 'calendar-outline' },
  Favorites: { focused: 'heart', default: 'heart-outline' },
};

const TAB_LABELS: Record<keyof TabParamList, string> = {
  Explore: 'Keşfet',
  Map: 'Harita',
  Plan: 'Plan',
  Favorites: 'Favoriler',
};

export const TabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const iconConfig = TAB_ICONS[route.name];
          const iconName = focused ? iconConfig.focused : iconConfig.default;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: TAB_LABELS[route.name],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Plan" component={PlanScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
};
