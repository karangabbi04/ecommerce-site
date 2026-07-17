"use client";

import { Loader2, CreditCard, Banknote } from "lucide-react";
import { PaymentButtonProps } from "@/types/payment.type";

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function PaymentButton({
  loading = false,
  disabled = false,
  amount,
  paymentMethod,
  onClick,
  className = "",
}: PaymentButtonProps) {
  const isCod = paymentMethod === "cod";

  return (
    <button
      type="button"
      disabled={loading || disabled}
      onClick={onClick}
      className={`
        flex w-full items-center justify-center gap-3
        rounded-2xl bg-black px-6 py-4
        text-base font-semibold text-white
        transition-all duration-200
        hover:bg-neutral-800
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {isCod ? (
            <Banknote className="h-5 w-5" />
          ) : (
            <CreditCard className="h-5 w-5" />
          )}

          {isCod
            ? `Place Order • ${formatPrice(amount)}`
            : `Pay Now • ${formatPrice(amount)}`}
        </>
      )}
    </button>
  );
}