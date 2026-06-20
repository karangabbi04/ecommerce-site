"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";                   
import { useCheckout } from "../hooks/queries/cart";
import { useCreateAddress } from "../hooks/mutations/use-address";
import AddressForm from "@/components/checkoutPage/addressForm";
import ProductList from "@/components/checkoutPage/productList";
import OrderSummary from "@/components/checkoutPage/orderSummary";
import {
  checkoutAddressSchema,
  type CheckoutFormValues,
} from "@/components/checkoutPage/checkout.schema";

export default function CheckoutPage() {

  const router = useRouter()
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const checkout = useCheckout();
  const createAddressMutation = useCreateAddress();

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutAddressSchema),
  });

  useEffect(() => {
    if (!id) return;
    checkout.mutate();
  }, [id]);


  const handleAddressSubmit =handleSubmit( async (data) => {
    const payload = {
      fullName: data.fullName,
      phone: data.phone,
      addressLine1: data.addressLine1,
      landmark: data.landmark,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    console.log("Sending to API:", payload);

     const res =  await createAddressMutation.mutateAsync(payload);
     console.log( res)

       if (res.success) {
        console.log("yesssssssssssssssss")
        router.push(
              `/payment`
            );
    }

   
  });

  const checkoutData = checkout.data;

  return (
    <main className="min-h-screen bg-zinc-100">
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
          <div className="space-y-6 lg:col-span-2">
            <AddressForm
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              onSubmit={handleAddressSubmit}
              isSubmitting={createAddressMutation.isPending}
            />

            
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              itemsCount={checkoutData?.items?.length ?? 0}
              subtotal={checkoutData?.subtotal ?? 0}
              tax={checkoutData?.tax ?? 0}
              shipping={checkoutData?.shipping ?? "Free"}
              total={checkoutData?.total ?? 0}
            />
            <ProductList items={checkoutData?.items ?? []} />
          </div>
        </div>
      </div>
    </main>
  );
}
