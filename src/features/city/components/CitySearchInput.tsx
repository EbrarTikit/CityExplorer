import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../shared/components/Input';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing } from '../../../shared/theme/spacing';

interface CitySearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const CitySearchInput: React.FC<CitySearchInputProps> = ({
  value,
  onChangeText,
  onClear,
}) => {
  const { colors } = useTheme();

  return (
    <Input
      placeholder="Şehir ara... (ör: Istanbul, Paris, Tokyo)"
      value={value}
      onChangeText={onChangeText}
      autoFocus
      autoCapitalize="words"
      returnKeyType="search"
      leftIcon={
        <Ionicons name="search" size={20} color={colors.text.tertiary} />
      }
      rightIcon={
        value.length > 0 ? (
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.text.tertiary}
            />
          </TouchableOpacity>
        ) : undefined
      }
    />
  );
};
