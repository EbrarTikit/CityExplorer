import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing, borderRadius } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { PlanItem } from '../types/plan.types';
import { getCategoryColor, getCategoryById } from '../../places/utils/categories';
import { usePlanStore } from '../store/planStore';

interface PlanItemRowProps {
  item: PlanItem;
  index: number;
}

export const PlanItemRow: React.FC<PlanItemRowProps> = ({ item, index }) => {
  const { colors } = useTheme();
  const removeItem = usePlanStore((s) => s.removeItem);
  const updateItem = usePlanStore((s) => s.updateItem);
  const [showNote, setShowNote] = useState(false);

  const catColor = item.category ? getCategoryColor(item.category) : colors.primary;
  const category = item.category ? getCategoryById(item.category) : null;

  const handleRemove = () => {
    Alert.alert('Sil', `"${item.placeName}" planından çıkarılsın mı?`, [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => removeItem(item.id) },
    ]);
  };

  const handleTimeChange = (time: string) => {
    updateItem(item.id, { time });
  };

  const handleNoteChange = (note: string) => {
    updateItem(item.id, { note });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      {/* Order number */}
      <View style={[styles.orderBadge, { backgroundColor: catColor + '20' }]}>
        <Text style={[typography.captionMedium, { color: catColor }]}>
          {index + 1}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.nameRow}>
            <Text
              style={[typography.bodyMedium, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              {item.placeName}
            </Text>
            {category && (
              <Text style={[typography.small, { color: catColor, marginLeft: spacing.xs }]}>
                {category.title}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={handleRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>

        {/* Time input */}
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
          <TextInput
            style={[
              typography.caption,
              styles.timeInput,
              { color: colors.text.primary, borderColor: colors.border },
            ]}
            placeholder="Saat (ör: 10:00)"
            placeholderTextColor={colors.text.tertiary}
            value={item.time || ''}
            onChangeText={handleTimeChange}
            maxLength={5}
          />
          <TouchableOpacity
            onPress={() => setShowNote(!showNote)}
            style={styles.noteToggle}
          >
            <Ionicons
              name={showNote ? 'chatbubble' : 'chatbubble-outline'}
              size={14}
              color={item.note ? colors.primary : colors.text.tertiary}
            />
            <Text style={[typography.small, { color: colors.text.tertiary, marginLeft: 3 }]}>
              Not
            </Text>
          </TouchableOpacity>
        </View>

        {/* Note */}
        {showNote && (
          <TextInput
            style={[
              typography.caption,
              styles.noteInput,
              {
                color: colors.text.primary,
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.border,
              },
            ]}
            placeholder="Not ekle..."
            placeholderTextColor={colors.text.tertiary}
            value={item.note || ''}
            onChangeText={handleNoteChange}
            multiline
            numberOfLines={2}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  orderBadge: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameRow: {
    flex: 1,
    marginRight: spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    width: 80,
    textAlign: 'center',
  },
  noteToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  noteInput: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    textAlignVertical: 'top',
  },
});
