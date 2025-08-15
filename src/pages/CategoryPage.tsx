import { useParams, Link } from 'react-router-dom';
import Container from '@/components/layout/Container';
import useProductsByCategorySlug from '@/hooks/useProductsByCategory';
import { formatCurrency } from '@/lib/format';

/**
 * Category listing page by slug.
 */
export default function CategoryPage() {
  const { slug = '' } = useParams();
  const isAll = slug === 'all';
  const { data, loading, error } = useProductsByCategorySlug(slug);

  /**
   * Input: category slug from route
   * Process: fetch products of that category; handle loading/empty
   * Output: grid of product cards linking to details
   */
  if (!slug) {
    return <Container><div className="py-10">Missing category parameter</div></Container>;
  }
  if (loading) {
    return <Container><div className="py-10">Loading...</div></Container>;
  }
  if (error) {
    return <Container><div className="py-10 text-red-600">{error}</div></Container>;
  }

  return (
    <Container>
      <section className="pt-2 pb-8">
        <div className="sticky top-[96px] z-40 bg-gray-50/90 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80">
            <h2 className="px-4 pt-[15px] pb-3  text-xl font-semibold">
            {isAll ? 'All Products' : `Category: ${slug}`}
            </h2>
        </div>
        
        {data.length === 0 ? (
          <div className="text-gray-500">No products found in this category.</div>
        ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.map(p => (
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