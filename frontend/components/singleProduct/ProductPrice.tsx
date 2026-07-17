"use client";

import { Badge } from "@/components/ui/badge";
import { calculateDiscount,  isOnSale } from "../../utils/productUtils";
import { formatPrice } from "@/lib/format-price";

type ProductPriceProps = {
  price: number;
  oldPrice?: number | null;
  className?: string;
};

export default function ProductPrice({
  price,
  oldPrice,
  className,
}: ProductPriceProps) {
  const hasDiscount = isOnSale(price, oldPrice);
  const discount = calculateDiscount(price, oldPrice);

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
        {/* Current Price */}
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {formatPrice(price)}
        </h2>

        {/* Old Price */}
        {hasDiscount && oldPrice && (
          <span className="pb-1 text-lg font-medium text-muted-foreground line-through">
            {formatPrice(oldPrice)}
          </span>
        )}

        {/* Discount */}
        {hasDiscount && (
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs font-semibold"
          >
            Save {discount}%
          </Badge>
        )}
      </div>

      {hasDiscount && oldPrice && (
        <p className="mt-2 text-sm text-muted-foreground">
          You save{" "}
          <span className="font-semibold text-green-600">
            {formatPrice(oldPrice - price)}
          </span>
        </p>
      )}
    </div>
  );
}