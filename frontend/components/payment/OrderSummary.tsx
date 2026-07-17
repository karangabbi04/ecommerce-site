"use client";

import { OrderSummaryProps } from "@/types/payment.type";

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function OrderSummary({
  subtotal,
  tax,
  shipping,
  discount,
  total,
  className = "",
}: OrderSummaryProps) {
  return (
    <div
      className={`bg-white rounded-3xl border shadow-sm p-6 ${className}`}
    >
      <h2 className="text-xl font-semibold mb-6">
        Order Summary
      </h2>

      <div className="space-y-4">

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Product Total
          </span>

          <span className="font-medium">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            GST
          </span>

          <span className="font-medium">
            {formatPrice(tax)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Shipping
          </span>

          <span className="font-medium">
            {shipping === 0
              ? "FREE"
              : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Discount
          </span>

          <span className="font-medium text-green-600">
            - {formatPrice(discount)}
          </span>
        </div>

        <hr />

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            Total
          </span>

          <span className="text-xl font-bold">
            {formatPrice(total)}
          </span>
        </div>

      </div>

      <div className="mt-6 rounded-2xl border bg-green-50 p-4">
        <div className="flex items-start gap-3">

          <span className="text-xl">
            🔒
          </span>

          <div>

            <p className="font-medium">
              Secure Payment
            </p>

            <p className="text-sm text-muted-foreground">
              Your payment is encrypted and securely
              processed by Razorpay.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}