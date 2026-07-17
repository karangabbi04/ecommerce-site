import { Product } from "@/types/product";

export function sortProducts(
  products: Product[],
  sort: string
) {
  switch (sort) {
    case "low-high":
      return [...products].sort(
        (a, b) => a.price - b.price
      );

    case "high-low":
      return [...products].sort(
        (a, b) => b.price - a.price
      );

    default:
      return products;
  }
}