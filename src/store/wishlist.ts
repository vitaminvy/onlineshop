import { create } from 'zustand';

type WishlistState = {
  ids: string[]; // productId[]
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

// Persist to localStorage
const STORAGE_KEY = 'wishlist';

export const useWishlist = create<WishlistState>((set, get) => ({
  ids: (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
    catch { return []; }
  })(),

  add: (id) => set(state => {
    if (state.ids.includes(id)) return state;
    const next = [...state.ids, id];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* empty */ }
    return { ids: next };
  }),

  remove: (id) => set(state => {
    const next = state.ids.filter(x => x !== id);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* empty */ }
    return { ids: next };
  }),

  toggle: (id) => {
    const { has, add, remove } = get();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    has(id) ? remove(id) : add(id);
  },

  has: (id) => get().ids.includes(id),
}));