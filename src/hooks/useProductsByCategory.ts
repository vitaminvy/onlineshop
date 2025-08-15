import { useEffect, useState } from 'react';
import type { Product } from '@/type';
import { getProductsByCategorySlug } from '@/lib/fetcher';

/**
 * Input: categorySlug (string)
 * Process: Fetch products filtered by category slug; manage loading/error
 * Output: { data: Product[]; loading: boolean; error?: string }
 */
export default function useProductsByCategorySlug(categorySlug: string) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
    // avoid accidental spaces
  const trimmedSlug = categorySlug.trim();


  useEffect(() => {
    let alive = true;
        if (!trimmedSlug) {
      // Reset state when slug is empty
      setData([]);
      setError(undefined);
      setLoading(false);
      return;
    }


    (async () => {
      try {
        setLoading(true);
        setError(undefined);
        setData([]);
        const list = await getProductsByCategorySlug(trimmedSlug);
        if (alive) setData(list);
      } catch {
        if (alive) {
        setData([]);
        setError('Failed to load category products');
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [trimmedSlug]);
  return { data, loading, error };
}
