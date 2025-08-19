// src/pages/OrderSuccess.tsx
import { useNavigate } from 'react-router-dom';
import Container from '@/components/layout/Container';
import { formatCurrency } from '@/lib/format';

/**
 * Input: lastOrder (localStorage)
 * Process: read & render summary; provide CTAs
 * Output: order confirmation page
 */
export default function OrderSuccess() {
  const navigate = useNavigate();

  // Read last order snapshot
  const raw = typeof window !== 'undefined' ? localStorage.getItem('lastOrder') : null;
  const order = raw ? JSON.parse(raw) as {
    id: string;
    createdAt: string;
    subtotal: number;
    items: Array<{ id: string; name: string; qty: number; price: number }>;
    customer?: { fullName: string; email: string; phone: string; address: string };
  } : null;

  // If nothing -> back home
  if (!order) {
    navigate('/');
    return null;
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-2xl font-semibold text-ink">Thank you for your order!</h1>
        <p className="mt-1 text-gray-600">
          Order ID: <span className="font-medium">{order.id}</span> •{' '}
          {new Date(order.createdAt).toLocaleString()}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Left: items */}
          <div className="rounded-lg border bg-white p-4 lg:col-span-7">
            <h2 className="mb-3 text-lg font-semibold">Items</h2>
            <div className="space-y-2">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-sm">
                  <div className="truncate">
                    <span className="font-medium">{it.name}</span>
                    <span className="ml-2 text-gray-500">× {it.qty}</span>
                  </div>
                  <div className="shrink-0">
                    {formatCurrency(it.price * it.qty)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-3 flex justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary">{formatCurrency(order.subtotal)}</span>
            </div>
          </div>

          {/* Right: shipping */}
          <div className="rounded-lg border bg-white p-4 lg:col-span-5">
            <h2 className="mb-3 text-lg font-semibold">Shipping</h2>
            {order.customer ? (
              <div className="text-sm leading-6 text-gray-700">
                <div><span className="font-medium">Name:</span> {order.customer.fullName}</div>
                <div><span className="font-medium">Email:</span> {order.customer.email}</div>
                <div><span className="font-medium">Phone:</span> {order.customer.phone}</div>
                <div><span className="font-medium">Address:</span> {order.customer.address}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">Shipping info not available.</div>
            )}
          </div>
        </div>

     <div className="mt-6 flex gap-3">
        <button
            onClick={() => {
            try { localStorage.removeItem('lastOrder'); } catch { /* empty */ }
            navigate('/');
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:opacity-90"

        >
            Continue Shopping
        </button>

    </div>
</div>
    </Container>
  );
}