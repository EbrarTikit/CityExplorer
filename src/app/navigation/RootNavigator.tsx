import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../../shared/hooks/useTheme';
import { useCurrentCity } from '../../features/city/hooks/useCurrentCity';
import { RootStackParamList } from './types';
import { CitySearchScreen } from '../../features/city/screens/CitySearchScreen';
import { PlaceDetailScreen } from '../../features/places/screens/PlaceDetailScreen';
import { TabNavigator } from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { hasCity } = useCurrentCity();

  return (
    <Stack.Navigator
      initialRouteName={hasCity ? 'MainTabs' : 'CitySearch'}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
        statusBarStyle: isDark ? 'light' : 'dark',
      }}
    >
      <Stack.Screen name="CitySearch" component={CitySearchScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="PlaceDetail"
        component={PlaceDetailScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: 'Geri',
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.surface },
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};
