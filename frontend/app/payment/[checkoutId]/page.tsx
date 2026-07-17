"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import OrderSummary from "@/components/payment/OrderSummary";
import PaymentButton from "@/components/payment/PaymentButton";
import PaymentMethods from "@/components/payment/PaymentMethods";
import ProductList from "@/components/checkoutPage/productList";

import { PaymentMethod } from "@/types/payment.type";

import { useCheckout } from "@/hooks/queries/use-checkout";
import { useCreateOrder } from "@/hooks/mutations/use-CreateOrder";
import { useVerifyPayment } from "@/hooks/mutations/use-VerifyPayment";

import { openRazorpay } from "@/utils/razorpay";
import AddressCard from "@/components/payment/addressCard";
import { Route } from "next";
import Link from "next/link";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();

  const checkoutId = params.checkoutId as string;

  const check = "lksdfjlkal"

  const {
    data: checkout,
    isLoading,
    isError,
  } = useCheckout(checkoutId);

  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>("online");

  const [isProcessing, setIsProcessing] =
    useState(false);

  const { mutateAsync: createOrder } =
    useCreateOrder();

  const { mutateAsync: verifyPayment } =
    useVerifyPayment();

  const handlePayment = async () => {
    if (isProcessing) return;

    if (!checkout) return;

    setIsProcessing(true);

    try {
      /**
       * COD Flow
       */
      if (selectedMethod === "cod") {
        // TODO:
        // Call COD Order API here when backend is ready.

        return;
      }

      /**
       * Create Razorpay Order
       */
      const order = await createOrder(checkoutId);

      /**
       * Open Razorpay
       */
      openRazorpay({
        orderId: order.orderId,

        razorpayOrderId:
          order.data.razorpayOrderId,

        amount: order.data.amount,

        key: order.data.key,

        onSuccess: async (response) => {
          try {
            /**
             * Verify Payment
             */
            await verifyPayment({
              orderId: order.data.orderId,

              razorpayOrderId:
                response.razorpay_order_id,

              razorpayPaymentId:
                response.razorpay_payment_id,

              razorpaySignature:
                response.razorpay_signature,
            });

            /**
             * Redirect
             */
            router.push(
              `/payment/order-success/${checkoutId}`as any
            );
          } catch (error) {
            console.error(error);

            alert(
              "Payment verification failed."
            );
          }
        },
      });
    } catch (error) {
      console.error(error);

      alert("Unable to process payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Loading State
   */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  /**
   * Error State
   */
  if (isError || !checkout) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Failed to load checkout.
      </div>
    );
  }
  return (
  <div className="min-h-screen bg-slate-100 pb-32">

    <button onClick={()=>{
              router.push(`/payment/order-success/${checkoutId}` as Route)
          }}>
            order success 
          </button>
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold tracking-tight">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Review your order and complete your payment securely.
        </p>

      </div>

      {/* Layout */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* LEFT */}

        <main className="space-y-6 lg:col-span-2">

          <AddressCard
            address={checkout.address}
            showChangeButton
            onChange={() =>
              router.push("/checkout" as Route)
            }
          />

          <ProductList
            items={checkout.items}
          />

        </main>

        {/* RIGHT */}

        <aside className="space-y-5 lg:sticky lg:top-6 lg:h-fit">

          <OrderSummary
            subtotal={checkout.subtotal}
            tax={checkout.tax}
            shipping={checkout.shipping}
            discount={checkout.discount}
            total={checkout.total}
          />

          <PaymentMethods
            selectedMethod={selectedMethod}
            onChange={setSelectedMethod}
          />

          <PaymentButton
            amount={checkout.total}
            paymentMethod={selectedMethod}
            loading={isProcessing}
            onClick={handlePayment}
          />

        </aside>

      </div>

    </div>

    {/* Mobile Sticky Button */}

    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-xl lg:hidden">

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

        <div>

          <p className="text-xs text-muted-foreground">
            Total
          </p>

          <p className="text-lg font-bold">
            ₹{checkout.total}
          </p>

        </div>

        <div className="flex-1">

          <PaymentButton
            amount={checkout.total}
            paymentMethod={selectedMethod}
            loading={isProcessing}
            onClick={handlePayment}
          />

          

        </div>

      </div>

    </div>

  </div>
);
}
