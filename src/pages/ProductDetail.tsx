import { useParams, Link } from "react-router-dom";
import Container from "@/components/layout/Container";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { useWishlist } from "@/store/wishlist";
import { useCompare } from '@/store/compare';
import { useState, useEffect } from 'react';
import type { Product } from '@/type';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { useCompareProducts } from '@/hooks/useCompareProducts';
import { getProducts } from '@/lib/fetcher';


type CompareModalProps = { open: boolean; onClose: () => void };

/**
 * Compare modal for Product Detail.
 * Input: open flag, onClose handler
 * Process: render current compare list, allow add/remove/clear
 * Output: modal with compare table
 */
function CompareModal({ open, onClose }: CompareModalProps) {
  const compare = useCompare();
  const [pickerOpen, setPickerOpen] = useState(false);

  /**
   * Input: compare ids
   * Process: fetch compare products via mock API
   * Output: items for the compare table
   */
  const { data: fetched, loading } = useCompareProducts(compare.ids);

  /**
   * Input: none (trigger when picker is opened)
   * Process: load all products from mock API to build candidate list
   * Output: local `all` list filtered against current compare ids
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
        console.error('[ProductDetail CompareModal] load candidates failed:', e);
      }
    })();
    return () => { alive = false; };
  }, [pickerOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Backdrop (click to close) */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 max-h-[80vh] w-[min(1000px,92vw)] overflow-hidden rounded-lg border bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold text-gray-900">Compare</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(v => !v)}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" stroke="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-auto">
          {pickerOpen && (() => {
            const candidates: Product[] = all.filter(pd => !compare.ids.includes(pd.id));
            return (
              <div className="sticky top-0 z-10 border-b bg-white p-3">
                <div className="mb-2 text-sm font-medium text-gray-700">Add product to compare</div>
                {candidates.length === 0 ? (
                  <div className="text-sm text-gray-500">All products are already in the list.</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {candidates.slice(0, 12).map(pd => (
                      <button
                        type="button"
                        key={pd.id}
                        onClick={() => { compare.add(pd.id); toast.success('Added to compare'); }}
                        className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      >
                        <img src={pd.thumbnail ?? pd.images?.[0] ?? ''} alt={pd.name} className="h-8 w-8 rounded object-cover border" />
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
              return <div className="p-10 text-center text-gray-600">Loading compare…</div>;
            }
            if (items.length === 0) {
              return <div className="p-10 text-center text-gray-600">No products to compare.</div>;
            }
            const specKeys = Array.from(new Set(items.flatMap(p => Object.keys(p.specs ?? {}))));
            return (
              <div className="w-full overflow-auto">
                <table className="w-full min-w-[720px] table-fixed text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="w-48 p-3 text-left text-gray-600">Spec / Product</th>
                      {items.map(p => (
                        <th key={p.id} className="w-56 p-3 align-top">
                          <div className="flex items-start justify-between gap-2">
                            <Link to={`/product/${p.slug}`} className="font-medium text-gray-900 hover:underline" onClick={onClose}>
                              {p.name}
                            </Link>
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
                            <img src={p.thumbnail ?? p.images?.[0] ?? ''} alt={p.name} className="aspect-[4/3] w-full rounded-md object-cover" />
                          </div>
                          <div className="mt-2 text-emerald-600">{formatCurrency(p.price)}</div>
                          <div className="text-xs text-gray-500">{p.brand}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium text-gray-700">Stock</td>
                      {items.map(p => (
                        <td key={p.id} className="p-3">
                          {typeof p.stock === 'number' ? (
                            p.stock === 0 ? (
                              <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">Out of stock</span>
                            ) : p.stock <= 5 ? (
                              <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-700">Only {p.stock} left</span>
                            ) : (
                              <span className="text-gray-700">Stock: {p.stock}</span>
                            )
                          ) : (
                            '—'
                          )}
                        </td>
                      ))}
                    </tr>

                    {specKeys.map(key => (
                      <tr key={key} className="border-b">
                        <td className="p-3 font-medium text-gray-700 capitalize">{key}</td>
                        {items.map(p => (
                          <td key={p.id} className="p-3 text-gray-900">{p.specs?.[key] ?? '—'}</td>
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
 * Product detail view with sticky gallery and buy box.
 */
export default function ProductDetail() {
  const { slug = "" } = useParams();
  const { data: p, loading, error } = useProductBySlug(slug);
  /**
 * Input: user toggles compare in detail page
 * Process: manage modal open/close and compare store access
 * Output: local UI state and compare actions
 */
const [compareOpen, setCompareOpen] = useState(false);
const compare = useCompare();
  const add = useCart((s) => s.addToCart);
  const wishlist = useWishlist();

  if (loading) {
    return (
      <Container>
        <div className="py-10">Loading...</div>
      </Container>
    );
  }

  if (error || !p) {
    return (
      <Container>
        <div className="py-10">{error ? String(error) : "Product not found."}</div>
      </Container>
    );
  }

  const fav = p ? wishlist.has(p.id) : false;

  return (
    <Container>
      {/* Breadcrumb */}
      <nav className="py-3 text-sm text-gray-600">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/category/all" className="hover:underline">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{p.name}</span>
      </nav>

      <div className="grid gap-8 py-6 lg:grid-cols-12">
        {/* Left: sticky image */}
        <div className="lg:col-span-6">
          <div className="sticky top-20 rounded-lg border bg-white p-4">
            <img
              src={p.thumbnail || p.images?.[0] || "/img/placeholder.jpg"}
              alt={p.name}
              className="aspect-square w-full rounded-md object-cover"
              loading="lazy"
            />
            {/* Thumbnails (mock single for Day 1) */}
            <div className="mt-3 grid grid-cols-5 gap-2">
              {p.images?.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="aspect-square w-full rounded border object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: title, price, buy box and specs */}
        <div className="lg:col-span-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-ink">{p.name}</h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={fav}
                aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'}
                title={fav ? 'Remove from wishlist' : 'Add to wishlist'}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (!p) return;
                  if (fav) wishlist.remove(p.id);
                  else wishlist.add(p.id);
                }}
                className="ml-3 inline-flex items-center justify-center p-1 bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent border-0 outline-none ring-0 appearance-none"
              >
                <svg
                  className={`h-6 w-6 transition-colors ${fav ? 'text-red-500' : 'text-gray-400'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={fav ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.13 2.44h.74C13.09 5 14.76 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fillRule="evenodd"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!p) return;
                  const wasCompared = compare.has(p.id);
                  compare.toggle(p.id);
                  setCompareOpen(true);
                  toast.success(wasCompared ? 'Removed from compare' : 'Added to compare');
                }}
                className={`rounded-md border px-4 py-2 text-sm ${
                  compare.has(p?.id ?? '')
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-blue-500 bg-white text-blue-600 hover:bg-blue-50 active:opacity-60'
                }`}
              >
                {compare.has(p?.id ?? '') ? 'Compared' : 'Compare'}
              </button>
            </div>
          </div>
          {p.shortDesc && <p className="mt-2 text-gray-600">{p.shortDesc}</p>}

          {/* Buy box */}
          <div className="mt-4 rounded-lg border bg-white p-4">
            <div className="text-sm text-gray-500">From</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(p.price)}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Brand: <span className="font-medium text-ink">{p.brand}</span>
            </div>
            <div className="mt-1 text-sm">
              {p.stock > 0 ? (
                p.stock <= 5 ? (
                  <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-700">
                    Only {p.stock} left
                  </span>
                ) : (
                  <span className="rounded bg-green-50 px-2 py-0.5 text-green-700">
                    In stock • {p.stock} pcs
                  </span>
                )
              ) : (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">
                  Out of stock
                </span>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  add(p, 1);
                  toast.success(`Added “${p.name}” to cart`);
                }}
                disabled={p.stock <= 0}
                aria-disabled={p.stock <= 0}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Specs */}
          {p.specs && (
            <div className="mt-6 rounded-lg border bg-white p-4">
              <h2 className="mb-3 text-lg font-semibold">Specifications</h2>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(p.specs).map(([k, v]) => (
                    <tr key={k} className="border-t first:border-t-0">
                      <td className="w-1/3 py-2 pr-4 font-medium capitalize text-gray-600">
                        {k}
                      </td>
                      <td className="py-2 text-ink">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Compare Modal (local for ProductDetail) */}
      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} />
    </Container>
  );
}
