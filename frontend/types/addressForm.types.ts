import { ReactNode } from "react";
import {
    Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { CheckoutFormValues } from "@/components/checkoutPage/checkout.schema";

export interface AddressSuggestion {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AddressFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  watch: UseFormWatch<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export interface FormFieldProps {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export interface CurrentLocationButtonProps {
  setValue: UseFormSetValue<CheckoutFormValues>;
}

export interface SubmitButtonProps {
  isSubmitting?: boolean;
}

export interface AddressTextareaProps {
  register: UseFormRegister<CheckoutFormValues>;
  error?: string;
}

export interface CityFieldProps {
  register: UseFormRegister<CheckoutFormValues>;
 control: Control<CheckoutFormValues>;
watch: UseFormWatch<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
  error?: string;
}