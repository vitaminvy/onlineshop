// src/pages/Checkout.tsx
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@/components/layout/Container';
import { useCart } from '@/store/cart';
import { products as SOURCE } from '@/data/products';
import { formatCurrency } from '@/lib/format';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
/**
 * Checkout page: shipping form + order summary
 *
 * Input: cart items from store; user shipping info via form
 * Process: validate form; compute totals; (mock) submit and clear cart
 * Output: confirmation redirect (mock) and emptied cart
 */
export default function Checkout() {
  type ProductMeta = typeof SOURCE[number];
  type CartLine = { productId: string; qty: number; product?: ProductMeta };

  const navigate = useNavigate();
  const items = useCart(s => s.items ?? []);
  const clearCart = useCart(s => s.clearCart);

  // Build lookup map for product meta
  const productMap = useMemo(() => {
    return SOURCE.reduce<Record<string, ProductMeta>>((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});
  }, []);

  // Convert store items → UI lines
  const readQty = (it: { quantity?: number; qty?: number } | undefined): number =>
    typeof it?.quantity === 'number' ? it.quantity! :
    typeof it?.qty === 'number' ? Number(it.qty) : 0;

  const lines: CartLine[] = useMemo(
    () => items.map((it) => ({
      ...it,
      qty: readQty(it),
      product: productMap[it.productId],
    })),
    [items, productMap]
  );

  const subtotal = useMemo(
    () => lines.reduce((acc, l) => acc + (l.product?.price ?? 0) * l.qty, 0),
    [lines]
  );

  // Form
  type FormData = {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    note?: string;
  };

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<FormData>({
  defaultValues: { fullName: '', email: '', phone: '', address: '', note: '' }
});
/**
   * Input: none
   * Process: entering Checkout starts a new order; remove previous snapshot
   * Output: clean 'lastOrder' in localStorage
   */
  useEffect(() => {
    try {
      localStorage.removeItem('lastOrder');
    } catch (e) {
      void e; // ignore error
    }
  }, []);
  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('checkoutForm');
      if (raw) reset(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [reset]);

  // Auto-save form changes to localStorage
  useEffect(() => {
    const sub = watch((values) => {
      try {
        localStorage.setItem('checkoutForm', JSON.stringify(values));
      } catch { /* ignore */ }
    });
    return () => sub.unsubscribe();
  }, [watch]);
  /**
   * Input: valid form values
   * Process: (mock) send order, clear cart, navigate to home
   * Output: redirect to home with simple alert
   */
  const onSubmit = async (data: FormData) => {    // Validate stock before placing order
    const over = lines.filter(l => typeof l.product?.stock === 'number' && l.qty > (l.product?.stock ?? 0));
    if (over.length) {
        toast.error('Some items exceed available stock. Please adjust quantities in your cart.');
        return;
    }
    // mock submit
    await new Promise(r => setTimeout(r, 400));
      // Build order snapshot and persist
    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      subtotal,
      items: lines.map(l => ({
        id: l.productId,
        name: l.product?.name ?? l.productId,
        qty: l.qty,
        price: l.product?.price ?? 0,
      })),
      customer: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    };
              /**
   * Input: current order object
   * Process: append to 'orders' list in localStorage (history)
   * Output: persisted order history
   */
  type OrderSnapshot = {
    id: string;
    createdAt: string;
    subtotal: number;
    items: Array<{ id: string; name: string; qty: number; price: number }>;
    customer?: { fullName: string; email: string; phone: string; address: string };
  };
  try {
    const rawList = localStorage.getItem('orders');
    const list: OrderSnapshot[] = rawList ? (JSON.parse(rawList) as OrderSnapshot[]) : [];
    // Prevent duplicate by id (re-submit)
    if (!list.some(o => o.id === order.id)) list.unshift(order);
    localStorage.setItem('orders', JSON.stringify(list));
  } catch (e) {
    // ignore persist errors (e.g., storage quota or private mode)
    void e;
  }
    

    toast.success(`Order placed! Total: ${formatCurrency(subtotal)}`);
    localStorage.removeItem('checkoutForm');
     
    clearCart?.();
    navigate('/order-success');
  };

  if (!lines.length) {
    return (
      <Container>
        <div className="py-10">
          <h1 className="text-xl font-semibold">Checkout</h1>
          <p className="text-gray-600">Your cart is empty.</p>
          <div className="mt-4">
            <button
              onClick={() => navigate('/')}
              className="inline-block rounded-md bg-primary px-4 py-2 text-white hover:opacity-90"
            >Continue Shopping</button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-xl font-semibold">Checkout</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Left: shipping form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border bg-white p-4 lg:col-span-7">
            <h2 className="text-lg font-semibold">Shipping Information</h2>

            <div>
              <label className="block text-sm font-medium">Full name</label>
              <input
                {...register('fullName', { required: 'Full name is required' })}
                className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:border-primary"
                placeholder="Nguyen Van A"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                     {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email',
                    },
                  })}
                  className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:border-primary"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                    {...register('phone', {
                    required: 'Phone is required',
                    pattern: {
                      value: /^[0-9+\-\s]{8,}$/,
                      message: 'Invalid phone',
                    },
                    })}
                    className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:border-primary"
                    placeholder="0901234567"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Address</label>
              <textarea
                {...register('address', { required: 'Address is required' })}
                className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:border-primary"
                placeholder="123 Le Loi, Quan 1, TP.HCM"
                rows={3}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Note (optional)</label>
              <textarea
                {...register('note')}
                className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:border-primary"
                placeholder="Leave at the door…"
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? 'Placing Order…' : 'Place Order'}
            </button>
          </form>

          {/* Right: order summary */}
          <div className="lg:col-span-5">
            <div className="rounded-lg border bg-white p-4">
              <h2 className="mb-3 text-lg font-semibold">Order Summary</h2>
           <p className="mb-2 text-sm text-gray-600">
                Items: <span className="font-medium">{lines.reduce((a, l) => a + l.qty, 0)}</span>
                <span className="mx-2">•</span>
                Subtotal: <span className="font-medium">{formatCurrency(subtotal)}</span>
              </p>
              <div className="space-y-3">
                {lines.map((l) => (
                  <div key={l.productId} className="flex items-start gap-3">
                    <img
                      src={l.product?.thumbnail || l.product?.images?.[0] || '/img/placeholder.jpg'}
                      alt={l.product?.name ?? l.productId}
                      className="h-14 w-14 rounded object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-1 text-sm font-medium">{l.product?.name ?? l.productId}</div>
                      <div className="text-xs text-gray-500">Qty: {l.qty}</div>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatCurrency((l.product?.price ?? 0) * l.qty)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                {/* Shipping/Tax placeholders */}
                <div className="mt-1 flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="mt-1 flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>—</span>
                </div>
                <div className="mt-3 flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">{formatCurrency(subtotal)}</span>
                </div>

                    <button onClick={() => navigate('/cart')}
                         className="mt-4 inline-block rounded-md border bg-white px-4 py-2 text-sm hover:bg-gray-50"
                         type="button"
                >
                             Back to Cart
                    </button>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}