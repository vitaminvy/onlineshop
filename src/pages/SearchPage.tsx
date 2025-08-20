import { useSearchParams, Link } from "react-router-dom";
import Container from "@/components/layout/Container";
// Remove useSearchProducts import
import { formatCurrency } from "@/lib/format";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { useWishlist } from "@/store/wishlist";
import { toast } from "sonner";
import { useCompare } from "@/store/compare";
// Remove in-memory products source import
import { useProducts } from "@/hooks/useProducts";
import { useCompareProducts } from "@/hooks/useCompareProducts";
import { getProducts } from "@/lib/fetcher";
import type { Product } from "@/type";

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
    // Small timeout just to show feedback; remove if không cần
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

type CompareModalProps = { open: boolean; onClose: () => void };

/**
 * Compare modal for Search page.
 * Input: open flag, onClose handler
 * Process: show current compare list; allow adding more items and clear all
 * Output: modal UI with table
 */
function CompareModal({ open, onClose }: CompareModalProps) {
  const compare = useCompare();
  const [pickerOpen, setPickerOpen] = useState(false);

  /**
   * Input: compare ids
   * Process: fetch compare products via mock API
   * Output: products rendered in compare table
   */
  const { data: fetched, loading } = useCompareProducts(compare.ids);

  /**
   * Input: none (trigger on open)
   * Process: load all products to build candidate list
   * Output: `all` list filtered against current compare ids
   */
  const [all, setAll] = useState<Product[]>([]);
  useEffect(() => {
    if (!pickerOpen) return;
    let alive = true;
    (async () => {
      try {
        const list = await getProducts();
        if (alive) setAll(list);
      } catch (e) {
        console.error('[Search CompareModal] load candidates failed:', e);
      }
    })();
    return () => { alive = false; };
  }, [pickerOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 max-h-[80vh] w-[min(1000px,92vw)] overflow-hidden rounded-lg border bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold text-gray-900">Compare</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:opacity-90"
            >
              + Add
            </button>
            <button
              type="button"
              onClick={() => compare.clear()}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-transparent px-3 py-1.5 text-sm text-black hover:bg-gray-100"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-auto">
          {pickerOpen &&
            (() => {
              const candidates: Product[] = all.filter(pd => !compare.ids.includes(pd.id));
              return (
                <div className="sticky top-0 z-10 border-b bg-white p-3">
                  <div className="mb-2 text-sm font-medium text-gray-700">
                    Add product to compare
                  </div>
                  {candidates.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      All products are already in the list.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {candidates.slice(0, 12).map((pd) => (
                        <button
                          type="button"
                          key={pd.id}
                          onClick={() => {
                            compare.add(pd.id);
                            toast.success("Added to compare");
                          }}
                          className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                          <img
                            src={pd.thumbnail ?? pd.images?.[0] ?? ""}
                            alt={pd.name}
                            className="h-8 w-8 rounded object-cover border"
                          />
                          <span className="line-clamp-1">{pd.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

          {(() => {
            const items: Product[] = (fetched ?? []) as Product[];

            if (loading) {
              return (
                <div className="p-10 text-center text-gray-600">Loading compare…</div>
              );
            }

            if (items.length === 0) {
              return (
                <div className="p-10 text-center text-gray-600">
                  No products to compare.
                </div>
              );
            }

            const specKeys = Array.from(
              new Set(items.flatMap((p) => Object.keys(p.specs ?? {})))
            );

            return (
              <div className="w-full overflow-auto">
                <table className="w-full min-w-[720px] table-fixed text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="w-48 p-3 text-left text-gray-600">
                        Spec / Product
                      </th>
                      {items.map((p) => (
                        <th key={p.id} className="w-56 p-3 align-top">
                          <div className="flex items-start justify-between gap-2">
                            <a
                              href={`/product/${p.slug}`}
                              className="font-medium text-gray-900 hover:underline"
                              onClick={onClose}
                            >
                              {p.name}
                            </a>
                            <button
                              onClick={() => compare.remove(p.id)}
                              className="rounded-md border border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 active:opacity-60"
                              aria-label={`Remove ${p.name} from compare`}
                              title="Remove"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mt-2">
                            <img
                              src={p.thumbnail ?? p.images?.[0] ?? ""}
                              alt={p.name}
                              className="aspect-[4/3] w-full rounded-md object-cover"
                            />
                          </div>
                          <div className="mt-2 text-emerald-600">
                            {formatCurrency(p.price)}
                          </div>
                          <div className="text-xs text-gray-500">{p.brand}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium text-gray-700">Stock</td>
                      {items.map((p) => (
                        <td key={p.id} className="p-3">
                          {typeof p.stock === "number" ? (
                            p.stock === 0 ? (
                              <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">
                                Out of stock
                              </span>
                            ) : p.stock <= 5 ? (
                              <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-700">
                                Only {p.stock} left
                              </span>
                            ) : (
                              <span className="text-gray-700">
                                Stock: {p.stock}
                              </span>
                            )
                          ) : (
                            "—"
                          )}
                        </td>
                      ))}
                    </tr>

                    {specKeys.map((key) => (
                      <tr key={key} className="border-b">
                        <td className="p-3 font-medium text-gray-700 capitalize">
                          {key}
                        </td>
                        {items.map((p) => (
                          <td key={p.id} className="p-3 text-gray-900">
                            {p.specs?.[key] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable compare toggle button for product cards.
 * Input: productId (string)
 * Process: toggle compare store with feedback
 * Output: bordered button labeled 'Compare' / 'Compared'
 */
/**
 * Reusable compare toggle button for product cards.
 * Input: productId (string), onOpen (fn)
 * Process: toggle compare store; open modal when adding
 * Output: 'Compare' / 'Compared' button + optional modal open
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
        // Open modal only when we ADD to compare (was off -> on)
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

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  // Fetch all products once; filter client-side by keyword
  const { data: all, loading } = useProducts({ mode: 'all' });
  // Keyword filter (case-insensitive) on name/brand/slug
  const base = all ?? [];
  const needle = q.trim().toLowerCase();
  const byQuery = needle
    ? base.filter(p =>
        p.name.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle) ||
        p.slug.toLowerCase().includes(needle)
      )
    : base;
  const sort = params.get("sort") ?? "relevance";
  const sorted = applySort(byQuery, sort);
  const wish = useWishlist();

  /**
   * Input: user actions from search page
   * Process: open/close compare modal and modify global compare list
   * Output: UI state + compare store access
   */
  const [compareOpen, setCompareOpen] = useState(false);

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

  return (
    <Container>
      <h2 className="py-4 text-xl font-semibold">Search results for: "{q}"</h2>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-600">{filtered.length} result(s)</div>
        <div className="flex items-center gap-4">
          <PriceFilter />
          <SortSelect />
          <button
            type="button"
            onClick={() => setCompareOpen(true)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg hover:opacity-90"
          >
            Compare
          </button>
        </div>
      </div>
      {loading && (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
          <Spinner className="mr-2" />
          <span className="align-middle">Loading results…</span>
        </div>
      )}
      {!loading && filtered.length === 0 ? (
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
                className="group relative block overflow-hidden rounded-lg border bg-white transition hover:shadow"
              >
                {/* Image: use thumbnail fallback to first image */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
                  <img
                    src={p.thumbnail ?? p.images?.[0] ?? ""}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Text info */}
                <div className="p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="line-clamp-1 text-sm font-medium text-gray-900">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={
                          wish.has(p.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        aria-pressed={wish.has(p.id)}
                        title={
                          wish.has(p.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const wasLiked = wish.has(p.id);
                          wish.toggle(p.id);
                          toast.success(
                            wasLiked
                              ? "Removed from wishlist"
                              : "Added to wishlist"
                          );
                        }}
                        className="shrink-0 inline-flex items-center justify-center p-1 bg-transparent hover:bg-transparent focus:bg-transparent border-0 outline-none ring-0 appearance-none"
                      >
                        {/* existing heart svg unchanged */}
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          className="transition-colors"
                          fill={wish.has(p.id) ? "#ef4444" : "none"}
                          stroke={wish.has(p.id) ? "#ef4444" : "currentColor"}
                          strokeWidth="2"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 21s-1.45-1.3-3.1-2.82C6.3 16.84 4 14.78 4 12.2 4 10.02 5.8 8.2 8 8.2c1.3 0 2.6.64 3.4 1.66.8-1.02 2.1-1.66 3.4-1.66 2.2 0 4 1.82 4 4 0 2.58-2.3 4.64-4.9 6-1.65 1.52-3.1 2.8-3.1 2.8z"
                            fillRule="evenodd"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <CompareButton
                        productId={p.id}
                        onOpen={() => setCompareOpen(true)}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{p.brand}</p>
                  {/* Stock line */}
                  {typeof p.stock === "number" &&
                    (p.stock === 0 ? (
                      <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                        Out of stock
                      </span>
                    ) : p.stock <= 5 ? (
                      <span className="mt-1 inline-block rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        Only {p.stock} left
                      </span>
                    ) : (
                      <span className="mt-0.5 text-xs text-gray-600">
                        Stock: {p.stock}
                      </span>
                    ))}
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
