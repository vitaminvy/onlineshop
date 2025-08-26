import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/type";
import { formatCurrency } from "@/lib/format";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useCompare } from "@/store/compare";
import { toast } from "sonner";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import CompareModal from "@/components/compare/CompareModal";

/**
 * Compact product card with image, name and price.
 */
export default function ProductCard({ p }: { p: Product }) {
  /**
   * Input: product model
   * Process: render cover image, clipped name, and price
   * Output: navigable card linking to product detail
   */
  const wish = useWishlist();
  const compare = useCompare();
  const [compareOpen, setCompareOpen] = useState(false);
  console.log("DEBUG ProductCard render", p.name);
  return (
    <div className="group rounded-lg border bg-white p-3 shadow-card transition hover:shadow flex flex-col">
      <Link to={`/product/${p.slug}`} className="block flex-1">
        <img
          src={p.thumbnail}
          alt={p.name}
          className="aspect-square w-full rounded-md object-cover"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex-1 line-clamp-1 text-sm font-medium text-ink group-hover:underline">
            {p.name}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              className={` text-sm bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent ${
                wish.has(p.id) ? "text-red-500" : "text-gray-400"
              }`}
              onClick={(e) => {
                e.preventDefault();
                wish.toggle(p.id);
                if (wish.has(p.id)) {
                  toast.success("Added to wishlist");
                } else {
                  toast.success("Removed from wishlist");
                }
              }}
              aria-label="Toggle wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={wish.has(p.id) ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke={wish.has(p.id) ? "currentColor" : "gray"}
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button
              className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] hover:opacity-70 ${
                compare.has(p.id)
                  ? "bg-gray-200 text-gray-700 border-gray-400"
                  : "bg-white text-blue-600 border-blue-600"
              }`}
              onClick={(e) => {
                e.preventDefault();
                compare.toggle(p.id);
                setCompareOpen(true);
                if (compare.has(p.id)) {
                  toast.success("Added to compare");
                } else {
                  toast.success("Removed from compare");
                }
              }}
              aria-label="Toggle compare"
            >
              {compare.has(p.id) ? "Compared" : "Compare"}
            </button>
          </div>
        </div>
        <div className="mt-1 text-sm text-gray-500">{p.brand}</div>
        <div className="mt-1 text-base font-semibold text-primary">
          {formatCurrency(p.price)}
        </div>
        {p.stock <= 0 ? (
          <div className="mt-2 inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            Out of stock
          </div>
        ) : (
          <div className="mt-2 inline-flex rounded bg-green-50 px-2 py-0.5 text-xs text-green-700">
            In stock
          </div>
        )}
      </Link>
      <button
        className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
        onClick={() => {
          console.log("Add to Cart clicked", p.name);
          useCart.getState().addToCart(p, 1);
        }}
      >
        <ShoppingCartIcon className="h-4 w-4" />
        Add to Cart
      </button>
      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} />
    </div>
  );
}
