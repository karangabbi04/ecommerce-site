"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Product } from "@/types/product";
import { formatPrice } from "@/lib/format-price";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0]?.url ?? "/images/product-placeholder.png";

  return (
    <Card className="group overflow-hidden rounded-3xl border p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/products/${product.id}`} aria-label={product.name}>
        <div className="relative h-[350px] w-[100%] overflow-hidden bg-amber-400">
          <Image
            src={image}
            alt={product.name}
            fill
            priority={false}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="100%"
          />
        </div>
      </Link>

      <CardContent className="space-y-1 px-5 pb-5">
        <Badge variant="default" className="rounded-full bg-green-50 p-2 text-green-700 dark:bg-green-950 dark:text-green-300">
          {product.tag} 
        </Badge>

        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="line-clamp-2 text-xl font-semibold transition-colors hover:text-primary">
              {product.name}
            </h3>
          </Link>

          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold">{formatPrice(product.price)}</h4>

            {product.oldPrice && (
              <p className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</p>
            )}
          </div>

          <Button asChild size="icon">
            <Link href={`/products/${product.id}`}>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(ProductCard);