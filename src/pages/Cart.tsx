// src/pages/Cart.tsx
import { Link } from 'react-router-dom';
import Container from '@/components/layout/Container';
import { useCart } from '@/store/cart';
import { formatCurrency } from '@/lib/format';
import { products as SOURCE } from '@/data/products';
import type { CartItem } from '@/type';

/**
 * Input: cart store
 * Process: read items; join with product data; compute totals
 * Output: cart list with basic summary and empty state
 */
export default function Cart() {
  type ProductMeta = typeof SOURCE[number];
  type CartLine = { productId: string; qty: number; product?: ProductMeta };

  // Build a quick lookup map for product metadata
  const productMap = SOURCE.reduce<Record<string, ProductMeta>>((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {});

  // Read cart state (typed, no any)
  const items = useCart(s => ((s as { items?: CartItem[] }).items) ?? []);
  const removeFromCart = useCart(s => (s as { removeFromCart?: (id: string) => void }).removeFromCart);
  const clearCart = useCart(s => s.clearCart);
  /**
   * Input: cart item (possibly legacy shape)
   * Process: return numeric quantity from either `quantity` or legacy `qty`
   * Output: number
   */
  const readQty = (it: Partial<CartItem> & { qty?: number } | undefined): number =>
    typeof it?.quantity === 'number'
      ? it!.quantity
      : typeof it?.qty === 'number'
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
  if (!lines.length) {
    return (
      <Container>
        <div className="py-10">
          <h1 className="text-xl font-semibold">Your Cart</h1>
          <p className="text-gray-600">Your cart is empty.</p>
          <div className="mt-4">
            <Link
              to="/"
              className="inline-block rounded-md bg-primary px-4 py-2 text-white hover:opacity-90"
            >
              Continue Shopping
            </Link>
          </div>
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
                  src={l.product?.thumbnail || l.product?.images?.[0] || '/img/placeholder.jpg'}
                  alt={l.product?.name ?? l.productId}
                  className="h-16 w-16 rounded object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${l.product?.slug ?? ''}`}
                    className="line-clamp-1 font-medium hover:underline"
                  >
                    {l.product?.name ?? l.productId}
                  </Link>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(l.product?.price ?? 0)}
                  </div>
                  <div className="text-sm">
                    Qty: <span className="font-medium">{l.qty}</span>
                  </div>
                </div>

                {typeof removeFromCart === 'function' && (
                  <button
                    onClick={() => removeFromCart(l.productId)}
                    className="rounded-md border bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    title="Remove"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
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
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <button
                className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:bg-primary disabled:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                disabled
                title="Checkout flow will be implemented later"
              >
                Checkout
              </button>
              {typeof clearCart === 'function' && (
                <button
                onClick={() => clearCart()}
                  className="mt-2 w-full rounded-md border bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"

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