"use client";

import { type ReactNode, useState } from "react";
import {
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";

import { usecurrentlocation } from "@/app/hooks/mutations/use-address";
import { useSuggestions } from "@/app/hooks/queries/address";
import { useDebounce } from "@/app/hooks/useDebounce";

import { AddressAutocomplete } from "./AddressAutocomplete";
import { type CheckoutFormValues } from "./checkout.schema";

interface AddressSuggestion {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
}

interface AddressFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  watch: UseFormWatch<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

interface FormFieldProps {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

function FormField({ label, error, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200";

export default function AddressForm({
  register,
  watch,
  setValue,
  errors,
  onSubmit,
  isSubmitting = false,
}: AddressFormProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const city = watch("city", "");
  const debouncedCity = useDebounce(city, 500);

  const { data: suggestions = [], isLoading: isSearching } =
    useSuggestions(debouncedCity);

  const locationMutation = usecurrentlocation();

  const handleSelectAddress = (address: AddressSuggestion) => {
    setValue("city", address.name, { shouldValidate: true });
    setValue("state", address.state, { shouldValidate: true });
    setValue("pincode", address.pincode, { shouldValidate: true });
    setShowSuggestions(false);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported on this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      setValue("latitude", latitude);
      setValue("longitude", longitude);

      try {
        const location = await locationMutation.mutateAsync({
          latitude,
          longitude,
        });

        setValue("city", location.city, { shouldValidate: true });
        setValue("state", location.state, { shouldValidate: true });
        setValue("pincode", location.pincode, { shouldValidate: true });
        setValue("addressLine1", location.displayName, {
          shouldValidate: true,
        });
      } catch (error) {
        console.error("Failed to resolve current location:", error);
      }
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border bg-white p-6 shadow-sm sticky top-6 "
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Delivery Address</h2>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locationMutation.isPending}
          className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locationMutation.isPending ? "Detecting..." : "Use current location"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <FormField label="Full Name" error={errors.fullName?.message}>
          <input
            {...register("fullName")}
            placeholder="John Doe"
            className={inputClassName}
          />
        </FormField>

        <FormField label="Phone Number" error={errors.phone?.message}>
          <input
            {...register("phone")}
            placeholder="9876543210"
            inputMode="numeric"
            className={inputClassName}
          />
        </FormField>

        <FormField label="City" error={errors.city?.message} className="relative">
          <input
            {...register("city")}
            placeholder="Mumbai"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className={inputClassName}
          />

          <AddressAutocomplete
            suggestions={suggestions}
            visible={showSuggestions}
            onSelect={handleSelectAddress}
          />

          {isSearching && (
            <p className="mt-1 text-sm text-zinc-500">Searching cities...</p>
          )}
        </FormField>

        <FormField label="State" error={errors.state?.message}>
          <input
            {...register("state")}
            placeholder="Maharashtra"
            className={inputClassName}
          />
        </FormField>

        <FormField label="Pincode" error={errors.pincode?.message}>
          <input
            {...register("pincode")}
            placeholder="400001"
            inputMode="numeric"
            className={inputClassName}
          />
        </FormField>

        <FormField label="Landmark (optional)" error={errors.landmark?.message}>
          <input
            {...register("landmark")}
            placeholder="Near metro station"
            className={inputClassName}
          />
        </FormField>
      </div>

      <FormField
        label="Complete Address"
        error={errors.addressLine1?.message}
        className="mt-4"
      >
        <textarea
          {...register("addressLine1")}
          rows={4}
          placeholder="House no., street, area"
          className={inputClassName}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-xl bg-black py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save Delivery Address"}
      </button>
    </form>
  );
}
