"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function KPICardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Left Content */}
          <div className="flex-1 space-y-4">
            {/* Title */}
            <Skeleton className="h-4 w-24 rounded-md" />

            {/* Value */}
            <Skeleton className="h-9 w-36 rounded-md" />

            {/* Trend + Description */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
          </div>

          {/* Icon */}
          <Skeleton className="h-14 w-14 rounded-2xl" />
        </div>

        {/* Sparkline */}
        <div className="mt-6">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}