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
  category: string;
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

  const {
    Quantity,
    increment,
    decrement,
    canIncrement,
    canDecrement,
  } = quantity;

  const discount = calculateDiscount(price, oldPrice);

  return (
    <section className="flex h-fit flex-col rounded-[2rem] border border-border bg-background p-6 shadow-sm lg:sticky lg:top-8 lg:p-8">
      {/* Top Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {category}
        </Badge>

        {tag && (
          <Badge>
            {tag}
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

      {/* Product Name */}
      <h1 className="mt-5 text-3xl font-bold tracking-tight lg:text-5xl">
        {name}
      </h1>

      {/* Price */}
      <ProductPrice
        className="mt-6"
        price={price}
        oldPrice={oldPrice}
      />

      {/* Quantity */}
      <div className="mt-8">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
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

      {/* Actions */}
      <ProductActions
        className="mt-8"
        productId={id}
        quantity={Quantity}
      />

      {/* Tabs */}
      <ProductTabs
        className="mt-10"
        description={description}
        details={details}
      />
    </section>
  );
}