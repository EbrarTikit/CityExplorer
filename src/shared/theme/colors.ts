export interface ThemeColors {
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  border: string;
  divider: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  card: string;
  tabBar: string;
  tabBarInactive: string;
  skeleton: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  primary: '#6366f1',
  primaryLight: '#a5b4fc',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9',
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
  },
  border: '#e2e8f0',
  divider: '#f1f5f9',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  card: '#ffffff',
  tabBar: '#ffffff',
  tabBarInactive: '#94a3b8',
  skeleton: '#e2e8f0',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const darkColors: ThemeColors = {
  primary: '#818cf8',
  primaryLight: '#6366f1',
  secondary: '#a78bfa',
  accent: '#f472b6',
  background: '#0f172a',
  surface: '#1e293b',
  surfaceVariant: '#334155',
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#64748b',
    inverse: '#0f172a',
  },
  border: '#334155',
  divider: '#1e293b',
  success: '#34d399',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',
  card: '#1e293b',
  tabBar: '#1e293b',
  tabBarInactive: '#64748b',
  skeleton: '#334155',
  overlay: 'rgba(0, 0, 0, 0.7)',
};
