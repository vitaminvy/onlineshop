import { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import Container from "@/components/layout/Container";
import useProductsByCategorySlug from "@/hooks/useProductsByCategory";
import { useCompare } from "@/store/compare";

import CompareModal from "@/components/compare/CompareModal";
import ProductCard from "@/components/product/ProductCard";

/**
 * Input: sorted list and optional min/max (string from query)
 * Process: coerce to numbers and filter by inclusive range
 * Output: filtered array
 */
function applyPriceFilter<T extends { price: number }>(
  list: T[],
  minStr: string | null,
  maxStr: string | null
) {
  const min = minStr ? Number(minStr) : -Infinity;
  const max = maxStr ? Number(maxStr) : Infinity;
  return list.filter((p) => p.price >= min && p.price <= max);
}

/**
 * Input: product list and sort key
 * Process: clone and sort by selected strategy
 * Output: sorted array for rendering
 */
function applySort<T extends { price: number; createdAt?: number }>(
  list: T[],
  sort: string
) {
  const arr = [...list];
  switch (sort) {
    case "price_asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price_desc":
      return arr.sort((a, b) => b.price - a.price);
    case "newest":
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
  const sort = params.get("sort") ?? "relevance";

  /**
   * Input: select value
   * Process: update query param 'sort' and reset page to 1
   * Output: new URL reflecting selected sort
   */
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    params.set("sort", e.target.value);
    params.set("page", "1");
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
  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");

  /**
   * Input: local min/max
   * Process: write query params and reset page to 1
   * Output: URL reflects filter; list re-renders
   */
  const apply = () => {
    if (min) params.set("min", min);
    else params.delete("min");
    if (max) params.set("max", max);
    else params.delete("max");
    params.set("page", "1");
    setParams(params, { replace: true });
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Price</span>
      <input
        type="number"
        placeholder="Min"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        className="w-24 rounded-md border px-2 py-1"
      />
      <span>—</span>
      <input
        type="number"
        placeholder="Max"
        value={max}
        onChange={(e) => setMax(e.target.value)}
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
    params.set("page", String(next));
    setParams(params, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
 * Main Category Page component
 */

export default function CategoryPage() {
  const { slug = "" } = useParams();
  const isAll = slug === "all";
  const { data, loading, error } = useProductsByCategorySlug(slug);
  const [params] = useSearchParams();
  const sort = params.get("sort") ?? "relevance";
  const sorted = applySort(data, sort);
  const compare = useCompare();

  // Local UI state: open/close compare modal
  const [compareOpen, setCompareOpen] = useState(false);
  // Inline picker for adding more products inside the compare modal

  // Price filter
  const minQ = params.get("min");
  const maxQ = params.get("max");
  const filtered = applyPriceFilter(sorted, minQ, maxQ);

  // Pagination (client)
  const page = Math.max(1, Number(params.get("page") ?? "1"));
  const pageSize = Math.max(1, Number(params.get("pageSize") ?? "12"));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  /**
   * Input: category slug from route
   * Process: fetch products of that category; handle loading/empty
   * Output: grid of product cards linking to details
   */
  if (!slug) {
    return (
      <Container>
        <div className="py-10">Missing category parameter</div>
      </Container>
    );
  }
  if (loading) {
    return (
      <Container>
        <div className="py-10">Loading...</div>
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <div className="py-10 text-red-600">{error}</div>
      </Container>
    );
  }

  return (
    <Container>
      <section className="pt-2 pb-8 py-4">
        <div className="sticky top-[96px] z-40 bg-gray-50/90 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80">
          <h2 className="px-4 pt-[15px] pb-3  text-2xl font-semibold text-blue-900">
            {isAll ? "All Products" : `Category: ${slug}`}
          </h2>
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="text-sm text-gray-600">
              {filtered.length} result(s)
            </div>
            <SortSelect />
          </div>
          <div className="px-4 pb-3">
            <PriceFilter />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border bg-white p-10 text-center">
            {/* Illustration icon */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M20 20l-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <div className="text-lg font-medium text-ink">
              No products in this category
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Try another category or browse all products.
            </p>

            <Link
              to="/category/all"
              className="mt-6 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              {/* back-style icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="h-4 w-4"
              >
                <path d="M5 12h14M12 5l-7 7 7 7" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {paged.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
            <Pager page={page} totalPages={totalPages} />

            {/* Floating Compare button (only when having selections) */}
            {compare.ids.length > 0 && (
              <div className="fixed bottom-5 right-5 z-40"></div>
            )}

            {/* Compare Modal (extracted component) */}
            <CompareModal
              open={compareOpen}
              onClose={() => setCompareOpen(false)}
            />
          </>
        )}
      </section>
    </Container>
  );
}
