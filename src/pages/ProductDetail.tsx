import { useParams, Link } from "react-router-dom";
import Container from "@/components/layout/Container";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { useWishlist } from "@/store/wishlist";
import { useState } from "react";
import { useProductBySlug } from "@/hooks/useProductBySlug";
import CompareModal from "@/components/compare/CompareModal";

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
        <div className="py-10">
          {error ? String(error) : "Product not found."}
        </div>
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

            <div className="flex gap-2 mt-3">
              <button
                type="button"
                aria-pressed={fav}
                aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
                title={fav ? "Remove from wishlist" : "Add to wishlist"}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (!p) return;
                  if (fav) wishlist.remove(p.id);
                  else wishlist.add(p.id);
                }}
                className="ml-3 inline-flex items-center justify-center p-1 bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent border-0 outline-none ring-0 appearance-none"
              >
                <svg
                  className={`h-6 w-6 transition-colors ${
                    fav ? "text-red-500" : "text-gray-400"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={fav ? "currentColor" : "none"}
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
