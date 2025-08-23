import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

/**
 * Floating pill button that shows current cart count.
 * Appears only when the cart has items (>0).
 */
export default function FloatingCartButton() {
  /**
   * Input: cart store (items/count) from useCart()
   * Process: read current count; render fixed rounded button bottom-right
   * Output: clickable link to /cart with live count
   */
  // Read the derived total directly from the cart store for consistency with cart.ts
  const count = useCart((s) => s.totalQty);

  const [justAdded, setJustAdded] = useState(false);

  // Pulse effect briefly when count changes (item added)
  useEffect(() => {
    if (count > 0) {
      setJustAdded(true);
      const t = setTimeout(() => setJustAdded(false), 400);
      return () => clearTimeout(t);
    }
  }, [count]);

  if (count === 0) return null;

  return (
    <Link
      to="/cart"
      className={`fixed bottom-6 right-6 z-50 inline-flex items-center rounded-full
            bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white 
            shadow-lg shadow-gray-900/30 backdrop-blur-sm
            transition-transform duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-700
            focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
            ${justAdded ? "animate-bounce" : ""}`}
      aria-label={`Open cart with ${count} item${count > 1 ? "s" : ""}`}
    >
      Cart ({count})
    </Link>
  );
}
