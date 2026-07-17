"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Product } from "@/types/product";
import { formatPrice} from "@/lib/format-price";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

function ProductCard({
  product,
}: ProductCardProps) {
  const image =
    product.images?.[0]?.url ??
    "/images/product-placeholder.png";

  return (
    <Card
      className="
      p-0
      group
      overflow-hidden
      rounded-3xl
      border
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
    "
    >
      <Link
        href={`/products/${product.id}`}
        aria-label={product.name}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={product.name}
            fill
            priority={false}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="
            (max-width:640px) 100vw,
            (max-width:1024px) 50vw,
            25vw
          "
          />
        </div>
      </Link>

      <CardContent className="space-y-4 p-6">
        <Badge
          variant="default"
          className="rounded-full p-2 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
        >
          {product.category}
        </Badge>

        <div>
          <Link
            href={`/products/${product.id}`}
          >
            <h3
              className="
              line-clamp-2
              text-xl
              font-semibold
              transition-colors
              hover:text-primary
            "
            >
              {product.name}
            </h3>
          </Link>

          <p
            className="
            mt-2
            line-clamp-2
            text-sm
            text-muted-foreground
          "
          >
            {product.description}
          </p>
        </div>

        <div
          className="
          flex
          items-center
          justify-between
        "
        >
          <div>
            <h4 className="text-xl font-bold">
              {formatPrice(product.price)}
            </h4>

            {product.oldPrice && (
              <p
                className="
                text-sm
                text-muted-foreground
                line-through
              "
              >
                {formatPrice(
                  product.oldPrice
                )}
              </p>
            )}
          </div>

          <Button
            asChild
            size="icon"
          >
            <Link
              href={`/products/${product.id}`}
            >
              <ArrowRight
                className="h-5 w-5"
              />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(ProductCard);