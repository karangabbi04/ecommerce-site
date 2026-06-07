"use client";

import Image from "next/image";
import { use } from "react";

const cartItems = [
  {
    id: 1,
    name: "Porsche GT3 RS Poster",
    variant: "Matte Black Frame • Large",
    price: 2499,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  },
  {
    id: 2,
    name: "Toyota Supra Poster",
    variant: "Premium Print",
    price: 1899,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
  },
  {
    id: 3,
    name: "Toyota Supra Poster",
    variant: "Premium Print",
    price: 1899,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
  },
];

export default function CheckoutPage() {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const discount = 500;
  const gst = Math.round((subtotal - discount) * 0.18);
  const shipping = 0;

  const total =
    subtotal - discount + gst + shipping;

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <h1 className="text-2xl font-bold">
            Checkout
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Review your order before payment
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Products */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white
                  shadow-sm
                "
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row">
                  
                  <div className="relative h-32 w-full overflow-hidden rounded-xl sm:w-40">
                   
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {item.variant}
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                        <span>✓</span>
                        <span>In Stock</span>
                      </div>

                      <div className="mt-1 text-sm text-zinc-500">
                        Delivery by Tomorrow
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-zinc-500">
                        Quantity: {item.qty}
                      </p>

                      <p className="text-xl font-bold">
                        ₹
                        {(
                          item.price * item.qty
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div
              className="
                sticky
                top-6
                rounded-2xl
                border
                bg-white
                p-6
                shadow-sm
              "
            >
              <h2 className="text-xl font-semibold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-600">
                    Items
                  </span>

                  <span>
                    {cartItems.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-600">
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Discount</span>

                  <span>
                    -₹
                    {discount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-600">
                    GST (18%)
                  </span>

                  <span>
                    ₹{gst.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-600">
                    Shipping
                  </span>

                  <span className="font-medium text-green-600">
                    FREE
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>

                    <span>
                      ₹
                      {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-6">
                <input
                  placeholder="Enter coupon code"
                  className="
                    w-full
                    rounded-xl
                    border
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-black
                  "
                />
              </div>

              {/* Button */}
              <button
                className="
                  mt-5
                  w-full
                  rounded-xl
                  bg-black
                  py-4
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                Proceed To Payment
              </button>

              {/* Trust Badges */}
              <div className="mt-6 border-t pt-4">
                <div className="space-y-2 text-sm text-zinc-500">
                  <p>✓ Secure Checkout</p>
                  <p>✓ 7 Day Return Policy</p>
                  <p>✓ 100% Safe Payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}