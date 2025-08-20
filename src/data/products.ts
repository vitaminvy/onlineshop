import type { Product } from '@/type';

/**
 * Input: none
 * Process: build ~100 mock products across categories with variant generation
 * Output: export const products: Product[]
 */

// Small helper to normalize slugs & make image URLs deterministic
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const img = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/480`;

/**
 * Input: base info + variant list
 * Process: create Product[] with ids, slugs, prices, stocks, specs per variant
 * Output: an array of products within one category
 */
function makeVariants(opts: {
  prefixId: string;
  categoryId: string;
  brand: string;
  baseName: string;
  baseSpecs?: Record<string, string>;
  variants: Array<{ name: string; specs?: Record<string, string>; price: number; stock?: number; featured?: boolean }>;
}): Product[] {
  return opts.variants.map((v, idx) => {
    const name = `${opts.baseName} ${v.name}`.trim();
    const slug = slugify(`${opts.baseName}-${v.name}`);
    return {
      id: `${opts.prefixId}-${idx + 1}`,
      slug,
      name,
      categoryId: opts.categoryId,
      brand: opts.brand,
      price: v.price,
      images: [img(slug)],
      thumbnail: img(slug),
      stock: v.stock ?? Math.max(0, 20 + (idx * 7) % 180),
      specs: { ...(opts.baseSpecs ?? {}), ...(v.specs ?? {}) },
      shortDesc: `${opts.baseName} variant ${v.name}`,
      isFeatured: v.featured ?? false,
    };
  });
}

/**
 * Input: none
 * Process: assemble products across all categories using makeVariants()
 * Output: single flat Product[] with length ~100
 */
const list: Product[] = [
  // === IC & Microcontrollers (cat-ic) ===
  ...makeVariants({
    prefixId: 'ic',
    categoryId: 'cat-ic',
    brand: 'Microchip',
    baseName: 'ATmega',
    baseSpecs: { family: 'AVR', voltage: '5V' },
    variants: [
      { name: '328P DIP-28', specs: { package: 'DIP-28', speed: '20MHz' }, price: 45000, featured: true },
      { name: '328P TQFP-32', specs: { package: 'TQFP-32', speed: '20MHz' }, price: 48000 },
      { name: '32U4 TQFP-44', specs: { package: 'TQFP-44', usb: 'Yes' }, price: 69000 },
      { name: '16A DIP-40', specs: { package: 'DIP-40', speed: '16MHz' }, price: 52000 },
      { name: '644P DIP-40', specs: { package: 'DIP-40', flash: '64KB' }, price: 65000 },
    ],
  }),
  ...makeVariants({
    prefixId: 'ic-ti',
    categoryId: 'cat-ic',
    brand: 'Texas Instruments',
    baseName: 'LM',
    variants: [
      { name: '7805 Regulator TO-220', specs: { output: '5V', current: '1A' }, price: 9000 },
      { name: '317 Adjustable TO-220', specs: { output: '1.25–37V', current: '1.5A' }, price: 12000 },
      { name: '358 Op-Amp SOIC-8', specs: { channels: '2', package: 'SOIC-8' }, price: 7000 },
      { name: '324 Op-Amp DIP-14', specs: { channels: '4', package: 'DIP-14' }, price: 8500 },
      { name: '555 Timer DIP-8', specs: { package: 'DIP-8' }, price: 6000, featured: true },
    ],
  }),

  // === Resistors (cat-resistor) ===
  ...makeVariants({
    prefixId: 'res',
    categoryId: 'cat-resistor',
    brand: 'Yageo',
    baseName: 'Resistor 1/4W ±5%',
    baseSpecs: { power: '0.25W', tolerance: '±5%' },
    variants: [
      { name: '10Ω (100 pcs)', specs: { resistance: '10Ω' }, price: 12000, stock: 800 },
      { name: '47Ω (100 pcs)', specs: { resistance: '47Ω' }, price: 12000, stock: 900 },
      { name: '100Ω (100 pcs)', specs: { resistance: '100Ω' }, price: 12000, stock: 1000 },
      { name: '220Ω (100 pcs)', specs: { resistance: '220Ω' }, price: 12000, stock: 1000, featured: true },
      { name: '330Ω (100 pcs)', specs: { resistance: '330Ω' }, price: 12000, stock: 950 },
      { name: '470Ω (100 pcs)', specs: { resistance: '470Ω' }, price: 12000, stock: 1000 },
      { name: '680Ω (100 pcs)', specs: { resistance: '680Ω' }, price: 12000 },
      { name: '1kΩ (100 pcs)', specs: { resistance: '1kΩ' }, price: 13000 },
      { name: '2.2kΩ (100 pcs)', specs: { resistance: '2.2kΩ' }, price: 13000 },
      { name: '3.3kΩ (100 pcs)', specs: { resistance: '3.3kΩ' }, price: 13000 },
      { name: '4.7kΩ (100 pcs)', specs: { resistance: '4.7kΩ' }, price: 13000, featured: true },
      { name: '5.6kΩ (100 pcs)', specs: { resistance: '5.6kΩ' }, price: 13000 },
      { name: '10kΩ (100 pcs)', specs: { resistance: '10kΩ' }, price: 14000 },
      { name: '22kΩ (100 pcs)', specs: { resistance: '22kΩ' }, price: 14000 },
      { name: '33kΩ (100 pcs)', specs: { resistance: '33kΩ' }, price: 14000 },
      { name: '47kΩ (100 pcs)', specs: { resistance: '47kΩ' }, price: 14000 },
      { name: '68kΩ (100 pcs)', specs: { resistance: '68kΩ' }, price: 15000 },
      { name: '100kΩ (100 pcs)', specs: { resistance: '100kΩ' }, price: 15000 },
      { name: '220kΩ (100 pcs)', specs: { resistance: '220kΩ' }, price: 15000 },
      { name: '1MΩ (100 pcs)', specs: { resistance: '1MΩ' }, price: 16000 },
    ],
  }),

  // === Sensors (cat-sensor) ===
  ...makeVariants({
    prefixId: 'sns',
    categoryId: 'cat-sensor',
    brand: 'Generic',
    baseName: 'Sensor',
    variants: [
      { name: 'DHT11 Temperature & Humidity', specs: { type: 'DHT11' }, price: 19000, featured: true },
      { name: 'DHT22 Temperature & Humidity', specs: { type: 'DHT22' }, price: 45000 },
      { name: 'HC-SR04 Ultrasonic', specs: { range: '2–400cm' }, price: 25000 },
      { name: 'MQ-2 Gas', specs: { gas: 'LPG, Smoke' }, price: 30000 },
      { name: 'MQ-135 Air Quality', specs: { gas: 'Air pollutants' }, price: 38000 },
      { name: 'PIR Motion HC-SR501', specs: { voltage: '5–20V' }, price: 22000 },
      { name: 'MPU6050 6-DOF', specs: { interface: 'I2C' }, price: 35000 },
      { name: 'BMP280 Pressure', specs: { interface: 'I2C/SPI' }, price: 42000 },
      { name: 'DS18B20 Temperature', specs: { interface: '1-Wire' }, price: 28000 },
      { name: 'RC522 RFID Kit', specs: { freq: '13.56MHz' }, price: 39000 },
      { name: 'GY-521 MPU-6050 Breakout', specs: { interface: 'I2C' }, price: 33000 },
      { name: 'TCS3200 Color', specs: { feature: 'Color detection' }, price: 52000 },
    ],
  }),

  // === Power Modules (cat-power) ===
  ...makeVariants({
    prefixId: 'pwr',
    categoryId: 'cat-power',
    brand: 'DIYmall',
    baseName: 'DC-DC Module',
    variants: [
      { name: 'Buck XL4015 5A', specs: { type: 'Buck', current: '5A' }, price: 45000, featured: true },
      { name: 'Buck LM2596 3A', specs: { type: 'Buck', current: '3A' }, price: 35000 },
      { name: 'Boost MT3608', specs: { type: 'Boost', current: '2A' }, price: 30000 },
      { name: 'Buck-Boost SEPIC', specs: { type: 'Buck-Boost' }, price: 65000 },
      { name: 'Adjustable LM317 Board', specs: { type: 'Linear' }, price: 28000 },
      { name: 'AMS1117-3.3 Regulator', specs: { type: 'Linear', output: '3.3V' }, price: 10000 },
      { name: 'AMS1117-5.0 Regulator', specs: { type: 'Linear', output: '5V' }, price: 10000 },
      { name: 'Power Bank 18650 5V/2A', specs: { cells: '1x18650' }, price: 42000 },
      { name: 'UPS 5V Mini', specs: { backup: 'Li-ion' }, price: 89000 },
      { name: 'BMS 2S 10A', specs: { cells: '2S', current: '10A' }, price: 26000 },
      { name: 'BMS 3S 20A', specs: { cells: '3S', current: '20A' }, price: 36000 },
      { name: 'Step-down 9V to 5V USB', specs: { output: '5V USB' }, price: 24000 },
    ],
  }),

  // === Capacitors (cat-capacitor) ===
  ...makeVariants({
    prefixId: 'cap',
    categoryId: 'cat-capacitor',
    brand: 'Nichicon',
    baseName: 'Electrolytic Capacitor',
    baseSpecs: { type: 'Electrolytic' },
    variants: [
      { name: '10uF 25V (10 pcs)', specs: { capacitance: '10uF', voltage: '25V' }, price: 12000 },
      { name: '22uF 25V (10 pcs)', specs: { capacitance: '22uF', voltage: '25V' }, price: 12000 },
      { name: '47uF 25V (10 pcs)', specs: { capacitance: '47uF', voltage: '25V' }, price: 13000 },
      { name: '100uF 25V (10 pcs)', specs: { capacitance: '100uF', voltage: '25V' }, price: 14000, featured: true },
      { name: '220uF 25V (10 pcs)', specs: { capacitance: '220uF', voltage: '25V' }, price: 16000 },
      { name: '470uF 25V (10 pcs)', specs: { capacitance: '470uF', voltage: '25V' }, price: 19000 },
      { name: '1000uF 25V (10 pcs)', specs: { capacitance: '1000uF', voltage: '25V' }, price: 26000 },
      { name: '10uF 50V (10 pcs)', specs: { capacitance: '10uF', voltage: '50V' }, price: 15000 },
      { name: '47uF 50V (10 pcs)', specs: { capacitance: '47uF', voltage: '50V' }, price: 17000 },
      { name: '100uF 50V (10 pcs)', specs: { capacitance: '100uF', voltage: '50V' }, price: 22000 },
      { name: '220uF 50V (10 pcs)', specs: { capacitance: '220uF', voltage: '50V' }, price: 26000 },
      { name: '470uF 50V (10 pcs)', specs: { capacitance: '470uF', voltage: '50V' }, price: 32000 },
      { name: '1uF (10 pcs) Film', specs: { capacitance: '1uF', type: 'Film' }, price: 12000 },
      { name: '100nF (100 pcs) Ceramic', specs: { capacitance: '100nF', type: 'Ceramic' }, price: 18000 },
      { name: '1nF (100 pcs) Ceramic', specs: { capacitance: '1nF', type: 'Ceramic' }, price: 17000 },
    ],
  }),

  // === LEDs (cat-led) ===
  ...makeVariants({
    prefixId: 'led',
    categoryId: 'cat-led',
    brand: 'Everlight',
    baseName: 'LED 5mm',
    variants: [
      { name: 'Red (50 pcs)', specs: { color: 'Red' }, price: 14000 },
      { name: 'Green (50 pcs)', specs: { color: 'Green' }, price: 14000 },
      { name: 'Blue (50 pcs)', specs: { color: 'Blue' }, price: 15000, featured: true },
      { name: 'Yellow (50 pcs)', specs: { color: 'Yellow' }, price: 14000 },
      { name: 'White (50 pcs)', specs: { color: 'White' }, price: 16000 },
      { name: 'RGB (Common Anode 10 pcs)', specs: { color: 'RGB' }, price: 28000 },
      { name: 'IR 940nm (20 pcs)', specs: { color: 'IR 940nm' }, price: 22000 },
      { name: 'UV 395nm (10 pcs)', specs: { color: 'UV 395nm' }, price: 35000 },
    ],
  }),
  ...makeVariants({
    prefixId: 'led-strp',
    categoryId: 'cat-led',
    brand: 'Generic',
    baseName: 'LED Strip',
    variants: [
      { name: 'WS2812B 1m (60 LEDs)', specs: { type: 'Addressable' }, price: 69000 },
      { name: 'WS2812B 5m (300 LEDs)', specs: { type: 'Addressable' }, price: 299000, featured: true },
      { name: '3528 5m Warm White', specs: { type: 'Non-addressable' }, price: 85000 },
      { name: '5050 5m RGB', specs: { type: 'Non-addressable' }, price: 139000 },
    ],
  }),

  // === Motors (cat-motor) ===
  ...makeVariants({
    prefixId: 'mot',
    categoryId: 'cat-motor',
    brand: 'Generic',
    baseName: 'DC Motor',
    variants: [
      { name: '6V Mini', specs: { voltage: '6V' }, price: 29000 },
      { name: '12V High Torque', specs: { voltage: '12V' }, price: 79000 },
      { name: '12V with Gearbox', specs: { voltage: '12V', gear: '1:48' }, price: 99000 },
    ],
  }),
  ...makeVariants({
    prefixId: 'mot-servo',
    categoryId: 'cat-motor',
    brand: 'TowerPro',
    baseName: 'Servo',
    variants: [
      { name: 'SG90 9g', specs: { torque: '1.8kg·cm' }, price: 45000, featured: true },
      { name: 'MG90S Metal', specs: { torque: '2.2kg·cm' }, price: 79000 },
      { name: 'MG996R', specs: { torque: '10kg·cm' }, price: 119000 },
    ],
  }),
  ...makeVariants({
    prefixId: 'mot-step',
    categoryId: 'cat-motor',
    brand: 'Generic',
    baseName: 'Stepper',
    variants: [
      { name: '28BYJ-48 + ULN2003', specs: { step: '64:1' }, price: 59000 },
      { name: 'NEMA17', specs: { step: '1.8°' }, price: 199000 },
      { name: 'NEMA17 High Torque', specs: { step: '1.8°', torque: '59N·cm' }, price: 289000 },
    ],
  }),

  // === MCU Boards (cat-mcu) ===
  ...makeVariants({
    prefixId: 'mcu',
    categoryId: 'cat-mcu',
    brand: 'Arduino',
    baseName: 'Arduino Board',
    variants: [
      { name: 'UNO R3', specs: { mcu: 'ATmega328P' }, price: 139000, featured: true },
      { name: 'Nano V3', specs: { mcu: 'ATmega328P' }, price: 115000 },
      { name: 'Mega 2560', specs: { mcu: 'ATmega2560' }, price: 199000 },
      { name: 'Pro Mini 5V/16MHz', specs: { mcu: 'ATmega328P' }, price: 89000 },
    ],
  }),
  ...makeVariants({
    prefixId: 'mcu-esp',
    categoryId: 'cat-mcu',
    brand: 'Espressif',
    baseName: 'ESP DevKit',
    variants: [
      { name: 'ESP8266 NodeMCU', specs: { wifi: '2.4GHz' }, price: 89000 },
      { name: 'ESP32-WROOM-32', specs: { wifi: '2.4GHz', bt: 'BLE' }, price: 129000, featured: true },
      { name: 'ESP32-C3', specs: { wifi: '2.4GHz', bt: 'BLE5' }, price: 119000 },
    ],
  }),
  ...makeVariants({
    prefixId: 'mcu-st',
    categoryId: 'cat-mcu',
    brand: 'ST',
    baseName: 'STM32 Board',
    variants: [
      { name: 'Blue Pill F103C8T6', specs: { core: 'Cortex-M3' }, price: 99000 },
      { name: 'Black Pill F411CEU6', specs: { core: 'Cortex-M4' }, price: 159000 },
      { name: 'Nucleo-F303K8', specs: { core: 'Cortex-M4' }, price: 199000 },
    ],
  }),
];

// Ensure at least ~100 items (current length is already > 100 with all variants)
export const products: Product[] = list;