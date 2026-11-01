"use client";

import ProductPrice from "./ProductPrice";
import ProductTabs from "./ProductTabs";
import QuantitySelector from "./QuantitiySelector";
import ProductActions from "./ProductActions";

import { Badge } from "@/components/ui/badge";
import { calculateDiscount } from "../../utils/productUtils";

import { useQuantity, type UseQuantityReturn,} from "@/hooks/useQuantity";


type Product = {
  id: string;
  name: string;
  category?: { name: string } | string;
  description: string;
  details?: string;
  tag?: string;
  price: number;
  oldPrice?: number | null;
};

type ProductInfoProps = {
  product: Product;
  quantity:UseQuantityReturn;

};


export default function ProductInfo({
  product,
  quantity,
}: ProductInfoProps) {


  const {
    id,
    name,
    category,
    description,
    details,
    price,
    oldPrice,
    tag,
  } = product;

  console.log("ProductInfo component rendered with product:", product);

  const {
    Quantity,
    increment,
    decrement,
    canIncrement,
    canDecrement,
  } = quantity;

  const discount = calculateDiscount(price, oldPrice);

  return (
    <section className="flex h-fit min-w-0 flex-col rounded-2xl border border-border bg-background p-4 shadow-sm sm:rounded-[2rem] sm:p-6 lg:sticky lg:top-8 lg:p-8">
      {/* Top Badges */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <Badge>
          {tag}
        </Badge>

        {category && (
          <Badge>
            {typeof category === "string" ? category : category.name}
          </Badge>
        )}

        {discount > 0 && (
          <Badge
            variant="destructive"
            className="rounded-full"
          >
            {discount}% OFF
          </Badge>
        )}
      </div>

      {/* Product Name and Quantity */}
      <div className="mt-3 flex items-center justify-between gap-3 sm:mt-5">
        <h1 className="min-w-0 flex-1 wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl lg:text-5xl">
          {name}
        </h1>

        <div className="shrink-0">
          <h3 className="mb-1 text-xs font-medium text-muted-foreground sm:mb-2 sm:text-sm">
            Quantity
          </h3>
          <QuantitySelector
            value={Quantity}
            onIncrease={increment}
            onDecrease={decrement}
            canIncrease={canIncrement}
            canDecrease={canDecrement}
          />
        </div>
      </div>

      {/* Price */}
      <ProductPrice
        className="mt-3 sm:mt-6"
        price={price}
        oldPrice={oldPrice}
      />

      {/* Actions */}
      <ProductActions
        className="mt-4 sm:mt-8"
        productId={id}
        quantity={Quantity}
      />

      {/* Tabs */}
      <ProductTabs
        className="mt-5 sm:mt-10"
        description={description}
        details={details}
      />
    </section>
  );
}