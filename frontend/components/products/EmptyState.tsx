import { ShoppingBag } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No Products Found",
  description = "Try changing your search or filters.",
}: EmptyStateProps) {
  return (
    <Card className="rounded-3xl border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-20 text-center">

        <div className="mb-6 rounded-full bg-muted p-5">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>

        <h2 className="text-2xl font-semibold">
          {title}
        </h2>

        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          {description}
        </p>

      </CardContent>
    </Card>
  );
}