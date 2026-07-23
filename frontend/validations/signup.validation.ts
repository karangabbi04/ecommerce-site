import { z } from "zod";

const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters.")
  .max(100, "Password is too long.");

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name is too long."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address."),

    password: passwordSchema,


  })
  

export const sendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits."),
});


export type SignupFormValues = z.infer<typeof signupSchema>;
export type SendOtpFormValues = z.infer<typeof sendOtpSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;