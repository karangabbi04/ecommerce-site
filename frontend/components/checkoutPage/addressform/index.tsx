"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  onSubmit: (data: CheckoutFormValues) => void;
  isSubmitting?: boolean;
  onSendOtp:(email:string) => void;
  otpSent: boolean
  sendingOtp:boolean
}

export default function AddressForm({
  onSubmit,
  isSubmitting = false,
  onSendOtp,
  otpSent,
  sendingOtp

}: AddressFormProps) {

  console.log(onSendOtp);
  console.log(typeof onSendOtp);
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="sticky top-6 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Delivery Address
            </h2>

            <p className="text-sm text-muted-foreground">
              Enter your shipping details.
            </p>
          </div>

          <CurrentLocationButton
            setValue={form.setValue}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">

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

        <div className="flex gap-2">
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
                    />
                </FormControl>

                <FormMessage />
            </FormItem>
        )}
    />
)}
        </div>

        {/* Complete Address */}

        <div className="mt-5">
          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complete Address</FormLabel>

                <FormControl>
                  <Textarea
                    rows={4}
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
          className="mt-6 w-full"
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