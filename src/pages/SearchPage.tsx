import { useSearchParams, Link } from 'react-router-dom';
import Container from '@/components/layout/Container';
import useSearchProducts from '@/hooks/useSearchProducts';
import { formatCurrency } from '@/lib/format';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const { data, loading } = useSearchProducts(q);

  return (
    <Container>
      <h2 className="py-4 text-xl font-semibold">Search results for: "{q}"</h2>
      {loading && <div>Loading...</div>}
      {!loading && data.length === 0 && (
        <div className="text-gray-500">No products found.</div>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data.map((p) => (
         <Link
            key={p.id}
            to={`/product/${p.slug}`}
            className="group block overflow-hidden rounded-lg border bg-white transition hover:shadow"
          >
            {/* Image: use thumbnail fallback to first image */}
            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
              <img
                src={p.thumbnail ?? p.images?.[0] ?? ''}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Text info */}
            <div className="p-3">
              <h3 className="line-clamp-1 text-sm font-medium text-gray-900">{p.name}</h3>
              <p className="text-xs text-gray-500">{p.brand}</p>
              <p className="text-base font-semibold text-emerald-600">{formatCurrency(p.price)}</p>
            </div>
          
          </Link>
        ))}
      </div>
    </Container>
  );
}