import type { Product } from '@/type';
import { products as SOURCE } from '@/data/products';
import { categories } from '@/data/categories';

/**
 * Input: ms (optional)
 * Process: simulate network latency
 * Output: resolved promise after delay
 */
const sleep = (ms = 200) => new Promise(r => setTimeout(r, ms));

/**
 * Input: shared mock list (SOURCE)
 * Process: normalize optional fields and ensure required ones
 * Output: Product[]
 */
function normalize(raw: typeof SOURCE): Product[] {
  return raw.map(item => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    categoryId: item.categoryId,
    brand: item.brand,
    price: item.price,
    images: item.images,
    stock: item.stock,
    specs: item.specs,
    thumbnail: item.thumbnail ?? item.images?.[0] ?? '',
    shortDesc: item.shortDesc ?? '',
    isFeatured: item.isFeatured ?? false,
  }));
}

// In‑memory snapshot for fake API
const DB = normalize(SOURCE);

/**
 * Input: none
 * Process: return all products
 * Output: Product[]
 */
export async function getProducts(): Promise<Product[]> {
  await sleep();
  return DB;
}

/**
 * Input: slug
 * Process: find product by slug
 * Output: Product | undefined
 */
export async function getProductBySlug(slug: string) {
  await sleep();
  return DB.find(p => p.slug === slug);
}

/**
 * Input: none
 * Process: filter products by featured flag
 * Output: Product[]
 */
export async function getFeaturedProducts() {
  await sleep();
  return DB.filter(p => p.isFeatured);
}

/**
 * Input: category slug
 * Process: resolve id then filter by category
 * Output: Product[]
 */
export async function getProductsByCategorySlug(catSlug: string) {
  await sleep();
  const cat = categories.find(c => c.slug === catSlug);
  return cat ? DB.filter(p => p.categoryId === cat.id) : [];
}