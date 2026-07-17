import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/services/order.service";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder
  });
};