import type { Product } from "@/type";
import { categories } from "@/data/categories";

/**
 * Input: category slug
 * Process: resolve id then filter by category
 * Output: Product[]
 */
export async function getProductsByCategorySlug(catSlug: string) {
  // Fetch all products from mock API then filter by category slug
  const all = await getProducts();
  if (!catSlug || catSlug === "all") return all;

  const cat = categories.find((c) => c.slug === catSlug);
  return cat ? all.filter((p) => p.categoryId === cat.id) : [];
}
/**
 * Input: none
 * Process: fetch static JSON from /api/products.json
 * Output: array of Product
 */
export async function getProducts(): Promise<Product[]> {
  const res = await fetch("/api/products.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }
  const data = (await res.json()) as Product[];
  return data;
}

/**
 * Input: slug (string)
 * Process: fetch all then find by slug (mock-friendly approach)
 * Output: Product or undefined
 */
export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

/**
 * Input: ids (string[])
 * Process: fetch all then filter by matched ids
 * Output: subset of Product[]
 */
export async function getCompare(ids: string[]): Promise<Product[]> {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const all = await getProducts();
  const set = new Set(ids);
  return all.filter((p) => set.has(p.id));
}
/**
 * Input: none
 * Process: fetch all then filter by isFeatured flag
 * Output: subset of Product[]
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.isFeatured);
}
