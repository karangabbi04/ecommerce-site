"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { checkoutAddressSchema,CheckoutFormValues,} from "../checkout.schema";
import CurrentLocationButton from "./CurrentLocationButton";
import CityAutocompleteField from "./CityAutocompleteField";
import { OtpPayload } from "@/services/otp.service";
interface AddressFormProps {
  onSubmit: (data: CheckoutFormValues) => Promise<boolean> | boolean;
  draftKey: string;
  isSubmitting?: boolean;
  onSendOtp:(email:string) => void;
  otpSent: boolean
  sendingOtp:boolean
}

export default function AddressForm({
  onSubmit,
  draftKey,
  isSubmitting = false,
  onSendOtp,
  otpSent,
  sendingOtp

}: AddressFormProps) {

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutAddressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      addressLine1: "",
      latitude: undefined,
      longitude: undefined,
      email:"",
      otp: "",
    },
  });

  useEffect(() => {
    try {
      const savedDraft = sessionStorage.getItem(draftKey);
      if (savedDraft) {
        const values = JSON.parse(savedDraft) as Partial<CheckoutFormValues>;
        form.reset({
          ...form.getValues(),
          ...values,
          otp: "",
        });
      }
    } catch {
      sessionStorage.removeItem(draftKey);
    }

    const subscription = form.watch((values) => {
      try {
        sessionStorage.setItem(
          draftKey,
          JSON.stringify({
            fullName: values.fullName ?? "",
            phone: values.phone ?? "",
            addressLine1: values.addressLine1 ?? "",
            landmark: values.landmark ?? "",
            city: values.city ?? "",
            state: values.state ?? "",
            pincode: values.pincode ?? "",
            latitude: values.latitude,
            longitude: values.longitude,
            email: values.email ?? "",
          })
        );
      } catch {
        // Ignore storage failures so form entry remains usable.
      }
    });

    return () => subscription.unsubscribe();
  }, [draftKey, form]);

  const handleFormSubmit = async (data: CheckoutFormValues) => {
    try {
      const completed = await onSubmit(data);
      if (completed) {
        sessionStorage.removeItem(draftKey);
      }
    } catch (error) {
      const responseMessage = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      const message =
        responseMessage ??
        (error instanceof Error ? error.message : "Unable to verify OTP.");

      form.setError("otp", {
        type: "server",
        message,
      });
      form.setFocus("otp");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        noValidate
        className="rounded-xl border bg-white p-4 shadow-sm sm:sticky sm:top-6 sm:rounded-2xl sm:p-6 [&_label]:text-xs sm:[&_label]:text-sm [&_.space-y-2]:space-y-1 sm:[&_.space-y-2]:space-y-2"
      >
        <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
          <div>
            <h2 className="text-lg font-semibold sm:text-xl">
              Delivery Address
            </h2>

            <p className="text-xs text-muted-foreground sm:text-sm">
              Enter your shipping details.
            </p>
          </div>

          <CurrentLocationButton
            setValue={form.setValue}
          />
        </div>

        <div className="grid gap-3 sm:gap-5 md:grid-cols-2">

          {/* Full Name */}

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Full Name
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="John Doe"
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="9876543210"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}

          <CityAutocompleteField
            control={form.control}
            watch={form.watch}
            setValue={form.setValue}
          />

                    {/* State */}

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Punjab"
                    autoComplete="address-level1"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pincode */}

          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>

                <FormControl>
                  <Input
                    placeholder="148023"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Landmark */}

          <FormField
            control={form.control}
            name="landmark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Landmark</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Near Bus Stand"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

           <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email Address</FormLabel>

        <div className="flex gap-1.5 sm:gap-2">
          <FormControl>
            <Input
              type="email"
              placeholder="john@example.com"
              {...field}
            />
          </FormControl>

         <Button
  type="button"
  disabled={!field.value || sendingOtp}
  onClick={() =>
    onSendOtp(field.value,
    )
  }
>
  {sendingOtp
    ? "Sending..."
    : otpSent
    ? "Resend OTP"
    : "Send OTP"}
</Button>
        </div>

        <FormMessage />
      </FormItem>
    )}
  />

  {otpSent && (
    <FormField
        control={form.control}
        name="otp"
        render={({ field }) => (
            <FormItem>
                <FormLabel>OTP</FormLabel>

                <FormControl>
                    <Input
                        maxLength={6}
                        {...field}
                        onChange={(event) => {
                          field.onChange(event);
                          if (form.formState.errors.otp?.type === "server") {
                            form.clearErrors("otp");
                          }
                        }}
                    />
                </FormControl>

                <FormMessage />
            </FormItem>
        )}
    />
)}
        </div>

        {/* Complete Address */}

        <div className="mt-3 sm:mt-5">
          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complete Address</FormLabel>

                <FormControl>
                  <Textarea
                    rows={4}
                    className="h-20 text-sm sm:h-auto sm:text-base"
                    placeholder="House No, Street, Area..."
                    autoComplete="street-address"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="mt-4 h-10 w-full text-sm sm:mt-6 sm:h-11 sm:text-base"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : "Save & Continue"}
        </Button>
      </form>
    </Form>
  );
}