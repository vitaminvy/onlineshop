import Container from '@/components/layout/Container';
import { useWishlist } from '@/store/wishlist';
import { products as SOURCE } from '@/data/products';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/format';

/**
 * Input: wishlist ids
 * Process: join with products; render grid or empty state
 * Output: wishlist page
 */
export default function Wishlist() {
  const ids = useWishlist(s => s.ids);
  const list = SOURCE.filter(p => ids.includes(p.id));

  if (list.length === 0) {
    return (
      <Container>
        <h2 className="py-4 text-xl font-semibold">Your Wishlist</h2>
        <div className="rounded-lg border bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="text-lg font-medium text-ink">No items in wishlist</div>
          <p className="mt-1 text-sm text-gray-600">Browse products and tap the heart icon to save.</p>
          <Link to="/category/all" className="mt-6 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24" className="h-4 w-4">
              <path d="M5 12h14M12 5l-7 7 7 7" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="py-4 text-xl font-semibold">Your Wishlist</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.map(p => (
          <Link
            key={p.id}
            to={`/product/${p.slug}`}
            className="group block overflow-hidden rounded-lg border bg-white transition hover:shadow"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
              <img
                src={p.thumbnail ?? p.images?.[0] ?? ''}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between">
                <h3 className="line-clamp-1 text-sm font-medium text-gray-900">{p.name}</h3>
              </div>
              <p className="text-xs text-gray-500">{p.brand}</p>
              <p className="text-base font-semibold text-emerald-600">{formatCurrency(p.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}