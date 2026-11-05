// src/hooks/mutations/use-login.ts
import { useMutation } from "@tanstack/react-query";
import { signupService } from "@/services/signup.service";
import type { VerifyOtpRequest } from "@/types/signup.types";

type LoginPayload = {
  email: string;
  password: string;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => signupService.LogIn(payload),
  });
};

export const useVerifyLogin = () => {
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => signupService.LoginVerify(payload),
  });
};