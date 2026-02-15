import React from 'react';
import { EmptyState } from '../../../shared/components/EmptyState';

export const EmptyPlan: React.FC = () => {
  return (
    <EmptyState
      icon="calendar-outline"
      title="Plan boş"
      message="Keşfet sekmesinden veya haritadan yerleri planınıza ekleyin."
    />
  );
};
