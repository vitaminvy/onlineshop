import { useEffect, useState } from 'react';
import type { Product } from '@/type';
import { getProductBySlug } from '@/lib/fetcher';

/**
 * Fetch single product by slug.
 * Input: slug (string)
 * Process: call mock API (getProductBySlug); manage loading/error
 * Output: { data, loading, error }
 */
export function useProductBySlug(slug: string) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const p = await getProductBySlug(slug);
        if (alive) setData(p ?? null);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  return { data, loading, error };
}