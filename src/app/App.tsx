import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from './providers/ThemeProvider';
import { QueryProvider } from './providers/QueryProvider';
import { RootNavigator } from './navigation/RootNavigator';
import { ThemeContext } from './providers/ThemeProvider';

const AppContent: React.FC = () => {
  const themeCtx = React.useContext(ThemeContext);

  const navigationTheme = themeCtx?.isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: themeCtx.colors.primary,
          background: themeCtx.colors.background,
          card: themeCtx.colors.surface,
          text: themeCtx.colors.text.primary,
          border: themeCtx.colors.border,
          notification: themeCtx.colors.error,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: themeCtx?.colors.primary || '#6366f1',
          background: themeCtx?.colors.background || '#f8fafc',
          card: themeCtx?.colors.surface || '#ffffff',
          text: themeCtx?.colors.text.primary || '#0f172a',
          border: themeCtx?.colors.border || '#e2e8f0',
          notification: themeCtx?.colors.error || '#ef4444',
        },
      };

  return (
    <>
      <StatusBar style={themeCtx?.isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <QueryProvider>
          <AppContent />
        </QueryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
