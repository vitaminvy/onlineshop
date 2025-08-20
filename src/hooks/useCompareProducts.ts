import { useEffect, useState } from 'react';
import type { Product } from '@/type';
import { getCompare } from '@/lib/fetcher';

/**
 * Small hook to fetch compare products via mock API.
 * Input: ids (string[])
 * Process: call getCompare(ids) and manage loading/error states
 * Output: { data, loading, error }
 */
export function useCompareProducts(ids: string[]) {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

   
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCompare(ids);
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
    // Use ids as trigger (stringify-like key to avoid ref identity traps)
  }, [ids]);

  return { data, loading, error };
}