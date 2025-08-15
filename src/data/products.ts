import type { Product } from '@/type';

/**
 * Input: none
 * Process: provide static products (thumbnail falls back to first image in fetcher normalize)
 * Output: Product[]
 */
export const products: Product[] = [
  {
    id: 'p-ic-555',
    slug: 'ne555-timer-ic',
    name: 'NE555 Timer IC',
    categoryId: 'cat-ic',
    brand: 'Texas Instruments',
    price: 9500,
    images: ['/img/ne555-1.jpg', '/img/ne555-2.jpg'],
    thumbnail: '/img/ne555-1.jpg',
    stock: 120,
    specs: { package: 'DIP-8', voltage: '4.5–16V' },
    shortDesc: 'Versatile timer for oscillators and PWM.',
    isFeatured: true, 
  },
  {
    id: 'p-res-10k',
    slug: 'resistor-10k-1-4w',
    name: 'Resistor 10kΩ 1/4W',
    categoryId: 'cat-resistor',
    brand: 'Yageo',
    price: 150,
    images: ['/img/res-10k.jpg'],
    thumbnail: '/img/res-10k.jpg',
    stock: 5000,
    specs: { tolerance: '±5%', power: '0.25W' },
    shortDesc: 'Carbon film resistor for general purpose.',
    isFeatured: true, 
  },
];