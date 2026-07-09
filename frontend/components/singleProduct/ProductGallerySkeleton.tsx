"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductGallerySkeleton() {
  return (
    <section className="rounded-[2rem] border border-border bg-background p-4 shadow-sm lg:p-6">
      <div className="grid gap-6 lg:grid-cols-[88px_1fr]">
        {/* Desktop Thumbnails */}
        <div className="hidden lg:flex lg:flex-col lg:gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[88px] w-[88px] rounded-xl"
            />
          ))}
        </div>

        {/* Main Image */}
        <Skeleton className="aspect-square w-full rounded-3xl" />
      </div>

      {/* Mobile Thumbnails */}
      <div className="mt-5 flex gap-3 overflow-hidden lg:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-20 w-20 rounded-xl shrink-0"
          />
        ))}
      </div>
    </section>
  );
}