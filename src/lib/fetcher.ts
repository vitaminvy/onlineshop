import type { Product, ID } from '@/type';


const RAW: Array<{
  id: ID;
  slug: string;
  name: string;
  categoryId: ID;
  brand: string;
  price: number;
  images: string[];
  stock: number;
  specs: Record<string, string>;
  thumbnail?: string;
  shortDesc?: string;
}> = [
  {
    id: 'p-ic-555',
    slug: 'ne555-timer-ic',
    name: 'NE555 Timer IC',
    categoryId: 'cat-ic',
    brand: 'Texas Instruments',
    price: 9500,
    images: ['/img/ne555-1.jpg', '/img/ne555-2.jpg'],
    stock: 120,
    specs: { package: 'DIP-8', voltage: '4.5–16V' },
    thumbnail: '/img/ne555-1.jpg',
    shortDesc: 'Versatile timer for oscillators and PWM.'
  },
  {
    id: 'p-res-10k',
    slug: 'resistor-10k-1-4w',
    name: 'Resistor 10kΩ 1/4W',
    categoryId: 'cat-resistor',
    brand: 'Yageo',
    price: 150,
    images: ['/img/res-10k.jpg'],
    stock: 5000,
    specs: { tolerance: '±5%', power: '0.25W' },
    thumbnail: '/img/res-10k.jpg',
    shortDesc: 'Carbon film resistor for general purpose.'
  }
];

/**
 * Input: raw list from dataset or API
 * Process: ensure required fields exist and map to Product type
 * Output: array of Product suitable for UI usage
 */
function normalize(raw: typeof RAW): Product[] {
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
    thumbnail: item.thumbnail ?? item.images[0] ?? '',
    shortDesc: item.shortDesc
  }));
}

/**
 * Simple in-memory "API" for Day 1.
 */
const DB = normalize(RAW);

/**
 * Input: none
 * Process: return all products
 * Output: Product[]
 */
export async function getProducts(): Promise<Product[]> {
  return DB;
}

/**
 * Input: slug (string)
 * Process: find product by slug
 * Output: Product or undefined
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return DB.find(p => p.slug === slug);
}
