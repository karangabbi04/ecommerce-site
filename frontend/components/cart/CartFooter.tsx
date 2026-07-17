"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartFooterProps {
  subtotal: number;
  totalItems: number;
  checkoutId: string;
  oncheckout: ()=> void
}

export default function CartFooter({
  subtotal,
  totalItems,
  checkoutId,
  oncheckout
}: CartFooterProps) {
  const router = useRouter();

  return (
    <div className="border-t bg-background p-5">

      {/* Summary */}

      <div className="space-y-3">

        <div className="flex items-center justify-between text-sm">

          <span className="text-muted-foreground">
            Items
          </span>

          <span className="font-medium">
            {totalItems}
          </span>

        </div>

        <div className="flex items-center justify-between text-sm">

          <span className="text-muted-foreground">
            Delivery
          </span>

          <span className="font-medium text-green-600">
            FREE
          </span>

        </div>

        <Separator />

        <div className="flex items-center justify-between">

          <span className="font-semibold">
            Subtotal
          </span>

          <span className="text-lg font-bold">
            ₹{subtotal}
          </span>

        </div>

      </div>

      {/* Buttons */}

      <div className="mt-5 grid gap-3">

        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="w-full rounded-xl"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />

          View Cart

        </Button>

        <Button
          onClick={()=>{
            oncheckout()
          }}
          className="w-full rounded-xl"
        >
          <CreditCard className="mr-2 h-4 w-4" />

          Proceed to Checkout

        </Button>

      </div>

    </div>
  );
}