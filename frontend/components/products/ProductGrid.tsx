"use client";

import { memo } from "react";
import { AlertTriangle } from "lucide-react";

import { Product } from "@/types/product";

import ProductCard from "./ProductCard";
import ProductSkeleton from "./product-skeleton";
import EmptyState from "./EmptyState";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface ProductGridProps {
  products: Product[];

  isLoading?: boolean;

  isFetching?: boolean;

  error?: Error | null;

  skeletonCount?: number;
}

function ProductGrid({
  products,

  isLoading = false,

  isFetching = false,

  error,

  skeletonCount = 8,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <ProductSkeleton
        count={skeletonCount}
      />
    );
  }

  if (error) {
    return (
      <Alert
        variant="destructive"
        className="rounded-2xl"
      >
        <AlertTriangle className="h-5 w-5" />

        <AlertTitle>
          Something went wrong
        </AlertTitle>

        <AlertDescription>
          {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No Products Found"
        description="Try changing your filters or search keyword."
      />
    );
  }

  return (
    <>
      {isFetching && (
        <p className="mb-4 text-sm text-muted-foreground">
          Updating products...
        </p>
      )}

      <section
        aria-label="Product Grid"
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
      </section>
    </>
  );
}

export default memo(ProductGrid);