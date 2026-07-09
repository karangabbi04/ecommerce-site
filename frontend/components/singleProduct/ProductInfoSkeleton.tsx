"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductInfoSkeleton() {
  return (
    <section className="rounded-[2rem] border border-border bg-background p-6 shadow-sm lg:p-8">
      <Skeleton className="h-6 w-28 rounded-full" />

      <Skeleton className="mt-6 h-12 w-4/5" />

      <Skeleton className="mt-4 h-5 w-full" />
      <Skeleton className="mt-2 h-5 w-11/12" />
      <Skeleton className="mt-2 h-5 w-3/4" />

      <Skeleton className="mt-8 h-12 w-44" />

      <div className="mt-8 flex gap-3">
        <Skeleton className="h-11 w-28 rounded-full" />
        <Skeleton className="h-11 w-28 rounded-full" />
      </div>

      <div className="mt-8 flex gap-4">
        <Skeleton className="h-12 w-36 rounded-full" />
        <Skeleton className="h-12 flex-1 rounded-full" />
      </div>

      <Skeleton className="mt-4 h-12 w-full rounded-full" />
    </section>
  );
}