import type { ID } from '@/type';

/**
 * Input: none
 * Process: provide static categories for filtering and navigation
 * Output: Array<{ id, name, slug }>
 */
export const categories: { id: ID; name: string; slug: string }[] = [
  { id: 'cat-ic',       name: 'IC & Microcontrollers', slug: 'ic' },
  { id: 'cat-resistor', name: 'Resistors',             slug: 'resistors' },
  { id: 'cat-sensor',   name: 'Sensors',               slug: 'sensors' },
  { id: 'cat-power',    name: 'Power Modules',         slug: 'power' },
  { id: 'cat-capacitor',  name: 'Capacitors',            slug: 'capacitors' },
  { id: 'cat-led',        name: 'LEDs',                  slug: 'leds' },
  { id: 'cat-motor',      name: 'Motors',                slug: 'motors' },
  { id: 'cat-mcu',        name: 'MCU Boards',            slug: 'mcu' },
];