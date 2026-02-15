import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { RootStackParamList } from '../../../app/navigation/types';
import { CitySearchInput } from '../components/CitySearchInput';
import { CitySuggestionItem } from '../components/CitySuggestionItem';
import { useCitySearch } from '../hooks/useCitySearch';
import { useCurrentCity } from '../hooks/useCurrentCity';
import { City } from '../types/city.types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'CitySearch'>;

export const CitySearchScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const [query, setQuery] = useState('');
  const { data: results, isLoading, isError } = useCitySearch(query);
  const { recentCities, setCity } = useCurrentCity();

  const handleSelectCity = useCallback(
    (city: City) => {
      setCity(city);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    },
    [setCity, navigation]
  );

  const showRecent = query.length < 2 && recentCities.length > 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="earth" size={40} color={colors.primary} />
          <Text style={[typography.h1, { color: colors.text.primary, marginTop: spacing.md }]}>
            City Explorer
          </Text>
          <Text
            style={[
              typography.body,
              { color: colors.text.secondary, marginTop: spacing.xs, textAlign: 'center' },
            ]}
          >
            Keşfetmek istediğiniz şehri arayın
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <CitySearchInput
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
          />
        </View>

        {/* Loading */}
        {isLoading && query.length >= 2 && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[typography.caption, { color: colors.text.secondary, marginLeft: spacing.sm }]}>
              Aranıyor...
            </Text>
          </View>
        )}

        {/* Results */}
        {!showRecent && results && results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CitySuggestionItem city={item} onPress={handleSelectCity} />
            )}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* No results */}
        {!isLoading && query.length >= 2 && results && results.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={40} color={colors.text.tertiary} />
            <Text style={[typography.body, { color: colors.text.secondary, marginTop: spacing.md }]}>
              Sonuç bulunamadı
            </Text>
            <Text style={[typography.caption, { color: colors.text.tertiary, marginTop: spacing.xs }]}>
              Farklı bir şehir adı deneyin
            </Text>
          </View>
        )}

        {/* Recent Cities */}
        {showRecent && (
          <View style={styles.recentContainer}>
            <Text
              style={[
                typography.captionMedium,
                { color: colors.text.secondary, marginBottom: spacing.md },
              ]}
            >
              Son Arananlar
            </Text>
            {recentCities.map((city) => (
              <CitySuggestionItem
                key={city.id}
                city={city}
                onPress={handleSelectCity}
                isRecent
              />
            ))}
          </View>
        )}

        {/* Error */}
        {isError && (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={40} color={colors.error} />
            <Text style={[typography.body, { color: colors.text.secondary, marginTop: spacing.md }]}>
              Arama yapılırken bir hata oluştu
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing['4xl'],
  },
  recentContainer: {
    paddingHorizontal: spacing.xl,
  },
});
