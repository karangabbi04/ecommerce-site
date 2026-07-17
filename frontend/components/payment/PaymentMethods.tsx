"use client";

import { CheckCircle2 } from "lucide-react";
import { PAYMENT_METHODS } from "@/constants/payment.constants";
import { PaymentMethodsProps } from "@/types/payment.type";

export default function PaymentMethods({
  selectedMethod,
  onChange,
}: PaymentMethodsProps) {
  return (
    <div className="rounded-3xl border mt-3 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-semibold">
        Payment Method
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Select your preferred payment option.
      </p>

      <div className="mt-6 space-y-4">

        {PAYMENT_METHODS.map((method) => {

          const active =
            selectedMethod === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() =>
                onChange(method.id)
              }
              className={`w-full rounded-2xl border p-3 text-left transition-all duration-200
                ${
                  active
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/40"
                }`}
            >
              <div className="flex items-start gap-4">

                <div
                  className={`rounded-xl p-2
                    ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                >
                  {method.icon}
                </div>

                <div className="flex-1">

                  <div className="flex items-center justify-between gap-3">

                    <h3 className="font-semibold">
                      {method.title}
                    </h3>

                    <CheckCircle2
                      className={`h-5 w-5 transition
                        ${
                          active
                            ? "text-green-600"
                            : "text-gray-300"
                        }`}
                    />

                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {method.description}
                  </p>

                </div>

              </div>
            </button>
          );
        })}

      </div>

      {selectedMethod === "online" && (
        <div className="mt-6 rounded-2xl border bg-slate-50 p-4">

          <p className="font-medium">
            Supported Payment Options
          </p>

          <p className="mt-2 text-sm text-muted-foreground leading-6">
            Razorpay will securely present all available
            payment methods including UPI, Credit Cards,
            Debit Cards, Net Banking, Wallets and EMI
            options during checkout.
          </p>

        </div>
      )}

    </div>
  );
}