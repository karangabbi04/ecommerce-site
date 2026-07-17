"use client";

import { Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  maxStock: number;
  loading?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantitySelector({
  quantity,
  maxStock,
  loading = false,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center rounded-xl border bg-background">

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={loading || quantity <= 1}
        onClick={onDecrease}
        className="h-8 w-8 rounded-l-xl rounded-r-none"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="flex h-8 min-w-10 items-center justify-center text-sm font-semibold">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          quantity
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={loading || quantity >= maxStock}
        onClick={onIncrease}
        className="h-8 w-8 rounded-r-xl rounded-l-none"
      >
        <Plus className="h-4 w-4" />
      </Button>

    </div>
  );
}