"use client";

import { useMutation } from "@tanstack/react-query";
import { AdminsignupService } from "@/services/admin-signup.service";

type AdminLoginPayload = {
  email: string;
  password: string;
};

type AdminLoginVerifyPayload = {
  email: string;
  otp: string;
};

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: (payload: AdminLoginPayload) =>
      AdminsignupService.login(payload.email, payload.password),
  });
};

export const useAdminLoginVerify = () => {
  return useMutation({
    mutationFn: (payload: AdminLoginVerifyPayload) =>
      AdminsignupService.loginverify(payload.email, payload.otp),
  });
};