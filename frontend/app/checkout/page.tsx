"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react"
import { useCheckout } from "../hooks/queries/cart";
import {z} from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuggestions } from "../hooks/queries/address";
import { useDebounce } from "../hooks/useDebounce";
import { AddressAutocomplete } from "@/components/checkoutPage/AddressAutocomplete";
import ProductList from "@/components/checkoutPage/productList";
import OrderSummary from "@/components/checkoutPage/orderSummary";
import AddressForm from "@/components/checkoutPage/addressForm";

const schema = z.object({
  fullName: z.string().min(3, "Name is required"),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  addressLine1: z.string().min(5),

  city: z.string().min(2),

  state: z.string().min(2),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Invalid pincode"),

  landmark: z.string().optional(),
});

interface AddressSuggestion {
  id: string;
  label: string;
  city: string;
  state: string;
  pincode: string;
}


type CheckoutForm = z.infer<typeof schema>;


export default function CheckoutPage() {

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const checkout =useCheckout();

const {
  register,
  watch,
  setValue,
  handleSubmit,
  formState: { errors }
} = useForm<CheckoutForm>({
  resolver: zodResolver(schema),
});










   useEffect(() => {
  if (!id) return;

  checkout.mutate();
}, [id]);


  










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
                  <AddressForm
            register={register}
            watch={watch}
            setValue={setValue}
          />
          

          {/* Products */}
          <ProductList
            items={checkout?.data?.items ?? []}
          />
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
            <OrderSummary
              itemsCount={checkout?.data?.items?.length ?? 0}
              subtotal={checkout?.data?.subtotal ?? 0}
              tax={checkout?.data?.tax ?? 0}
              shipping={checkout?.data?.shipping ?? "Free"}
              total={checkout?.data?.total ?? 0}
            />
          </div>

        </div> {/* end grid */}
      </div> {/* end container */}
    </main>
  );
}

