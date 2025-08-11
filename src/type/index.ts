export type Category = {
  id: string;
  name: string;
  slug: string;
};

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

export type CartItem = {
  productId: string;
  quantity: number;
};
