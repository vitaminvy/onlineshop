// Category: Store and organize products into groups
export type Category = {
  id: string;
  name: string;
  slug: string;
};
// Product:  Display products, handle sales, and manage inventory
export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;         // VND
  categoryId: string;
  thumbnail: string;
  stock: number;
  shortDesc?: string;
};
// CartItem: Manage user's shopping cart
export type CartItem = {
  productId: string;
  quantity: number;
};
