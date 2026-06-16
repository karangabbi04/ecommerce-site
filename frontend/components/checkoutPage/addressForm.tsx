"use client";

import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { useState } from "react";
import { useSuggestions } from "@/app/hooks/queries/address";
import { useDebounce } from "@/app/hooks/useDebounce";
import { AddressAutocomplete } from "./AddressAutocomplete";

export interface CheckoutFormValues {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

interface AddressSuggestion {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
}

interface Props {
  register: UseFormRegister<CheckoutFormValues>;
  watch: any;
  setValue: UseFormSetValue<CheckoutFormValues>;
}

export default function AddressForm({
  register,
  watch,
  setValue,
}: Props) {
  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const city = watch("city", "");

  const debouncedCity =
    useDebounce(city, 500);

  const { data, isLoading } =
    useSuggestions(debouncedCity);

  const suggestions =
    data ?? [];
    console.log(suggestions)

  const handleSelectAddress = (
    address: AddressSuggestion
  ) => {
  

    setValue(
      "city",
      address.name
    );

    setValue(
      "state",
      address.state
    );

    setValue(
      "pincode",
      address.pincode
    );

    setShowSuggestions(false);
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Delivery Address
      </h2>

      <div className="grid gap-4 md:grid-cols-2">

        <input
          {...register("fullName")}
          placeholder="Full Name"
          className="rounded-xl border px-4 py-3"
        />

        <input
          {...register("phone")}
          placeholder="Phone Number"
          className="rounded-xl border px-4 py-3"
        />

        <div className="relative">
         <div className="relative">
              <input
                {...register("city")}
                placeholder="City"
                onFocus={() => setShowSuggestions(true)}
                className="w-full rounded-xl border px-4 py-3"
              />

              <AddressAutocomplete
                suggestions={suggestions}
                visible={showSuggestions}
                onSelect={handleSelectAddress}
              />

              {isLoading && (
                <div className="absolute top-full mt-1 rounded-lg border bg-white p-3 shadow">
                  Searching...
                </div>
              )}
            </div>

          {isLoading && (
            <div className="absolute top-full mt-1 rounded-lg border bg-white p-3 shadow">
              Searching...
            </div>
          )}
        </div>

        <input
          {...register("state")}
          placeholder="State"
          className="rounded-xl border px-4 py-3"
        />

        <input
          {...register("pincode")}
          placeholder="Pincode"
          className="rounded-xl border px-4 py-3"
        />

        <input
          {...register("landmark")}
          placeholder="Landmark"
          className="rounded-xl border px-4 py-3"
        />
      </div>

      <textarea
        {...register("addressLine1")}
        rows={4}
        placeholder="Complete Address"
        className="mt-4 w-full rounded-xl border px-4 py-3"
      />
    </div>
  );
}