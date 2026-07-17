// src/hooks/mutations/use-login.ts
import { useMutation } from "@tanstack/react-query";
import { signupService } from "@/services/signup.service";

type LoginPayload = {
  email: string;
  password: string;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => signupService.LogIn(payload),
  });
};