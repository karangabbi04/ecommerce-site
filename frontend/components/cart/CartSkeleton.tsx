"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CartSkeleton() {
  return (
    <div className="space-y-4 p-4">

      {Array.from({ length: 3 }).map((_, index) => (

        <div
          key={index}
          className="flex gap-4 rounded-2xl border p-4"
        >

          <Skeleton className="h-20 w-20 rounded-xl" />

          <div className="flex-1 space-y-3">

            <Skeleton className="h-4 w-40" />

            <Skeleton className="h-4 w-20" />

            <Skeleton className="h-8 w-28 rounded-xl" />

          </div>

        </div>

      ))}

    </div>
  );
}