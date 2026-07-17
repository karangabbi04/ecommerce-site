"use client";

import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAddToCart } from "@/hooks/mutations/usecart";

type ProductActionsProps = {
  productId: string;
  quantity: number;
  disabled?: boolean;
  className?: string;
};

export default function ProductActions({
  productId,
  quantity,
  disabled = false,
  className,
}: ProductActionsProps) {
  const router = useRouter();

  const { mutate: addToCart, isPending } = useAddToCart();

  const handleAddToCart = () => {
    if (disabled || isPending) return;

    addToCart({
      productId,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (disabled || isPending) return;

    addToCart(
      {
        productId,
        quantity,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row",
        className
      )}
    >
      {/* Add To Cart */}
      <Button
        type="button"
        size="lg"
        variant="default"
        disabled={disabled || isPending}
        onClick={handleAddToCart}
        className="flex-1"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>

      {/* Buy Now */}
      <Button
        type="button"
        size="lg"
        variant="secondary"
        disabled={disabled || isPending}
        onClick={handleBuyNow}
        className="flex-1"
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Buy Now
      </Button>
    </div>
  );
}