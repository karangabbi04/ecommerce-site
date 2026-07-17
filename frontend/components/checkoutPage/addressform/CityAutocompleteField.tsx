"use client";

import { useState } from "react";
import {
  Control,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useWatch } from "react-hook-form";

import { useSuggestions } from "@/hooks/queries/address";
import { useDebounce } from "@/hooks/useDebounce";

import { AddressAutocomplete } from "../AddressAutocomplete";
import { CheckoutFormValues } from "../checkout.schema";

import {
  SEARCH_DEBOUNCE_DELAY,
  SUGGESTION_BLUR_DELAY,
} from "@/constants/addressForm.constants";

import { applySelectedAddress } from "@/utils/addressForm.utils";
import { ImportIcon } from "lucide-react";

interface CityAutocompleteFieldProps {
  control: Control<CheckoutFormValues>;
  watch: UseFormWatch<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
}

export default function CityAutocompleteField({
  control,
  watch,
  setValue,
}: CityAutocompleteFieldProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const city = useWatch({
  control,
  name: "city",
});

  const debouncedCity = useDebounce(
    city ?? "",
    SEARCH_DEBOUNCE_DELAY
  );

  const {
    data: suggestions = [],
    isLoading,
  } = useSuggestions(debouncedCity);

  return (
    <FormField
      control={control}
      name="city"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>City</FormLabel>

          <FormControl>
            <Input
              {...field}
              placeholder="Enter your city"
              autoComplete="address-level2"
              onFocus={() => setShowSuggestions(true)}
              onBlur={(e) => {
                field.onBlur();

                setTimeout(() => {
                  setShowSuggestions(false);
                }, SUGGESTION_BLUR_DELAY);
              }}
            />
          </FormControl>

          <AddressAutocomplete
            visible={showSuggestions}
            suggestions={suggestions}
            onSelect={(address) => {
              applySelectedAddress(address, setValue);

              setShowSuggestions(false);
            }}
          />

          {isLoading && (
            <p className="mt-2 text-xs text-muted-foreground">
              Searching...
            </p>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}