// src/store/compare.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Small compare store using product IDs.
 * Keeps a small set of selected product IDs for comparing.
 */
type CompareState = {
  /** list of product ids chosen for compare */
  ids: string[];
  /** Input: id; Process: add if not exists; Output: updated ids */
  add: (id: string) => void;
  /** Input: id; Process: remove if exists; Output: updated ids */
  remove: (id: string) => void;
  /** Input: id; Process: toggle presence; Output: updated ids */
  toggle: (id: string) => void;
  /** Input: id; Process: check existence; Output: boolean */
  has: (id: string) => boolean;
  /** Input: none; Process: clear all; Output: empty list */
  clear: () => void;
  /** Input: number; Process: enforce max size (optional); Output: slice */
  limitTo: (n: number) => void;
};

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) =>
        set((s) =>
          s.ids.includes(id) ? s : { ids: [...s.ids, id] }
        ),
      remove: (id) =>
        set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      toggle: (id) => {
        const { ids } = get();
        return ids.includes(id) ? get().remove(id) : get().add(id);
      },
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
      limitTo: (n) =>
        set((s) => (s.ids.length > n ? { ids: s.ids.slice(-n) } : s)),
    }),
    {
      name: 'compare',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);