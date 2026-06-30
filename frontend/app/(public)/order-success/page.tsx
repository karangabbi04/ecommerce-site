"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Truck, Download, ArrowRight } from "lucide-react";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") || "ORD-20260625-1234";

  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const products = [
    {
      id: 1,
      name: "Nike Air Max",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
      qty: 1,
      price: 4999,
    },
    {
      id: 2,
      name: "Sports T-Shirt",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
      qty: 2,
      price: 999,
    },
  ];

  const subtotal = 6997;
  const gst = 1259;
  const shipping = 0;
  const total = subtotal + gst + shipping;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-10 px-4">

        <div className="mx-auto max-w-4xl">

          {/* Success Card */}
          <div className="rounded-3xl bg-white shadow-2xl border p-8 md:p-12">

            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-green-300 animate-ping opacity-30" />

                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2
                    size={70}
                    className="text-green-600"
                  />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mt-8">
              <h1 className="text-4xl font-bold text-gray-900">
                Order Placed Successfully 🎉
              </h1>

              <p className="mt-3 text-gray-600">
                Payment completed successfully.
              </p>

              <p className="text-gray-500">
                Thank you for shopping with us.
              </p>
            </div>

            {/* Order ID */}
            <div className="mt-8 rounded-2xl bg-green-50 border border-green-200 p-5">
              <p className="text-sm text-gray-500">
                Order Number
              </p>

              <p className="font-bold text-xl text-green-700">
                #{orderId}
              </p>
            </div>

            {/* Status Cards */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">

              <div className="rounded-2xl border p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-600" />
                  <h3 className="font-semibold">
                    Payment Successful
                  </h3>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Payment has been verified successfully.
                </p>
              </div>

              <div className="rounded-2xl border p-5">
                <div className="flex items-center gap-3">
                  <Package className="text-blue-600" />
                  <h3 className="font-semibold">
                    Order Confirmed
                  </h3>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Your order is now being packed.
                </p>
              </div>

            </div>

            {/* Delivery */}
            <div className="mt-6 rounded-2xl border p-5">
              <div className="flex items-center gap-3">
                <Truck className="text-green-600" />
                <h3 className="font-semibold">
                  Estimated Delivery
                </h3>
              </div>

              <p className="mt-2 text-xl font-bold">
                {deliveryDate.toDateString()}
              </p>
            </div>

            {/* Products */}
            <div className="mt-8">

              <h2 className="font-bold text-xl mb-4">
                Ordered Items
              </h2>

              <div className="space-y-4">

                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 border rounded-2xl p-4"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Qty: {product.qty}
                      </p>
                    </div>

                    <div className="font-bold">
                      ₹{product.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-8 rounded-2xl bg-gray-50 p-5">

              <h3 className="font-bold mb-4">
                Order Summary
              </h3>

              <div className="space-y-2 text-gray-700">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST</span>
                  <span>₹{gst}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    FREE
                  </span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total Paid</span>
                  <span>₹{total}</span>
                </div>

              </div>
            </div>

            {/* Email Alert */}
            <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4 text-center">
              📧 Confirmation email sent successfully.
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col md:flex-row gap-4">

              <button
                // onClick={() => router.push("/orders")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold"
              >
                Track Order
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 flex-1 border rounded-xl py-4 font-semibold"
              >
                <Download size={18} />
                Download Invoice
              </button>

              <button
                onClick={() => router.push("/")}
                className="flex items-center justify-center gap-2 flex-1 border rounded-xl py-4 font-semibold"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </button>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}