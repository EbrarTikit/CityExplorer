import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing, borderRadius } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { DayTabs } from '../components/DayTabs';
import { PlanItemRow } from '../components/PlanItemRow';
import { EmptyPlan } from '../components/EmptyPlan';
import { usePlanStore } from '../store/planStore';
import { useCurrentCity } from '../../city/hooks/useCurrentCity';
import { sharePlan } from '../utils/sharePlan';

export const PlanScreen: React.FC = () => {
  const { colors } = useTheme();
  const { currentCity } = useCurrentCity();
  const items = usePlanStore((s) => s.items);
  const totalDays = usePlanStore((s) => s.totalDays);
  const setTotalDays = usePlanStore((s) => s.setTotalDays);
  const clearPlan = usePlanStore((s) => s.clearPlan);

  const [selectedDay, setSelectedDay] = useState(1);

  const itemCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    items.forEach((item) => {
      counts[item.day] = (counts[item.day] || 0) + 1;
    });
    return counts;
  }, [items]);

  const dayItems = useMemo(
    () =>
      items
        .filter((i) => i.day === selectedDay)
        .sort((a, b) => a.order - b.order),
    [items, selectedDay]
  );

  const handleShare = useCallback(async () => {
    try {
      await sharePlan(items, currentCity?.name || 'Şehir', totalDays);
    } catch {
      // Share dismissed
    }
  }, [items, currentCity?.name, totalDays]);

  const handleClear = useCallback(() => {
    Alert.alert(
      'Planı Temizle',
      'Tüm plan silinecek. Emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Temizle', style: 'destructive', onPress: () => clearPlan() },
      ]
    );
  }, [clearPlan]);

  const handleAddDay = useCallback(() => {
    setTotalDays(totalDays + 1);
  }, [totalDays, setTotalDays]);

  const handleRemoveDay = useCallback(() => {
    if (totalDays > 1) {
      setTotalDays(totalDays - 1);
      if (selectedDay > totalDays - 1) {
        setSelectedDay(totalDays - 1);
      }
    }
  }, [totalDays, setTotalDays, selectedDay]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[typography.h2, { color: colors.text.primary }]}>Seyahat Planı</Text>
          {currentCity && (
            <Text style={[typography.caption, { color: colors.text.secondary }]}>
              {currentCity.name}, {currentCity.country}
            </Text>
          )}
        </View>
        <View style={styles.headerActions}>
          {items.length > 0 && (
            <TouchableOpacity
              onPress={handleShare}
              style={[styles.iconBtn, { backgroundColor: colors.primary + '15' }]}
            >
              <Ionicons name="share-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          {items.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              style={[styles.iconBtn, { backgroundColor: colors.error + '15' }]}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Day controls */}
      <View style={styles.dayControls}>
        <DayTabs
          totalDays={totalDays}
          selectedDay={selectedDay}
          onSelect={setSelectedDay}
          itemCounts={itemCounts}
        />
        <View style={styles.dayButtons}>
          <TouchableOpacity
            onPress={handleRemoveDay}
            disabled={totalDays <= 1}
            style={[
              styles.smallBtn,
              {
                backgroundColor: colors.surfaceVariant,
                opacity: totalDays <= 1 ? 0.4 : 1,
              },
            ]}
          >
            <Ionicons name="remove" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddDay}
            disabled={totalDays >= 14}
            style={[
              styles.smallBtn,
              {
                backgroundColor: colors.primary + '15',
                opacity: totalDays >= 14 ? 0.4 : 1,
              },
            ]}
          >
            <Ionicons name="add" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Plan items */}
      {dayItems.length === 0 ? (
        <EmptyPlan />
      ) : (
        <FlatList
          data={dayItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <PlanItemRow item={item} index={index} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Summary footer */}
      {items.length > 0 && (
        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Text style={[typography.caption, { color: colors.text.secondary }]}>
            Toplam: {items.length} yer, {totalDays} gün
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayButtons: {
    flexDirection: 'row',
    paddingRight: spacing.lg,
    gap: spacing.xs,
  },
  smallBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['5xl'],
  },
  footer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 0.5,
    alignItems: 'center',
  },
});
