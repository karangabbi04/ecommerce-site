import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  count?: number;
}

export default function ProductSkeleton({
  count = 8,
}: Props) {
  return (
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
      {Array.from({
        length: count,
      }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden rounded-3xl"
        >
          <Skeleton
            className="
            aspect-square
            w-full
          "
          />

          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-5 w-20 rounded-full" />

            <Skeleton className="h-6 w-3/4" />

            <Skeleton className="h-4 w-full" />

            <Skeleton className="h-4 w-4/5" />

            <div
              className="
              flex
              items-center
              justify-between
              pt-2
            "
            >
              <Skeleton className="h-8 w-24" />

              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}