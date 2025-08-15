import { useEffect, useState } from 'react';
import { getProductBySlug } from '@/lib/fetcher';
import type { Product } from '@/type';

/**
 * Input: slug (string) - product slug to fetch
 * Process: Fetch product detail by slug; handle not-found, loading, and error states
 * Output: { data?: Product; loading: boolean; error?: string }
 */
export default function useProduct(slug: string) {
  const [data, setData] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!slug) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const p = await getProductBySlug(slug);
        if (alive) {
          setData(p);
          if (!p) setError('Not found');
        }
      } catch {
        if (alive) setError('Failed to load product');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  return { data, loading, error };
}