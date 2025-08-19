import { useState } from 'react';
import { useParams, Link,useSearchParams } from 'react-router-dom';
import Container from '@/components/layout/Container';
import useProductsByCategorySlug from '@/hooks/useProductsByCategory';
import { formatCurrency } from '@/lib/format';


/**
   * Input: sorted list and optional min/max (string from query)
   * Process: coerce to numbers and filter by inclusive range
   * Output: filtered array
   */
function applyPriceFilter<T extends { price: number }>(list: T[], minStr: string | null, maxStr: string | null) {
  const min = minStr ? Number(minStr) : -Infinity;
  const max = maxStr ? Number(maxStr) : Infinity;
  return list.filter(p => p.price >= min && p.price <= max);
}

/**
  * Input: product list and sort key
 * Process: clone and sort by selected strategy
 * Output: sorted array for rendering
 */
function applySort<T extends { price: number; createdAt?: number }>(list: T[], sort: string) {
  const arr = [...list];
  switch (sort) {
    case 'price_asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'newest':
      return arr.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    default:
      return arr; // relevance (keep incoming order)
  }
}

/**
 * Small sort control bound to URL query string.
 */
function SortSelect() {
  const [params, setParams] = useSearchParams();
  const sort = params.get('sort') ?? 'relevance';

  /**
   * Input: select value
   * Process: update query param 'sort' and reset page to 1
   * Output: new URL reflecting selected sort
   */
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    params.set('sort', e.target.value);
    params.set('page', '1');
    setParams(params, { replace: true });
  };

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Sort</span>
      <select
        value={sort}
        onChange={onChange}
        className="rounded-md border px-2 py-1 text-sm"
      >
        <option value="relevance">Relevance</option>
        <option value="price_asc">Price ↑</option>
        <option value="price_desc">Price ↓</option>
        <option value="newest">Newest</option>
      </select>
    </label>
  );
}

/**
 * Price range filter bound to URL query string.
 */
function PriceFilter() {
  const [params, setParams] = useSearchParams();
  const [min, setMin] = useState(params.get('min') ?? '');
  const [max, setMax] = useState(params.get('max') ?? '');

  /**
   * Input: local min/max
   * Process: write query params and reset page to 1
   * Output: URL reflects filter; list re-renders
   */
  const apply = () => {
    if (min) params.set('min', min); else params.delete('min');
    if (max) params.set('max', max); else params.delete('max');
    params.set('page', '1');
    setParams(params, { replace: true });
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Price</span>
      <input
        type="number"
        placeholder="Min"
        value={min}
        onChange={e => setMin(e.target.value)}
        className="w-24 rounded-md border px-2 py-1"
      />
      <span>—</span>
      <input
        type="number"
        placeholder="Max"
        value={max}
        onChange={e => setMax(e.target.value)}
        className="w-24 rounded-md border px-2 py-1"
      />
      <button
        type="button"
        onClick={apply}
        className="rounded-md bg-primary px-3 py-1 text-white hover:opacity-90"
      >
        Apply
      </button>
    </div>
  );
}

/**
 * Simple pager tied to query string.
 */
function Pager({ page, totalPages }: { page: number; totalPages: number }) {
  const [params, setParams] = useSearchParams();
  const go = (next: number) => {
    params.set('page', String(next));
    setParams(params, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => go(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded-md border bg-white px-3 py-1 text-sm disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-sm text-gray-600">
        Page {page} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => go(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded-md border bg-white px-3 py-1 text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

/**
 */
export default function CategoryPage() {
  const { slug = '' } = useParams();
  const isAll = slug === 'all';
  const { data, loading, error } = useProductsByCategorySlug(slug);
  const [params] = useSearchParams();
  const sort = params.get('sort') ?? 'relevance';
  const sorted = applySort(data, sort);

  // Price filter
  const minQ = params.get('min');
  const maxQ = params.get('max');
  const filtered = applyPriceFilter(sorted, minQ, maxQ);

  // Pagination (client)
  const page = Math.max(1, Number(params.get('page') ?? '1'));
  const pageSize = Math.max(1, Number(params.get('pageSize') ?? '12'));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  /**
   * Input: category slug from route
   * Process: fetch products of that category; handle loading/empty
   * Output: grid of product cards linking to details
   */
  if (!slug) {
    return <Container><div className="py-10">Missing category parameter</div></Container>;
  }
  if (loading) {
    return <Container><div className="py-10">Loading...</div></Container>;
  }
  if (error) {
    return <Container><div className="py-10 text-red-600">{error}</div></Container>;
  }

  return (
    <Container>
      <section className="pt-2 pb-8">
        <div className="sticky top-[96px] z-40 bg-gray-50/90 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80">
            <h2 className="px-4 pt-[15px] pb-3  text-xl font-semibold">
            {isAll ? 'All Products' : `Category: ${slug}`}
            </h2>
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="text-sm text-gray-600">{filtered.length} result(s)</div>
              <SortSelect />
            </div>
            <div className="px-4 pb-3">
              <PriceFilter />
            </div>
        </div>
        
        {filtered.length === 0 ? (
          <div className="text-gray-500">No products found in this category.</div>
        ) : (
        <>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {paged.map(p => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="group block overflow-hidden rounded-lg border bg-white transition hover:shadow"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-medium text-gray-900">{p.name}</h3>
                  <p className="text-xs text-gray-500">{p.brand}</p>
                  {/* Stock line */}
                  {typeof p.stock === 'number' && (
                    p.stock === 0 ? (
                      <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                        Out of stock
                      </span>
                    ) : p.stock <= 5 && p.stock !== 0 ? (
                      <span className="mt-1 inline-block rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        Only {p.stock} left
                      </span>
                    ) : (
                      <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
                        Stock: {p.stock}
                      </span>
                    )
                  )}
                  
        
                  <p className="text-base font-semibold text-emerald-600">
                    {formatCurrency(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Pager page={page} totalPages={totalPages} />
          </>
        )}
      </section>
    </Container>
  );
}