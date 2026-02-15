import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { spacing, borderRadius } from '../../../shared/theme/spacing';

const SkeletonBlock: React.FC<{ width: number | string; height: number; style?: any }> = ({
  width,
  height,
  style,
}) => {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [anim]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          backgroundColor: colors.skeleton,
          borderRadius: borderRadius.sm,
          opacity: anim,
        },
        style,
      ]}
    />
  );
};

export const PlaceSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.colorBar, { backgroundColor: colors.skeleton }]} />
      <View style={styles.content}>
        <SkeletonBlock width="70%" height={16} />
        <SkeletonBlock width="40%" height={12} style={{ marginTop: spacing.sm }} />
        <SkeletonBlock width="90%" height={12} style={{ marginTop: spacing.md }} />
        <SkeletonBlock width="60%" height={12} style={{ marginTop: spacing.xs }} />
        <View style={styles.actions}>
          <SkeletonBlock width={28} height={28} style={{ borderRadius: 14 }} />
          <SkeletonBlock width={90} height={28} style={{ borderRadius: 14 }} />
        </View>
      </View>
    </View>
  );
};

export const PlaceSkeletonList: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <View>
    {Array.from({ length: count }).map((_, i) => (
      <PlaceSkeleton key={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    gap: spacing.md,
  },
});
