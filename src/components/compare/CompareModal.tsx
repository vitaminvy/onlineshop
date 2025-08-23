import { PropsWithChildren, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCompare } from "@/store/compare";
import type { Product } from "@/type";
import { products as SOURCE } from "@/data/products";
// Add: mock fetcher for compare
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fetcher, { getCompare } from "@/lib/fetcher";
import React from "react";
import { motion } from "framer-motion";
console.log("MODAL RENDERED");


/**
 * Compare modal UI.
 * Input: `open` (boolean), `onClose` (fn), selected ids from store
 * Process: resolve ids → products, compute union of spec keys, render table
 * Output: side-by-side comparison with remove/clear and quick add
 */
type Props = { open: boolean; onClose: () => void };

export default function CompareModal({
  open,
  onClose,
}: PropsWithChildren<Props>) {
  const navigate = useNavigate();
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const add = useCompare((s) => s.add);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[] | null>(null);
  console.log("MODAL RENDERED");
  const filtered = SOURCE.filter(
    (p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase()) &&
      !ids.includes(p.id)
  );

  React.useEffect(() => {
    async function fetchCategoryProducts() {
      if (!selectedCategory) return;
      const filtered = SOURCE.filter(
        (p) =>
          p.categoryId.toLowerCase() === selectedCategory.toLowerCase()
      );
      setCategoryProducts(filtered);
    }

    fetchCategoryProducts();
  }, [selectedCategory]);

  function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
    const [loaded, setLoaded] = useState(false);
    const [retry, setRetry] = useState(0);

    // Tự động reload ảnh nếu chưa loaded và chưa quá 3 lần
    React.useEffect(() => {
      if (!loaded && retry < 3) {
        const timeout = setTimeout(() => {
          setRetry((r) => r + 1);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }, [loaded, retry]);

    return (
      <div className="relative h-16 w-16 bg-gray-200 overflow-hidden rounded">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-gray-300">
            <span className="text-xs text-gray-600">Loading...</span>
          </div>
        )}{" "}
        <img
          key={retry}
          src={src}
          alt={alt}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "invisible"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      </div>
    );
  }

  /**
   * Input: none
   * Process: fetch mock products for current compare ids via getCompare()
   * Output: set local 'fetched' for quick verification/logging
   */
  const [fetched, setFetched] = useState<null | Product[]>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleFetchMock() {
    try {
      const data = await getCompare(ids);
      setFetched(data);
      console.log("[Mock Fetch] compare data:", data);
    } catch (e) {
      console.error("[Mock Fetch] failed:", e);
    }
  }

  // Resolve selected products
  const items: Product[] = ids
    .map((id) => SOURCE.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  // Build union of all spec keys across selected products
  const specKeys = Array.from(
    new Set(items.flatMap((it) => Object.keys(it.specs)))
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-5xl max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Compare</h2>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search by part number,keywork,brand..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="min-w-[300px] flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm"
            />
            <Link
              to="/search?mode=compare"
              className="rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-90"
            >
              + Add
            </Link>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-gray-800 hover:opacity-70 bg-transparent"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4 bg-transparent">
            {[
              "IC",
              "Resistors",
              "Sensors",
              "Motors",
              "LEDs",
              "Capacitors",
              "MCU Boards",
              "Power Modules",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  const slug = cat.toLowerCase().replace(/\s+/g, "-");
                  navigate(`/category/${slug}`);
                  onClose();
                }}
className="rounded-md bg-blue-100 text-blue-500 font-semibold  px-2 py-1 text-xs hover:bg-blue-200 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {selectedCategory && (
          <div className="mb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              ← Back to compare
            </button>
          </div>
        )}

        {selectedCategory && keyword.length === 0 && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryProducts?.filter((p) => !ids.includes(p.id)).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded border p-3 gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.thumbnail ?? p.images?.[0] ?? ""}
                    alt={p.name}
                    className="h-10 w-10 rounded object-cover border"
                  />
                  <p className="text-sm font-medium line-clamp-1 max-w-[160px]">
                    {p.name}
                  </p>
                </div>
                <button
                  onClick={() => add(p.id)}
                  className="ml-2 shrink-0 rounded-md border px-2 py-1 text-xs border-blue-600 bg-blue-50 text-blue-600"
                >
                  Compared
                </button>
              </div>
            ))}
          </div>
        )}

        {keyword.length > 0 && (
          <>
            <div className="mb-2">
              <button
                onClick={() => setKeyword("")}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                ← Back to compare
              </button>
            </div>
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded border p-3 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.thumbnail ?? p.images?.[0] ?? ""}
                        alt={p.name}
                        className="h-10 w-10 rounded object-cover border"
                      />
                      <p className="text-sm font-medium line-clamp-1 max-w-[160px]">
                        {p.name}
                      </p>
                    </div>
                    <button
                      onClick={() => add(p.id)}
                      className="ml-2 shrink-0 rounded-md border px-2 py-1 text-xs border-blue-600 bg-blue-50 text-blue-600"
                    >
                      Compared
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 col-span-2">
                  Không tìm thấy sản phẩm
                </p>
              )}
            </div>
          </>
        )}

        {items.length === 0 ? (
          <div className="py-10 text-center text-gray-600">
            No products selected
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left"></th>
                  {items.map((it) => (
                    <th key={it.id} className="border p-2">
                      <div className="flex flex-col items-center gap-2">
                        <ImageWithSkeleton src={it.thumbnail} alt={it.name} />
                        <span className="text-sm font-medium">{it.name}</span>
                        {/* Action: remove a single product from compare */}
                        <button
                          onClick={() => remove(it.id)}
                          className="rounded-md border border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 hover:opacity-75"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specKeys.map((spec) => (
                  <tr key={spec}>
                    <td className="border p-2 font-medium">{spec}</td>
                    {items.map((it) => (
                      <td
                        key={it.id + ":" + spec}
                        className="border p-2 text-center"
                      >
                        {it.specs[spec] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Debug: show count of fetched items from mock API */}
        {fetched && (
          <p className="mt-2 text-xs text-gray-500">
            Mock fetched: <span className="font-medium">{fetched.length}</span>{" "}
            item(s)
          </p>
        )}

        {items.length > 0 && (
          <div className="mt-4 flex justify-end">
            {/* Action: clear all compared products */}
            <button
              onClick={clear}
              className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:opacity-90"
            >
              Clear All
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
