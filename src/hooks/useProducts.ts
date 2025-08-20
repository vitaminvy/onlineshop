import { useEffect, useState } from 'react';
import { getProducts, getFeaturedProducts } from '@/lib/fetcher';
import type { Product } from '@/type';

/**
 * Input: none
 * Process: Fetch all products on mount; manage loading and error states
 * Output: { data: Product[]; loading: boolean; error?: string }
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useProducts(_p0?: { mode: string; }) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await getProducts();
        if (alive) setData(list);
      } catch {
        if (alive) setError('Failed to load products');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}

/**
 * Input: none
 * Process: Fetch featured products only; manage loading and error states
 * Output: { data: Product[]; loading: boolean; error?: string }
 */
export function useFeaturedProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const list = await getFeaturedProducts();
        if (alive) setData(list);
      } catch {
        if (alive) setError('Failed to load featured products');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}