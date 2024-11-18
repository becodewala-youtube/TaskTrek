import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Milestone, Priority, Status } from '../types/milestone';

interface MilestoneState {
  milestones: Milestone[];
  theme: 'light' | 'dark';
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  updateMilestone: (id: string, milestone: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  reorderMilestones: (milestones: Milestone[]) => void;
  toggleTheme: () => void;
}

export const useMilestoneStore = create<MilestoneState>()(
  persist(
    (set) => ({
      milestones: [],
      theme: 'light',
      addMilestone: (milestone) =>
        set((state) => ({
          milestones: [
            ...state.milestones,
            { ...milestone, id: crypto.randomUUID() },
          ],
        })),
      updateMilestone: (id, milestone) =>
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id ? { ...m, ...milestone } : m
          ),
        })),
      deleteMilestone: (id) =>
        set((state) => ({
          milestones: state.milestones.filter((m) => m.id !== id),
        })),
      reorderMilestones: (milestones) =>
        set(() => ({
          milestones,
        })),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'roadmap-storage',
    }
  )
);