"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartButtonProps {
  totalItems: number;
}

export default function CartButton({
  totalItems,
}: CartButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="relative h-11 w-11 rounded-full border-zinc-200 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white"
      aria-label="Shopping Cart"
    >
      <ShoppingBag className="h-5 w-5" />

      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-950 px-1 text-[10px] font-semibold text-white">
          {totalItems}
        </span>
      )}
    </Button>
  );
}