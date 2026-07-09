"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function RecommendedProductsSkeleton() {
  return (
    <section className="mt-20">
      <Skeleton className="h-6 w-36" />

      <Skeleton className="mt-4 h-12 w-72" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border p-4"
          >
            <Skeleton className="aspect-square w-full rounded-xl" />

            <Skeleton className="mt-4 h-5 w-3/4" />

            <Skeleton className="mt-3 h-4 w-full" />

            <Skeleton className="mt-2 h-4 w-2/3" />

            <Skeleton className="mt-6 h-10 w-full rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}