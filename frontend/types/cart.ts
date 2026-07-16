export interface CartImage {
  id: string;
  url: string;
  altText?: string | null;
}

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: CartImage[];
}

export interface CartItem {
  id: string;
  quantity: number;

  product: CartProduct;
}

export interface Cart {
  id: string;
  userId: string | null;
  guestId: string | null;
}

export interface CartResponse {
  cart: Cart;
  items: CartItem[];

  subtotal: number;
  totalItems: number;
}