import { UseFormSetValue } from "react-hook-form";
import { CheckoutFormValues } from "@/components/checkoutPage/checkout.schema";
import { AddressSuggestion } from "@/types/addressForm.types";

export function applySelectedAddress(
  address: AddressSuggestion,
  setValue: UseFormSetValue<CheckoutFormValues>
) {
  setValue("city", address.name, {
    shouldValidate: true,
    shouldDirty: true,
  });

  setValue("state", address.state, {
    shouldValidate: true,
    shouldDirty: true,
  });

  setValue("pincode", address.pincode, {
    shouldValidate: true,
    shouldDirty: true,
  });
}

interface CurrentLocationData {
  city: string;
  state: string;
  pincode: string;
  displayName: string;
}

export function applyCurrentLocation(
  location: CurrentLocationData,
  latitude: number,
  longitude: number,
  setValue: UseFormSetValue<CheckoutFormValues>
) {
  setValue("latitude", latitude);

  setValue("longitude", longitude);

  setValue("city", location.city, {
    shouldValidate: true,
    shouldDirty: true,
  });

  setValue("state", location.state, {
    shouldValidate: true,
    shouldDirty: true,
  });

  setValue("pincode", location.pincode, {
    shouldValidate: true,
    shouldDirty: true,
  });

  setValue("addressLine1", location.displayName, {
    shouldValidate: true,
    shouldDirty: true,
  });
}