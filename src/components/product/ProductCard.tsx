import { Link } from 'react-router-dom';
import type { Product } from '@/type';
import { formatCurrency } from '@/lib/format';

/**
 * Compact product card with image, name and price.
 */
export default function ProductCard({ p }: { p: Product }) {
  /**
   * Input: product model
   * Process: render cover image, clipped name, and price
   * Output: navigable card linking to product detail
   */
  return (
    <Link
      to={`/product/${p.slug}`}
      className="group rounded-lg border bg-white p-3 shadow-card transition hover:shadow"
    >
      <img
        src={p.thumbnail}
        alt={p.name}
        className="aspect-square w-full rounded-md object-cover"
      />
      <div className="mt-3 line-clamp-2 min-h-[40px] text-sm font-medium text-ink group-hover:underline">
        {p.name}
      </div>
      <div className="mt-1 text-sm text-gray-500">{p.brand}</div>
      <div className="mt-1 text-base font-semibold text-primary">
        {formatCurrency(p.price)}
      </div>
      {p.stock <= 0 ? (
        <div className="mt-2 inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Out of stock</div>
      ) : (
        <div className="mt-2 inline-flex rounded bg-green-50 px-2 py-0.5 text-xs text-green-700">In stock</div>
      )}
    </Link>
  );
}