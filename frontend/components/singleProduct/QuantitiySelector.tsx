"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuantitySelectorProps = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  canIncrease?: boolean;
  canDecrease?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function QuantitySelector({
  value,
  onIncrease,
  onDecrease,
  canIncrease = true,
  canDecrease = true,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  return (
    <div
      className={cn(
        "inline-flex h-12 items-center rounded-xl border bg-background shadow-sm",
        className
      )}
    >
      {/* Decrease */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Decrease quantity"
        disabled={disabled || !canDecrease}
        onClick={onDecrease}
        className="h-full w-12 rounded-r-none"
      >
        <Minus className="h-4 w-4" />
      </Button>

      {/* Quantity */}
      <div className="flex h-full min-w-14 items-center justify-center border-x px-4">
        <span className="text-sm font-semibold tabular-nums">
          {value}
        </span>
      </div>

      {/* Increase */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Increase quantity"
        disabled={disabled || !canIncrease}
        onClick={onIncrease}
        className="h-full w-12 rounded-l-none"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}