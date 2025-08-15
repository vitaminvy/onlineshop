// src/pages/Products.tsx
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import Container from '@/components/layout/Container';
import { getProducts } from '@/lib/fetcher';
import type { Product } from '@/type';
import ProductCard from '@/components/product/ProductCard';

/** Strongly-typed sort options for the select */
type SortOption = 'name-asc' | 'price-asc' | 'price-desc';

/** Label + value for rendering the select without any casts */
const SORT_OPTIONS = [
  { label: 'Name A→Z', value: 'name-asc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
] as const;

/**
 * Input: raw option value from <select>
 * Process: ensure the value is a valid SortOption (type guard)
 * Output: narrowed SortOption or null
 */
function toSortOption(val: string): SortOption | null {
  return SORT_OPTIONS.find(o => o.value === val)?.value ?? null;
}

/**
 * Input: none (initial mount)
 * Process: list products with typed client-side sorting
 * Output: grid of ProductCard sorted by the selected option
 */
export default function Products() {
  const [sort, setSort] = useState<SortOption>('name-asc');
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Input: none
   * Process: fetch products from local mock API; set loading state
   * Output: populated `data` array or empty on failure
   */
  useEffect(() => {
    let alive = true;
    setLoading(true);
    getProducts()
      .then(res => {
        if (!alive) return;
        setData(res);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  /**
   * Input: data[], sort
   * Process: sort client-side with typed comparators
   * Output: sorted product list for rendering
   */
  const sorted = useMemo(() => {
    const arr = [...data];
    const comparators: Record<SortOption, (a: Product, b: Product) => number> = {
      'name-asc': (a, b) => a.name.localeCompare(b.name),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
    };
    return arr.sort(comparators[sort]);
  }, [data, sort]);

  /**
   * Input: user selection change event
   * Process: narrow e.target.value to SortOption via guard
   * Output: update sort state without using `as any`
   */
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const next = toSortOption(e.target.value);
    if (next) setSort(next);
  };

  return (
    <Container>
      {/* Sort control */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Sort by:</span>
          <select
            value={sort}
            onChange={handleSortChange}
            className="h-9 rounded-md border border-gray-300 px-2"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-10">Loading products...</div>
      ) : sorted.length === 0 ? (
        <div className="py-10 text-gray-600">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {sorted.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </Container>
  );
}