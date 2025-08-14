
/**
 * Primary ID type alias for consistency across the app.
 */
export type ID = string;

/**
 * A single product specification key-value map.
 */
export type ProductSpecs = Record<string, string>;

/**
 * Core Product model used throughout the app.
 * Required fields are chosen to avoid TS errors seen previously (brand/images/specs).
 */
export type Product = {
  id: ID;
  slug: string;
  name: string;
  categoryId: ID;
  brand: string;
  price: number;
  images: string[];     // full gallery
  thumbnail: string;    // main thumbnail URL
  stock: number;        // units in stock
  specs: ProductSpecs;  // normalized specs map
  shortDesc?: string;   // optional short description
};

/**
 * Cart line item
 */
export type CartItem = {
  productId: ID;
  quantity: number;
};
