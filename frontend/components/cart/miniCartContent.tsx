"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

import CartHeader from "./CartHeader";
import CartFooter from "./CartFooter";
import EmptyCart from "./EmptyCart";
import CartSkeleton from "./CartSkeleton";
import CartItemCard from "./CartItemCard";
import { useCheckout } from "@/hooks/queries/cart";


import { useCart, useUpdateCartQuantity } from "@/hooks/queries/cart";
import { useRemoveCartItem } from "@/hooks/mutations/usecart";

import type { CartItem } from "@/types/cart";
import { Route } from "next";

export default function MiniCartContent() {
  const {
    data: cartData,
    isLoading,
  } = useCart();

  const router = useRouter()

  const checkout = useCheckout()

  const updateCartQuantity =
    useUpdateCartQuantity();

  const removeCartItem =
    useRemoveCartItem();

  const totalItems =
    cartData?.totalItems ?? 0;

  const cartItems =
    cartData?.items ?? [];

  const checkoutId =
    cartData?.cart?.guestId ??
    cartData?.cart?.userId ??
    "";

  const handleQuantityChange = (
    itemId: string,
    quantity: number
  ) => {
    updateCartQuantity.mutate({
      itemId,
      quantity,
    });
  };

  const handleRemoveItem = (
    id: string
  ) => {
    removeCartItem.mutate(id);
  };

  const handelCheckoutButton = () =>{
      checkout.mutate(
      undefined,
      {
        onSuccess:(data)=>{
          console.log(data,"form mutaion function ")
           router.push(`/checkout/${data.id}` as Route);
        }
      }
     )


  }


  return (
    <div className="flex h-full max-h-[80vh] flex-col">
      <CartHeader totalItems={totalItems} />

      {isLoading ? (
        <CartSkeleton />
      ) : cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-4 p-4">
              {cartItems.map((item: CartItem) => {
                const loading =
                  updateCartQuantity.isPending &&
                  updateCartQuantity.variables?.itemId === item.id;

                return (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    loading={loading}
                    onIncrease={() =>
                      handleQuantityChange(
                        item.id,
                        Math.min(item.quantity + 1, item.product.stock)
                      )
                    }
                    onDecrease={() =>
                      handleQuantityChange(
                        item.id,
                        Math.max(item.quantity - 1, 1)
                      )
                    }
                    onRemove={() => handleRemoveItem(item.id)}
                  />
                );
              })}
            </div>
          </ScrollArea>

          <CartFooter
            subtotal={cartData?.subtotal ?? 0}
            totalItems={totalItems}
            checkoutId={checkoutId}
            oncheckout={handelCheckoutButton}
          />
        </>
      )}
    </div>
  );
}