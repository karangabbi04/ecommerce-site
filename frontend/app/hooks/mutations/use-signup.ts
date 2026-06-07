import { useMutation } from "@tanstack/react-query";
import { signupService ,OtpPayload,createAccoutPayload} from "@/services/signup.service";


export const usecreateAccount = () => {
  return useMutation({
    mutationFn: (payload: createAccoutPayload) => signupService.createAccount(payload),
  });
}

export const useSendOTP = () => {
  return useMutation({
    mutationFn: (payload: OtpPayload) => signupService.sendOTP(payload),
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: (payload: OtpPayload) => signupService.verifyOTP(payload),
  });
};