import Container from '@/components/layout/Container';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/format';
import type { Product } from '@/type';
import { useFeaturedProducts } from '@/hooks'; // nếu không có barrel, dùng: '@/hooks/useProducts'

/**
 * Home page showing a featured products grid (light mode).
 */
export default function Home() {
  /**
   * Input: none
   * Process: fetch featured products via hook; handle loading/error/empty states
   * Output: responsive product grid with links to detail pages
   */
  const { data: featuredProducts, loading, error } = useFeaturedProducts();

  if (loading) {
    return (
      <Container>
        <div className="py-10">Đang tải...</div>
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
      <section className="py-8">
        <h2 className="mb-4 text-xl font-semibold">Sản phẩm nổi bật</h2>

        {!featuredProducts?.length ? (
          <div className="text-gray-500">Chưa có sản phẩm nổi bật.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((p: Product) => (
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
                  <p className="text-base font-semibold text-emerald-600">
                    {formatCurrency(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}