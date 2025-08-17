import { create } from 'zustand';
import type { CartItem, ID, Product } from '@/type';

type CartState = {
  items: CartItem[];
  totalQty: number;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: ID) => void;
  clearCart: () => void;
  updateQty: (productId: ID, qty: number) => void;
};

/**
 * Input: user actions add/remove/clear
 * Process: mutate array immutably and recompute derived `totalQty`
 * Output: cart state reflecting the latest user intent
 */
export const useCart = create<CartState>((set, get) => ({
  items: [],
  totalQty: 0,

  /**
   * Input: product model and optional qty (default 1)
   * Process: upsert item; sum quantities to update total
   * Output: updated items and totalQty
   */
  addToCart: (product, qty = 1) => {
    const items = get().items;
    const idx = items.findIndex(i => i.productId === product.id);
    const next = [...items];
    if (idx >= 0) next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
    else next.push({ productId: product.id, quantity: qty });
    const totalQty = next.reduce((acc, it) => acc + it.quantity, 0);
    
    set({ items: next, totalQty });
  },

  /**
   * Input: productId
   * Process: filter out matching item; recompute total
   * Output: updated cart state
   */
  removeFromCart: (productId) => {
    const next = get().items.filter(i => i.productId !== productId);
    const totalQty = next.reduce((acc, it) => acc + it.quantity, 0);
    set({ items: next, totalQty });
  },

  /**
   * Input: none
   * Process: reset items to empty; reset total to 0
   * Output: empty cart state
   */
  clearCart: () => set({ items: [], totalQty: 0 }),
    updateQty: (productId, qty) => set(state => {
    // If qty <= 0, remove the item
    if (qty <= 0) {
      const items = state.items.filter(it => it.productId !== productId);
      const totalQty = items.reduce((acc, it) => acc + it.quantity, 0);
      return { items, totalQty };
    }
    // Otherwise update the quantity
    const items = state.items.map(it => it.productId === productId ? { ...it, quantity: qty } : it);
    const totalQty = items.reduce((acc, it) => acc + it.quantity, 0);
    return { items, totalQty };
  })

}));