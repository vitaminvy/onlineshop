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
  {
  id: 'p-cap-100nf',
  slug: 'capacitor-100nf-50v',
  name: 'Ceramic Capacitor 100nF 50V',
  categoryId: 'cat-capacitor',
  brand: 'Murata',
  price: 200,
  images: ['/img/cap-100nf.jpg'],
  stock: 3000,
  specs: { capacitance: '100nF', voltage: '50V', tolerance: '±10%' },
  thumbnail: '/img/cap-100nf.jpg',
  shortDesc: 'General purpose ceramic capacitor.',
  isFeatured: false
},
{
  id: 'p-led-5mm-red',
  slug: 'led-5mm-red',
  name: 'LED 5mm Red',
  categoryId: 'cat-led',
  brand: 'Kingbright',
  price: 300,
  images: ['/img/led-red.jpg'],
  stock: 2000,
  specs: { diameter: '5mm', color: 'Red', forwardVoltage: '2.0V' },
  thumbnail: '/img/led-red.jpg',
  shortDesc: 'Bright red LED for indicators.',
  isFeatured: true
},
{
  id: 'p-motor-dc3v',
  slug: 'dc-motor-3v',
  name: 'DC Motor 3V',
  categoryId: 'cat-motor',
  brand: 'Generic',
  price: 12000,
  images: ['/img/motor-dc3v.jpg'],
  stock: 500,
  specs: { voltage: '3V', speed: '12000 RPM' },
  thumbnail: '/img/motor-dc3v.jpg',
  shortDesc: 'Mini DC motor for DIY projects.',
  isFeatured: true
},
{
  id: 'p-sensor-dht11',
  slug: 'temperature-humidity-sensor-dht11',
  name: 'Temperature & Humidity Sensor DHT11',
  categoryId: 'cat-sensor',
  brand: 'Aosong',
  price: 15000,
  images: ['/img/dht11.jpg'],
  stock: 800,
  specs: { temperatureRange: '0–50°C', humidityRange: '20–90%' },
  thumbnail: '/img/dht11.jpg',
  shortDesc: 'Basic temperature and humidity sensor.',
  isFeatured: false
},
{
  id: 'p-arduino-uno',
  slug: 'arduino-uno-r3',
  name: 'Arduino Uno R3',
  categoryId: 'cat-mcu',
  brand: 'Arduino',
  price: 250000,
  images: ['/img/arduino-uno.jpg'],
  stock: 150,
  specs: { microcontroller: 'ATmega328P', operatingVoltage: '5V' },
  thumbnail: '/img/arduino-uno.jpg',
  shortDesc: 'Popular microcontroller board for beginners.',
  isFeatured: true
}
];