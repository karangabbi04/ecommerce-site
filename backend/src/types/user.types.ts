import { z } from "zod";

import {
  registerUserSchema,
  loginUserSchema,
  registerDuringCheckoutSchema,
  userOtpValidSchema,
} from "../validations/user.validation";

export type RegisterUserDto =
  z.infer<typeof registerUserSchema>;

export type LoginUserDto =
  z.infer<typeof loginUserSchema>;

export type RegisterDuringCheckoutDto =
  z.infer<typeof registerDuringCheckoutSchema>;

  export type  userOtpDto = z.infer<typeof userOtpValidSchema>;

  export type SignupCache = {
  name: string;
  email: string;
  password: string;
};