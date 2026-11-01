import { useMutation } from "@tanstack/react-query";
import {
  couponApply,
  couponRemove,
  ApplyCouponVariables,
} from "@/services/coupon.service";

export const useapplyCoupon = () => {
  return useMutation({
    mutationFn: ({ checkoutSessionId, code }:ApplyCouponVariables) =>
      couponApply({checkoutSessionId, code}),
  });
};

export const useRemoveCoupon = () => {
  return useMutation({
    mutationFn: (checkoutSessionId: string) => couponRemove(checkoutSessionId),
  });
};