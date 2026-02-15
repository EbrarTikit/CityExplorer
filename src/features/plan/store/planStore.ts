import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlanItem } from '../types/plan.types';

interface PlanState {
  items: PlanItem[];
  totalDays: number;
  addItem: (item: Omit<PlanItem, 'id' | 'order'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<PlanItem>) => void;
  reorderItems: (day: number, newOrder: PlanItem[]) => void;
  setTotalDays: (days: number) => void;
  clearPlan: () => void;
  getItemsByDay: (day: number) => PlanItem[];
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      items: [],
      totalDays: 3,

      addItem: (item) => {
        const dayItems = get().items.filter((i) => i.day === item.day);
        const newItem: PlanItem = {
          ...item,
          id: `plan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          order: dayItems.length,
        };
        set({ items: [...get().items, newItem] });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateItem: (id, updates) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        });
      },

      reorderItems: (day, newOrder) => {
        const otherDays = get().items.filter((i) => i.day !== day);
        const reordered = newOrder.map((item, index) => ({
          ...item,
          order: index,
        }));
        set({ items: [...otherDays, ...reordered] });
      },

      setTotalDays: (days) => set({ totalDays: Math.max(1, Math.min(days, 14)) }),

      clearPlan: () => set({ items: [], totalDays: 3 }),

      getItemsByDay: (day) =>
        get()
          .items.filter((i) => i.day === day)
          .sort((a, b) => a.order - b.order),
    }),
    {
      name: 'plan-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
