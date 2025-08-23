import Container from "@/components/layout/Container";
import { useWishlist } from "@/store/wishlist";
import { products as SOURCE } from "@/data/products";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/format";
import { useState } from "react";
import { useCompare } from "@/store/compare";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import CompareModal from "@/components/compare/CompareModal";


/**
 * Reusable compare toggle button for Wishlist cards (Category style).
 * Input: productId (string), onOpen optional
 * Process: toggle compare store; open modal when adding
 * Output: 'Compare' / 'Compared' button
 */
function CompareButton({
  productId,
  onOpen,
}: {
  productId: string;
  onOpen?: () => void;
}) {
  const compare = useCompare();
  const isOn = compare.has(productId);

  return (
    <button
      type="button"
      aria-label={isOn ? "Remove from compare" : "Add to compare"}
      title={isOn ? "Remove from compare" : "Add to compare"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const wasOn = compare.has(productId);
        compare.toggle(productId);
        if (!wasOn && onOpen) onOpen();
        toast.success(wasOn ? "Removed from compare" : "Added to compare");
      }}
      className={`ml-2 shrink-0 rounded-md border px-2 py-1 text-xs ${
        isOn
          ? "border-blue-600 bg-blue-50 text-blue-700"
          : "border-blue-500 bg-white text-blue-600 hover:bg-blue-50 active:opacity-60"
      }`}
    >
      {isOn ? "Compared" : "Compare"}
    </button>
  );
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
      return arr; // relevance: keep incoming order
  }
}

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
  const [applying, setApplying] = useState(false);

  /**
   * Input: local min/max
   * Process: write query params and reset page to 1
   * Output: URL reflects filter; list re-renders
   */
  const apply = () => {
    setApplying(true);
    if (min) params.set("min", min);
    else params.delete("min");
    if (max) params.set("max", max);
    else params.delete("max");
    params.set("page", "1");
    setParams(params, { replace: true });
    setTimeout(() => setApplying(false), 150);
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
        disabled={applying}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {applying && <Spinner />}
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
 * Input: wishlist ids
 * Process: join with products; render grid or empty state
 * Output: wishlist page
 */
export default function Wishlist() {
  const ids = useWishlist((s) => s.ids);
  const list = SOURCE.filter((p) => ids.includes(p.id));
  const [params] = useSearchParams();
  const sort = params.get("sort") ?? "relevance";
  const sorted = applySort(list, sort);

  const minQ = params.get("min");
  const maxQ = params.get("max");
  /**
   * Input: sorted list and query-string bounds
   * Process: filter by inclusive bounds
   * Output: filtered array for rendering
   */
  const filtered = applyPriceFilter(sorted, minQ, maxQ);

  // Pagination (client)
  const page = Math.max(1, Number(params.get("page") ?? "1"));
  const pageSize = Math.max(1, Number(params.get("pageSize") ?? "12"));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  /**
   * Input: user opens compare from wishlist
   * Process: control compare modal visibility
   * Output: boolean UI state
   */
  const [compareOpen, setCompareOpen] = useState(false);

  if (list.length === 0) {
    return (
      <Container>
        <h2 className="py-4 text-xl font-semibold">Your Wishlist</h2>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-600">{filtered.length} item(s)</div>
          <div className="flex items-center gap-4">
            <PriceFilter />
            <SortSelect />
          </div>
        </div>
        <div className="rounded-lg border bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
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
            No items in wishlist
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Browse products and tap the heart icon to save.
          </p>
          <Link
            to="/category/all"
            className="mt-6 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
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
        {/* Compare Modal */}
        <CompareModal
          open={compareOpen}
          onClose={() => setCompareOpen(false)}
        />
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="py-4 text-xl font-semibold">Your Wishlist</h2>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-600">{filtered.length} item(s)</div>
        <div className="flex items-center gap-4">
          <PriceFilter />
          <SortSelect />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center">
          {/* Illustration icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
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
          <div className="text-lg font-medium text-ink">No products found</div>
          <p className="mt-1 text-sm text-gray-600">
            Try adjusting filters or search terms.
          </p>

          <Link
            to="/category/all"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 12h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {paged.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="group block overflow-hidden rounded-lg border bg-white transition hover:shadow"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
                  <img
                    src={p.thumbnail ?? p.images?.[0] ?? ""}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <h3 className="line-clamp-1 text-sm font-medium text-gray-900">
                      {p.name}
                    </h3>
                    <div className="flex items-center">
                      <CompareButton
                        productId={p.id}
                        onOpen={() => setCompareOpen(true)}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{p.brand}</p>
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
      {/* Compare Modal */}
      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} />
    </Container>
  );
}
