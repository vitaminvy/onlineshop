// src/pages/Orders.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@/components/layout/Container';
import { formatCurrency } from '@/lib/format';

/**
 * Input: localStorage 'orders'
 * Process: read + sort by createdAt desc
 * Output: compact order list with link to detail
 */
export default function Orders() {
  const navigate = useNavigate();

  type OrderRow = {
    id: string;
    createdAt: string;
    subtotal: number;
    items: Array<{ id: string; name: string; qty: number; price: number }>;
    customer?: { fullName: string; email: string; phone: string; address: string };
  };

    const [orders, setOrders] = useState<OrderRow[]>([]);
    const itemCount = (o: OrderRow) => o.items.reduce((a, it) => a + it.qty, 0);



  useEffect(() => {
    try {
      const raw = localStorage.getItem('orders');
      const list: OrderRow[] = raw ? (JSON.parse(raw) as OrderRow[]) : [];
      list.sort((a: OrderRow, b: OrderRow) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(list);
    } catch {
      setOrders([]);
    }
  }, []);

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-2xl font-semibold text-ink">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-lg border bg-white p-6 text-gray-600">
            No orders yet. Place an order and it will appear here.
          </div>
        ) : (
          <div className="mt-6 divide-y rounded-lg border bg-white">
            {orders.map(o => (
             <button
                type="button"
                key={o.id}
                onClick={() => navigate(`/orders/${o.id}`)}
                aria-label={`Open order ${o.id}`}
                className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:bg-gray-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                <div className="truncate">
                    <div className="font-medium text-ink group-hover:text-primary">#{o.id}</div>
                    <div className="text-sm text-gray-600">
                    {new Date(o.createdAt).toLocaleString()} • {itemCount(o)} items
                    </div>
                </div>
                <div className="shrink-0 font-semibold text-ink group-hover:text-primary">
                    {formatCurrency(o.subtotal)}
                </div>
            </button>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}