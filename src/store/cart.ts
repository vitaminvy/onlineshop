import { create } from 'zustand';
import type { CartItem, ID, Product } from '@/type';
import { useProducts } from "./product";


type CartState = {
  items: CartItem[];
  totalQty: number;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: ID) => void;
  clearCart: () => void;
  updateQty: (productId: ID, qty: number) => void;
};
/**
 * Input: none
 * Process: read cart snapshot from localStorage; validate shape
 * Output: { items, totalQty } or empty cart
 */
const loadCart = () => {
  try {
    const raw = localStorage.getItem('cart');
    if (!raw) return { items: [], totalQty: 0 };
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed?.items) ? parsed.items : [];
    const totalQty =
      typeof parsed?.totalQty === 'number'
        ? parsed.totalQty
        : items.reduce((a: number, it: { quantity: number }) => a + (it?.quantity ?? 0), 0);
    return { items, totalQty };
  } catch {
    return { items: [], totalQty: 0 };
  }
};

/**
 * Input: next items array
 * Process: compute totalQty and write to localStorage
 * Output: state partial to feed Zustand's set()
 */
const persistCart = (items: Array<{ productId: string; quantity: number }>) => {
  const totalQty = items.reduce((a, it) => a + (it.quantity ?? 0), 0);
  localStorage.setItem('cart', JSON.stringify({ items, totalQty }));
  return { items, totalQty };
};
/**
 * Input: user actions add/remove/clear
 * Process: mutate array immutably and recompute derived `totalQty`
 * Output: cart state reflecting the latest user intent
 */
export const useCart = create<CartState>((set, get) => ({
    ...loadCart(),


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
    set(persistCart(next)); 
    useProducts.getState().reduceStock(product.id, qty);

    
  },

  /**
   * Input: productId
   * Process: filter out matching item; recompute total
   * Output: updated cart state
   */
  removeFromCart: (productId) => {
    const next = get().items.filter(i => i.productId !== productId);
    set(persistCart(next));
  },

  /**
   * Input: none
   * Process: reset items to empty; reset total to 0
   * Output: empty cart state
   */
  clearCart: () => {
      localStorage.removeItem('cart');
      set({ items: [], totalQty: 0 });},
    updateQty: (productId, qty) => set(state => {
    // If qty <= 0, remove the item
    if (qty <= 0) {
      const items = state.items.filter(it => it.productId !== productId);
      return persistCart(items);
    }
    // Otherwise update the quantity
    const items = state.items.map(it => it.productId === productId ? { ...it, quantity: qty } : it);
    return persistCart(items);
    
  })

}));