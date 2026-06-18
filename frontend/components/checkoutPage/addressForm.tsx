"use client";

import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { useState } from "react";
import { useSuggestions } from "@/app/hooks/queries/address";
import { useDebounce } from "@/app/hooks/useDebounce";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { usecurrentlocation } from "@/app/hooks/mutations/use-address";


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


  const locationMutation = usecurrentlocation();



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

 const [userlocation, setLocation] = useState({
  latitude: 0,
  longitude: 0,
});


  const getCurrentLocation = async () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const data = await locationMutation.mutateAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        console.log(data);

        setValue("city", data.city);
        setValue("state", data.state);
        setValue("pincode", data.pincode);
        setValue("addressLine1", data.displayName);


      } catch (error) {
        console.error(error);
      }
    }
  );
};



  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className=" w-full bg-red-400 flex justify-between ">
        <h2 className="mb-5 text-xl font-semibold">
        Delivery Address
      </h2>
      <button type="button"
              onClick={getCurrentLocation}
                className=" px-3 py-2 bg-green-300 rounded-xl text-l text-white "> use current location</button>
      </div>

      <div className="grid gap-4 pt-5 md:grid-cols-2">

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