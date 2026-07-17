"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

      <div className="rounded-full bg-zinc-100 p-5">
        <ShoppingBag className="h-10 w-10 text-zinc-500" />
      </div>

      <h3 className="mt-6 text-lg font-semibold">
        Your cart is empty
      </h3>

      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Looks like you haven't added any handcrafted products yet.
      </p>

      <Button
        asChild
        className="mt-6 rounded-full"
      >
        <Link href="/products">
          Continue Shopping
        </Link>
      </Button>

    </div>
  );
}