
import { useMutation } from "@tanstack/react-query";
import { sendOTP,OtpPayload } from "@/services/otp.service";


export const useSendOTP = () => {
  return useMutation({
    mutationFn: (payload: OtpPayload) => sendOTP(payload),
  });
};