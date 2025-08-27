import { create } from "zustand"
import type { Product, ID } from "@/type"

type ProductState = {
  products: Product[]
  setProducts: (list: Product[]) => void
  reduceStock: (id: ID, qty: number) => void
  increaseStock: (id: ID, qty: number) => void
}

/**
 * Store for managing product list and stock availability.
 * Provides actions to initialize products, decrease stock when added to cart,
 * and increase stock when items are removed from cart.
 */
export const useProducts = create<ProductState>((set) => ({
  products: [],

  /**
   * Input: list of products (from API or mock data)
   * Process: replace current state with new product list
   * Output: updated products state
   */
  setProducts: (list) => set({ products: list }),

  /**
   * Input: product id, quantity to reduce
   * Process: find product and subtract qty from stock (if stock is sufficient)
   * Output: updated products with reduced stock
   */
  reduceStock: (id, qty) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id && p.stock >= qty
          ? { ...p, stock: p.stock - qty }
          : p
      ),
    })),

  /**
   * Input: product id, quantity to restore
   * Process: find product and add qty back to stock
   * Output: updated products with increased stock
   */
  increaseStock: (id, qty) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, stock: p.stock + qty } : p
      ),
    })),
}))