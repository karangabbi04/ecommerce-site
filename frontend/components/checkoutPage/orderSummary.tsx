"use client";

import { useState } from "react";

interface OrderSummaryProps {
  itemsCount: number;
  subtotal: number;
  discount?: number;
  tax: number;
  shipping: string;
  total: number;
  apply: (code: string) => Promise<{ message?: string }>;
  remove: () => Promise<{ message?: string }>;
  isCouponApplied: boolean;
  isCouponActionPending?: boolean;
}

export default function OrderSummary({
  itemsCount,
  subtotal,
  discount,
  tax,
  shipping,
  total,
  apply,
  remove,
  isCouponApplied,
  isCouponActionPending = false,
}: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const handleCouponAction = async () => {
    if (isCouponActionPending) return;

    if (isCouponApplied) {
      const response = await remove();
      setCouponMessage(response.message ?? "Coupon removed successfully");
      setCouponCode("");
      return;
    }

    if (!couponCode.trim()) return;

    const response = await apply(couponCode);
    setCouponMessage(response.message ?? "Coupon applied successfully");
    console.log(couponMessage)
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
      <h2 className="text-lg font-semibold sm:text-xl">
        Order Summary
      </h2>

      <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-zinc-600">
            Items
          </span>

          <span>{itemsCount}</span>
        </div>

        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-zinc-600">
            Subtotal
          </span>

          <span>
            ₹{subtotal.toLocaleString()}
          </span>
        </div>

        {discount !== undefined && (
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-zinc-600">Discount</span>
            <span className="font-medium text-green-600">
              -₹{discount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-zinc-600">
            GST
          </span>

          <span>
            ₹{tax.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-zinc-600">
            Shipping
          </span>

          <span className="font-medium text-green-600">
            {shipping}
          </span>
        </div>

        <div className="border-t pt-3 sm:pt-4">
          <div className="flex justify-between text-lg font-bold sm:text-xl">
            <span>Total</span>

            <span>
              ₹{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 sm:mt-6">
        <input
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black sm:rounded-xl sm:px-4 sm:py-3 sm:text-base"
        />

        <button
          type="button"
          onClick={handleCouponAction}
          disabled={isCouponActionPending}
          className="shrink-0 rounded-lg border px-3 text-sm font-medium hover:bg-zinc-100 sm:rounded-xl sm:px-4 sm:text-base"
        >
          {isCouponActionPending ? "Please wait..." : isCouponApplied ? "Remove" : "Apply"}
        </button>
      </div>

      {couponMessage && (
        <p className="mt-2 text-xs font-medium text-green-600 sm:text-sm">
          {couponMessage}
        </p>
      )}

      <div className="mt-4 space-y-1 border-t pt-3 text-xs text-zinc-500 sm:mt-6 sm:pt-4 sm:text-sm">
        <p>✓ Secure Checkout</p>
        <p>✓ Fast Delivery</p>
        <p>✓ 100% Safe Payments</p>
      </div>
    </div>
  );
}