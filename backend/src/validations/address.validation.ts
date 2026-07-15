import { z } from "zod";

export const createAddressSchema = z.object({
  fullName: z
    .string()
    .min(2)
    .max(100),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/),

  addressLine1: z
    .string()
    .min(5),

  landmark: z
    .string()
    .optional(),

  city: z
    .string()
    .min(2),

  state: z
    .string()
    .min(2),


  pincode: z
    .string()
    .regex(/^[0-9]{6}$/),

  latitude: z
    .number()
    .optional(),

  longitude: z
    .number()
    .optional(),
  email: z
    .email("please enter a valid email address"),
    otp: z
    .string()
    .max(6)



});

export type CreateAddressInput =
  z.infer<typeof createAddressSchema>;


  