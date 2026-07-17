"use client";

import { ShoppingBag } from "lucide-react";

interface CartHeaderProps {
  totalItems: number;
}

export default function CartHeader({
  totalItems,
}: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-zinc-100 p-2">
          <ShoppingBag className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-semibold">
            Shopping Cart
          </h3>

          <p className="text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
    </div>
  );
}