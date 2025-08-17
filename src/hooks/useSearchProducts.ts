import { useEffect, useState } from 'react';
import { products } from '@/data/products';
import type { Product } from '@/type';

export default function useSearchProducts(query: string) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setData([]);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const q = query.toLowerCase();
      setData(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
        )
      );
      setLoading(false);
    }, 400); // giả lập delay
  }, [query]);

  return { data, loading };
}