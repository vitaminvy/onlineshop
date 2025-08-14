import Container from '@/components/layout/Container';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/fetcher';
import { formatCurrency } from '@/lib/format';
import type { Product } from '@/type';

/**
 * Home page showing a featured products grid (light mode).
 */
export default function Home() {
  /**
   * Input: none
   * Process: fetch products and pick the first 8 as "featured"
   * Output: responsive product grid with links to detail pages
   */
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((products) => {
      // If you later add a flag (e.g., p.featured), filter here.
      // For Day 1, just take the first 8 items.
      setFeaturedProducts(products.slice(0, 8));
    });
  }, []);

  return (
    <Container>
      <section className="py-10">
        <h1 className="mb-6 text-3xl font-semibold">Featured Products</h1>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((p) => {
            const img = p.thumbnail ?? p.images?.[0] ?? '';
            return (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="block rounded-lg border border-gray-200 p-4 transition hover:shadow"
              >
                <img
                  src={img}
                  alt={p.name}
                  className="mb-3 h-40 w-full rounded-md object-cover"
                />
                <h2 className="line-clamp-2 text-sm font-medium">{p.name}</h2>
                {p.brand && <p className="text-xs text-gray-500">{p.brand}</p>}
                <p className="mt-1 font-semibold text-primary">
                  {formatCurrency(p.price)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </Container>
  );
}