// src/pages/Cart.tsx
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
  const updateQty = useCart(s => (s as { updateQty?: (id: string, qty: number) => void }).updateQty);
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
              <button
                  onClick={() => navigate('/')}
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-center text-white hover:opacity-90"
                  type="button">
                  Continue Shopping
              </button> 
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
                  {typeof l.product?.stock === 'number' && (
                  <div className="text-xs text-gray-500">Stock: {l.product?.stock}
                  </div>
  )}
                    <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty?.(l.productId, Math.max(1, l.qty - 1))}
                      className="h-8 w-8 rounded border bg-white text-sm hover:bg-gray-50"
                      aria-label="Decrease quantity"
                      type="button"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={l.product?.stock ?? 9999}
                      value={l.qty}
                      onChange={(e) => {
                        const v = parseInt(e.target.value || '0', 10);
                        const next = Number.isNaN(v) ? 1 : Math.max(1, Math.min(v, l.product?.stock ?? 9999));
                        updateQty?.(l.productId, next);
                      }}
                      className="h-8 w-14 rounded border px-2 text-center text-sm outline-none focus:border-primary"
                      aria-label="Quantity"
                    />
                    <button
                      onClick={() => updateQty?.(l.productId, Math.min(l.product?.stock ?? Infinity, l.qty + 1))}
                      className="h-8 w-8 rounded border bg-white text-sm hover:bg-gray-50"
                      aria-label="Increase quantity"
                      type="button"
                    >
                      +
                    </button>
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
           <div className="mt-4">
               <button
                    onClick={() => navigate('/')}
                    className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-center text-white hover:opacity-90"
                    type="button" 
                    >
                      Continue Shopping
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
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
             <button
                onClick={() => navigate('/checkout')}
                className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-center text-white hover:opacity-90"
                title="Go to Checkout"
              >
                Checkout
              </button>
              {typeof clearCart === 'function' && (
                <button
                onClick={() => clearCart()}
                  className="mt-2 w-full rounded-md  bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"

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