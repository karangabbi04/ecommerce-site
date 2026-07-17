"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {

AlertDialog,

AlertDialogAction,

AlertDialogCancel,

AlertDialogContent,

AlertDialogDescription,

AlertDialogFooter,

AlertDialogHeader,

AlertDialogTitle,

AlertDialogTrigger,

} from "@/components/ui/alert-dialog";

import QuantitySelector from "./QuantitySelector";

interface CartItemCardProps {
  item: any;

  loading: boolean;

  onIncrease: () => void;

  onDecrease: () => void;

  onRemove: () => void;
}

export default function CartItemCard({
  item,
  loading,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="flex gap-4 rounded-2xl border bg-card p-4 transition-all hover:shadow-md">

      {/* Product Image */}

      <div className="relative h-20 w-20 overflow-hidden rounded-xl border bg-muted">

        <Image
          src={
            item.product.images?.[0]?.url ??
            "/placeholder.png"
          }
          alt={item.product.name}
          fill
          className="object-cover"
        />

      </div>

      {/* Details */}

      <div className="flex flex-1 flex-col justify-between">

        <div>

          <div className="flex items-start justify-between gap-3">

            <div>

              <h4 className="line-clamp-1 font-medium">
                {item.product.name}
              </h4>

              <p className="mt-1 text-sm text-muted-foreground">
                ₹{item.product.price}
              </p>

            </div>

            <AlertDialog>

  <AlertDialogTrigger asChild>

    <Button
      variant="ghost"
      size="icon"
    >
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>

                </AlertDialogTrigger>

                <AlertDialogContent>

                    <AlertDialogHeader>

                    <AlertDialogTitle>

                        Remove Item?

                    </AlertDialogTitle>

                    <AlertDialogDescription>

                        This product will be removed from your shopping cart.

                    </AlertDialogDescription>

                    </AlertDialogHeader>

                    <AlertDialogFooter>

                    <AlertDialogCancel>

                        Cancel

                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={onRemove}
                    >

                        Remove

                    </AlertDialogAction>

                    </AlertDialogFooter>

                </AlertDialogContent>

                </AlertDialog>

          </div>

          <Badge
            variant="secondary"
            className="mt-2"
          >
            {item.product.stock > 0
              ? "In Stock"
              : "Out of Stock"}
          </Badge>

        </div>

        <div className="mt-4 flex items-center justify-between">

          <QuantitySelector
            quantity={item.quantity}
            maxStock={item.product.stock}
            loading={loading}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />

          <p className="font-semibold">
            ₹{item.quantity * item.product.price}
          </p>

        </div>

      </div>

    </div>
  );
}