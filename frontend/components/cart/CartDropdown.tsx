"use client";

import { useMemo, useState } from "react";
import { useCart, useUpdateCartQuantity, useCheckout } from "@/app/hooks/queries/cart";
import {useRemoveCartItem, } from "@/app/hooks/mutations/usecart";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};




function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function EmptyCartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto h-10 w-10 text-zinc-400"
      aria-hidden="true"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L22 7H6" />
    </svg>
  );
}

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);

    const { data: cartData } = useCart();

    const updateCartQuantity = useUpdateCartQuantity();
    const removeCartItem = useRemoveCartItem();
    const checkout = useCheckout();

 const totalItems = cartData?.totalItems || 0;
 const cartItems = cartData?.items || [];







  const handleIncreaseQuantity = (itemId: string, currentQuantity: number) => {
    updateCartQuantity.mutate({ itemId, quantity: currentQuantity + 1 });
  };

  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateCartQuantity.mutate({ itemId, quantity: currentQuantity - 1 });
    }
  };

  const handleCheckout = (userId: string, guestId: string) => {
    checkout.mutate({ userId, guestId });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-950 shadow-sm backdrop-blur-xl transition hover:scale-105 hover:bg-white"
        aria-label="Open cart"
      >
        <CartIcon />

        {totalItems > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-950 px-1.5 text-[11px] font-semibold text-white">
            {totalItems}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-14 z-10 w-[22rem] overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/95 shadow-2xl shadow-zinc-900/15 backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-zinc-200/70 px-5 py-4">
            <div>
              <h3 className="font-semibold text-zinc-950">Your Cart</h3>
              <p className="text-xs text-zinc-500">
                {totalItems} {totalItems === 1 ? "item" : "items"} added
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-950"
              aria-label="Close cart"
            >
              <CloseIcon />
            </button>
          </div>

          {cartItems.length > 0 ? (
            <>
              <div className="max-h-[30rem] space-y-3 overflow-y-auto p-4">
                {cartItems.map((item:any) => {
                  const isThisItemUpdating =
                    updateCartQuantity.isPending &&
                    updateCartQuantity.variables?.itemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="group flex gap-3 rounded-2xl border border-zinc-200/70 bg-white/90 p-3 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 via-white to-cyan-100">
                        <div className="h-10 w-6 rounded-b-xl rounded-t-md bg-white/70 shadow-md" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="truncate text-sm font-semibold text-zinc-950">
                              {item.product.name}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              ₹{item.product.price} each
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeCartItem.mutate(item.id)}
                            className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-red-500"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <CloseIcon />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-zinc-200 bg-white">
                            <button
                              type="button"
                              disabled={isThisItemUpdating || item.quantity <= 1}
                              onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                              className="px-3 py-1 text-sm font-semibold text-zinc-500 hover:text-zinc-950"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={isThisItemUpdating || item.quantity >= item.product.stock}
                              onClick={() => handleIncreaseQuantity(item.id, item.quantity )}
                              className="px-3 py-1 text-sm font-semibold text-zinc-950"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-sm font-semibold text-zinc-950">
                            ₹{item.product.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-zinc-200/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Subtotal</span>
                  <span className="text-lg font-semibold text-zinc-950">₹{cartData.subtotal}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCheckout(cartData?.userId || "", cartData?.guestId || "")}
                  className="w-full rounded-full bg-zinc-950 py-3 text-sm font-semibold text-white shadow-xl shadow-zinc-950/15 transition hover:scale-[1.01] hover:bg-zinc-800"
                >
                  Checkout
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <EmptyCartIcon />
              <h4 className="mt-4 font-semibold text-zinc-950">Your cart is empty</h4>
              <p className="mt-2 text-sm text-zinc-500">
                Add handmade products to see them here.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
