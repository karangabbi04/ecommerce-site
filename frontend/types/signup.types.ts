// components/auth/types.ts

export type SignupFormData = {
  name: string;
  email: string;
  password: string;
};

export type SignupRequest = SignupFormData;

export type SignupResponse = {
  success: boolean;
  message: string;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
};

export type VerifyOtpResponse = {
  success: boolean;
  message: string;
};

export type ApiError = {
  message: string;
};