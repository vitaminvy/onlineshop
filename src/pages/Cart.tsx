// src/pages/Cart.tsx
import { Link, useNavigate } from "react-router-dom";
import Container from "@/components/layout/Container";
import { useCart } from "@/store/cart";
import { formatCurrency } from "@/lib/format";
import { products as SOURCE } from "@/data/products";
import type { CartItem } from "@/type";
import { toast } from "sonner";
import { useState } from "react";

/**
 * Input: cart store
 * Process: read items; join with product data; compute totals
 * Output: cart list with basic summary and empty state
 */
export default function Cart() {
  const navigate = useNavigate();
  // Local draft for typing large numbers without being reset by controlled value
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});
  type ProductMeta = (typeof SOURCE)[number];
  type CartLine = { productId: string; qty: number; product?: ProductMeta };

  // Build a quick lookup map for product metadata
  const productMap = SOURCE.reduce<Record<string, ProductMeta>>((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {});

  // Read cart state (typed, no any)
  const items = useCart((s) => (s as { items?: CartItem[] }).items ?? []);
  const removeFromCart = useCart(
    (s) => (s as { removeFromCart?: (id: string) => void }).removeFromCart
  );
  const updateQty = useCart(
    (s) => (s as { updateQty?: (id: string, qty: number) => void }).updateQty
  );
  const clearCart = useCart((s) => s.clearCart);
  /**
   * Input: cart item (possibly legacy shape)
   * Process: return numeric quantity from either `quantity` or legacy `qty`
   * Output: number
   */
  const readQty = (
    it: (Partial<CartItem> & { qty?: number }) | undefined
  ): number =>
    typeof it?.quantity === "number"
      ? it!.quantity
      : typeof it?.qty === "number"
      ? Number(it!.qty)
      : 0;

  // Join items with product data
  const lines: CartLine[] = items.map((it) => ({
    ...it,
    qty: readQty(it),
    product: productMap[it.productId],
  }));

  // Totals
  const totalItems = lines.reduce((acc: number, l: CartLine) => acc + l.qty, 0);
  const subtotal = lines.reduce(
    (acc: number, l: CartLine) => acc + (l.product?.price ?? 0) * l.qty,
    0
  );

  // Empty state
  if (lines.length === 0) {
    return (
      <Container>
        <div className="rounded-lg border bg-white p-10 text-center">
          {/* Icon minh hoạ */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6h15l-1.5 9h-12L6 6Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M6 6L5 3H2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="text-lg font-medium text-ink">Your cart is empty</div>

          <Link
            to="/category/all"
            className="mt-6 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            onClick={() => {
              try {
                localStorage.removeItem("lastOrder");
              } catch {
                /* empty */
              }
            }}
          >
            Browse Products
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-xl font-semibold">Your Cart</h1>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          {/* Line items */}
          <div className="space-y-3 lg:col-span-8">
            {lines.map((l: CartLine) => (
              <div
                key={l.productId}
                className="flex items-center gap-3 rounded-lg border bg-white p-3"
              >
                <img
                  src={
                    l.product?.thumbnail ||
                    l.product?.images?.[0] ||
                    "/img/placeholder.jpg"
                  }
                  alt={l.product?.name ?? l.productId}
                  className="h-16 w-16 rounded object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${l.product?.slug ?? ""}`}
                    className="line-clamp-1 font-medium hover:underline"
                  >
                    {l.product?.name ?? l.productId}
                  </Link>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(l.product?.price ?? 0)}
                  </div>
                  {typeof l.product?.stock === "number" && (
                    <div className="text-xs text-gray-500">
                      Stock: {l.product?.stock}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        /**
                         * Input: current line qty
                         * Process: decrement; if next <= 0 remove item; else update qty
                         * Output: updated cart or removed line with toast
                         */
                        const next = l.qty - 1;
                        if (next <= 0) {
                          removeFromCart?.(l.productId);
                          toast.success(
                            `Removed “${l.product?.name ?? "Item"}”`
                          );
                        } else {
                          updateQty?.(l.productId, next);
                        }
                        setDraftQty((prev) => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          const { [l.productId]: _removed, ...rest } = prev;
                          return rest;
                        });
                      }}
                      className="h-8 w-8 rounded border bg-white text-sm hover:bg-gray-50"
                      aria-label="Decrease quantity"
                      type="button"
                    >
                      −
                    </button>
                    <input
                      max={l.product?.stock ?? 9999}
                      value={draftQty[l.productId] ?? String(l.qty)}
                      onChange={(e) => {
                        /**
                         * Input: user-typed value (may be empty while composing)
                         * Process: store to local draft without mutating cart yet
                         * Output: draft reflects what's typed; commit on blur
                         */
                        setDraftQty((prev) => ({
                          ...prev,
                          [l.productId]: e.target.value,
                        }));
                      }}
                      onBlur={(e) => {
                        /**
                         * Input: draft value on blur
                         * Process: if empty -> revert; if <=0 -> remove; else clamp to stock and update
                         * Output: committed cart quantity or removed line; clears draft
                         */
                        const raw = (e.target.value ?? "").trim();
                        const stock =
                          l.product?.stock ?? Number.POSITIVE_INFINITY;
                        // Clear draft helper
                        const clearDraft = () =>
                          setDraftQty((prev) => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { [l.productId]: _, ...rest } = prev;
                            return rest;
                          });

                        if (raw === "") {
                          // Revert to current cart value on empty
                          clearDraft();
                          return;
                        }
                        const v = Number(raw);
                        if (!Number.isFinite(v)) {
                          clearDraft();
                          return;
                        }
                        if (v <= 0) {
                          removeFromCart?.(l.productId);
                          toast.success(
                            `Removed “${l.product?.name ?? "Item"}”`
                          );
                          clearDraft();
                          return;
                        }
                        const next = Math.min(
                          v,
                          stock === Infinity ? v : stock
                        );
                        updateQty?.(l.productId, next);
                        clearDraft();
                      }}
                      className="h-8 w-14 rounded border px-2 text-center text-sm outline-none focus:border-primary"
                      aria-label="Quantity"
                    />
                    <button
                      onClick={() => {
                        updateQty?.(
                          l.productId,
                          Math.min(l.product?.stock ?? Infinity, l.qty + 1)
                        );
                        setDraftQty((prev) => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          const { [l.productId]: _, ...rest } = prev;
                          return rest;
                        });
                      }}
                      disabled={
                        (l.product?.stock ?? Number.POSITIVE_INFINITY) <= l.qty
                      }
                      aria-disabled={
                        (l.product?.stock ?? Number.POSITIVE_INFINITY) <= l.qty
                      }
                      className="h-8 w-8 rounded border bg-white text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Increase quantity"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                {typeof removeFromCart === "function" && (
                  <button
                    onClick={() => {
                      removeFromCart(l.productId);
                      toast.success(`Removed “${l.product?.name ?? "Item"}”`);
                    }}
                    className="rounded-md border bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    title="Remove"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate("/category/all")}
                aria-label="Back to orders list"
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 19l-7-7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 12h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Continue shopping
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-lg border bg-white p-4">
              <h2 className="mb-3 text-lg font-semibold">Order Summary</h2>
              <div className="flex justify-between text-sm">
                <span>Items</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-center text-white hover:opacity-90"
                title="Go to Checkout"
              >
                Checkout
              </button>
              {typeof clearCart === "function" && (
                <button
                  onClick={() => {
                    /**
                     * Input: none
                     * Process: clear cart store + remove checkout draft
                     * Output: empty cart and no leftover form draft
                     */
                    clearCart();
                    try {
                      localStorage.removeItem("checkoutForm");
                      localStorage.removeItem("lastOrder");
                      // eslint-disable-next-line no-empty
                    } catch {}
                    toast.success("Cart cleared");
                  }}
                  className="mt-2 w-full rounded-md bg-red-500 px-4 py-2 text-white hover:opacity-90"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
