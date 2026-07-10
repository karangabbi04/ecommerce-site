import { Prisma } from "@prisma/client";
import { CartPayload } from "../select/cart.selects";

export interface CartResponse {
  id: string;
  userId: string | null;
  guestId: string | null;

  totalItems: number;
  subtotal: number;

  items: {
    id: string;

    productId: string;
    name: string;
    slug: string;

    price: number;
    oldPrice: number | null;

    quantity: number;
    total: number;

    stock: number;

    image: string | null;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

export const mapCart = (
  cart: CartPayload
): CartResponse => {
  let subtotal = 0;
  let totalItems = 0;

  const items = cart.items.map((item) => {
    const price = Number(item.product.price);
    const oldPrice = item.product.oldPrice
      ? Number(item.product.oldPrice)
      : null;

    const total = Number(item.product.price) * item.quantity;

    subtotal += total;
    totalItems += item.quantity;

    return {
      id: item.id,

      productId: item.product.id,

      name: item.product.name,

      slug: item.product.slug,

      price,

      oldPrice,

      quantity: item.quantity,

      total,

      stock: item.product.stock,

      image:
        item.product.images.length > 0
          ? item.product.images[0].url
          : null,
    };
  });

  return {
    id: cart.id,

    userId: cart.userId ?? null,

    guestId: cart.guestId ?? null,

    totalItems,

    subtotal,

    items,

    createdAt: cart.createdAt,

    updatedAt: cart.updatedAt,
  };
};

export interface ClientCartResponse {
  cart: {
    id: string;
    userId: string | null;
    guestId: string | null;
  };
  items: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      stock: number;
      images: {
        id: string;
        url: string;
      }[];
    };
  }[];
  subtotal: number;
  totalItems: number;
}

export const mapToClientCartResponse = (
  cart: CartPayload
): ClientCartResponse => {
  const mapped = mapCart(cart);

  return {
    cart: {
      id: mapped.id,
      userId: mapped.userId,
      guestId: mapped.guestId,
    },
    items: mapped.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.productId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        stock: item.stock,
        images: item.image
          ? [{ id: item.productId, url: item.image }]
          : [],
      },
    })),
    subtotal: mapped.subtotal,
    totalItems: mapped.totalItems,
  };
};