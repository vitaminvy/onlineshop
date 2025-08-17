import { useParams, Link } from 'react-router-dom';
import Container from '@/components/layout/Container';
import { formatCurrency } from '@/lib/format';
import { useCart } from '@/store/cart';
import useProduct from '@/hooks/useProduct';
import { toast } from 'sonner';


/**
 * Product detail view with sticky gallery and buy box.
 */
export default function ProductDetail() {
  const { slug = '' } = useParams();
  const { data: p, loading, error } = useProduct(slug);
  const add = useCart(s => s.addToCart);

  /**
   * Input: route param 'slug'
   * Process: fetch product; toggle not found state
   * Output: detail layout with spec and add-to-cart
   */
 
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
      <div className="py-10">{error ?? 'Product not found.'}</div>
    </Container>
  );
}

  return (
    <Container>
      {/* Breadcrumb */}
      <nav className="py-3 text-sm text-gray-600">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/category/all" className="hover:underline">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{p.name}</span>
      </nav>

      <div className="grid gap-8 py-6 lg:grid-cols-12">
        {/* Left: sticky image */}
        <div className="lg:col-span-6">
          <div className="sticky top-20 rounded-lg border bg-white p-4">
            <img
              src={p.thumbnail || p.images?.[0] || '/img/placeholder.jpg'}
              alt={p.name}
              className="aspect-square w-full rounded-md object-cover"
              loading="lazy"
            />
            {/* Thumbnails (mock single for Day 1) */}
            <div className="mt-3 grid grid-cols-5 gap-2">
              {p.images?.map((src, i) => (
                <img key={i} src={src} className="aspect-square w-full rounded border object-cover" />
              ))}
            </div>
          </div>
        </div>

        {/* Right: title, price, buy box and specs */}
        <div className="lg:col-span-6">
          <h1 className="text-2xl font-semibold text-ink">{p.name}</h1>
          {p.shortDesc && <p className="mt-2 text-gray-600">{p.shortDesc}</p>}

          {/* Buy box */}
          <div className="mt-4 rounded-lg border bg-white p-4">
            <div className="text-sm text-gray-500">From</div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(p.price)}</div>
            <div className="mt-1 text-sm text-gray-600">
              Brand: <span className="font-medium text-ink">{p.brand}</span>
            </div>
            <div className="mt-1 text-sm">
              {p.stock > 0 ? (
                <span className="rounded bg-green-50 px-2 py-0.5 text-green-700">In stock • {p.stock} pcs</span>
              ) : (
                <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">Out of stock</span>
              )}
            </div>

            <button
               onClick={() => {
                  add(p, 1);
                  toast.success(`Added “${p.name}” to cart`);
              }}
                  disabled={p.stock <= 0}
                  aria-disabled={p.stock <= 0}
                 className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
               
            >
              Add to Cart
            </button>
          </div>

          {/* Specs */}
          {p.specs && (
            <div className="mt-6 rounded-lg border bg-white p-4">
              <h2 className="mb-3 text-lg font-semibold">Specifications</h2>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(p.specs).map(([k, v]) => (
                    <tr key={k} className="border-t first:border-t-0">
                      <td className="w-1/3 py-2 pr-4 font-medium capitalize text-gray-600">{k}</td>
                      <td className="py-2 text-ink">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}