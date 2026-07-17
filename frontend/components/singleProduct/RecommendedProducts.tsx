"use client";

import ProductCard from "../products/ProductCard";
import { Product } from "@/types/product";

type RecommendedProductsProps = {
  products: Product[];
};

export default function RecommendedProducts({
  products,
}: RecommendedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight">
          You May Also Like
        </h2>

        <p className="mt-2 text-muted-foreground">
          Explore more handcrafted products carefully selected for you.
        </p>
      </div>

      {/* Products */}
      <div
        className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}