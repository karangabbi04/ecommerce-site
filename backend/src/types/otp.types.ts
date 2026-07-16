// src/modules/otp/otp.types.ts

import { OtpPurpose } from "../constants/otp.constants";

export interface SendOTPInput {
  email: string;
  purpose: OtpPurpose;
  
}

export interface VerifyOTPInput {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}