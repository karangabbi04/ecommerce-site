import ProductGallerySkeleton from "./ProductGallerySkeleton";
import ProductInfoSkeleton from "./ProductInfoSkeleton";
import RecommendedProductsSkeleton from "./RecommendedProductsSkeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8 lg:py-12">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </div>

        {/* Product Section */}
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <ProductGallerySkeleton />

          <ProductInfoSkeleton />
        </section>

        <Separator className="my-16" />

        {/* 3D / AR Placeholder */}
        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-6 space-y-3">
            <div className="h-7 w-56 animate-pulse rounded bg-muted" />
            <div className="h-4 w-80 animate-pulse rounded bg-muted" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border p-6"
              >
                <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />

                <div className="mt-6 h-5 w-32 animate-pulse rounded bg-muted" />

                <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-muted" />

                <div className="mt-8 h-11 w-full animate-pulse rounded-xl bg-muted" />
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Recommended Products */}
        <RecommendedProductsSkeleton />
      </div>
    </main>
  );
}