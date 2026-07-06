import { Prisma } from "@prisma/client";

export type ProductWithImages =
  Prisma.ProductGetPayload<{
    include: {
      images: true;
    };
  }>;

export const transformProduct = (
  product: ProductWithImages
) => ({
  ...product,

  price: Number(product.price),

  oldPrice: product.oldPrice
    ? Number(product.oldPrice)
    : null,
});

export const transformProducts = (
  products: ProductWithImages[]
) => products.map(transformProduct);