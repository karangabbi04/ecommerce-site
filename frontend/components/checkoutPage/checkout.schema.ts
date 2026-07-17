import { z } from "zod";

export const checkoutAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),

  addressLine1: z.string().min(5, "Complete address is required"),

  city: z.string().min(2, "City is required"),

  state: z.string().min(2, "State is required"),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),

  landmark: z.string().optional(),

  latitude: z.number().optional(),

  longitude: z.number().optional(),

  email: z.email(),

  otp: z.string(),
});

export type CheckoutFormValues = z.infer<typeof checkoutAddressSchema>;
