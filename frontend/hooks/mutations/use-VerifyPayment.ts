import { verifyPayment } from "@/services/payment.service";
import { useMutation } from "@tanstack/react-query";


export const useVerifyPayment = () => {

  return useMutation({
    mutationFn: verifyPayment
  });

};