import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  captionMedium: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  small: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
} as const;
