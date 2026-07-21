import { trim, z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100),
});

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const registerDuringCheckoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number")
    .max(15),
});


 export const userOtpValidSchema = z.object({

   email: z
    .string()
    .trim()
    .email("Invalid email address"),

    otp: z 
    .string()
    .trim()
    .max(6)

})