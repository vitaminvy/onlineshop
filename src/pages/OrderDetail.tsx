// src/pages/OrderDetail.tsx
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@/components/layout/Container';
import { formatCurrency } from '@/lib/format';

type OrderSnapshot = {
  id: string;
  createdAt: string;
  subtotal: number;
  items: Array<{ id: string; name: string; qty: number; price: number }>;
  customer?: { fullName: string; email: string; phone: string; address: string };
};


/**
 * Input: order id from route
 * Process: lookup in localStorage 'orders'
 * Output: order detail page
 */
export default function OrderDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const order = useMemo(() => {
    try {
      const raw = localStorage.getItem('orders');
            const list: OrderSnapshot[] = raw ? (JSON.parse(raw) as OrderSnapshot[]) : [];
      return list.find(o => o.id === id) ?? null;
    } catch(e) {
        void e;
      return null;
    }
  }, [id]);

    useEffect(() => {
        if (!order) {
        navigate('/orders');
        }
    }, [order, navigate]);

    useEffect(() => {
        document.title = order ? `Order #${order.id} — OnlineShop` : 'Orders — OnlineShop';
    }, [order]);

    if (!order) {
        return null;
    }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-2xl font-semibold text-ink">Order #{order.id}</h1>
        <p className="mt-1 text-gray-600">
            {new Date(order.createdAt).toLocaleString()} • {order.items.reduce((a, it) => a + it.qty, 0)} items
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="rounded-lg border bg-white p-4 lg:col-span-7">
            <h2 className="mb-3 text-lg font-semibold">Items</h2>
            <div className="space-y-2">
                
                {order.items.map((it: OrderSnapshot['items'][number]) => (
                <div key={it.id} className="flex items-center justify-between text-sm">
                  <div className="truncate">
                    <span className="font-medium">{it.name}</span>
                    <span className="ml-2 text-gray-500">× {it.qty}</span>
                  </div>
                  <div className="shrink-0">{formatCurrency(it.price * it.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t pt-3 text-base">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary">{formatCurrency(order.subtotal)}</span>
            </div>
          </div>

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

        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            aria-label="Back to orders list"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"

          >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Orders
          </button>
        </div>
      </div>
    </Container>
  );
}