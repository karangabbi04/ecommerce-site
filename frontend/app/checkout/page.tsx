"use client";

import {   useSearchParams } from "next/navigation";
import Image from "next/image";
import { use, useEffect } from "react";
import { useCheckout } from "../hooks/queries/cart";
import { usecreateAccount } from "../hooks/mutations/use-signup";
import { Key } from "lucide-react";

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

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const checkout =useCheckout();
 
    const handleCheckout = (id:string) => {
      checkout.mutate();
      
    }


    useEffect(() => {
      if (id) {
        handleCheckout(id);
      }
    }, [id]);

    // console.log(checkout.data.items)


    const summery = checkout?.data;

    console.log(summery)




   return (
  <main className="min-h-screen bg-zinc-100">
    {/* Header */}
    <div className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <p className="mt-1 text-sm text-zinc-500">
          Review your order and enter delivery details
        </p>
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Left Side */}
        <div className="space-y-6 lg:col-span-2">

          {/* Address Form */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">
              Delivery Address
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />

              <input
                type="text"
                placeholder="City"
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />

              <input
                type="text"
                placeholder="State"
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />

              <input
                type="text"
                placeholder="Pincode"
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />

              <input
                type="text"
                placeholder="Landmark (Optional)"
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <textarea
              rows={4}
              placeholder="Complete Address"
              className="mt-4 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Products */}
          <div className="space-y-3">
            {checkout?.data?.items?.map((item: any) => (
              <div
                key={item.id}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">

                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {item.productName}
                      </h3>

                      <p className="text-sm text-zinc-500">
                        Qty: {item.quantity}
                      </p>

                      <p className="text-sm text-green-600">
                        In Stock
                      </p>
                    </div>

                    <p className="font-bold">
                      ₹
                      {(
                        item.unitPrice * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="sticky top-6 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-zinc-600">
                  Items
                </span>

                <span>
                  {checkout?.data?.items?.length || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-600">
                  Subtotal
                </span>

                <span>
                  ₹
                  {checkout?.data?.subtotal?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-600">
                  GST
                </span>

                <span>
                  ₹
                  {checkout?.data?.tax?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-600">
                  Shipping
                </span>

                <span className="font-medium text-green-600">
                  {checkout?.data?.shipping || "Free"}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>

                  <span>
                    ₹
                    {checkout?.data?.total?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-6 flex gap-2">
              <input
                placeholder="Coupon Code"
                className="flex-1 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />

              <button className="rounded-xl border px-4 font-medium hover:bg-zinc-100">
                Apply
              </button>
            </div>

            {/* Payment Button */}
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

            <div className="mt-6 border-t pt-4 text-sm text-zinc-500">
              <p>✓ Secure Checkout</p>
              <p>✓ Fast Delivery</p>
              <p>✓ 100% Safe Payments</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>
)
}