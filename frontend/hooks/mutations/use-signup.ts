"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { signupService } from "@/services/signup.service";
import { SignupSchema} from "@/validations/signup.validation";
import { VerifyOtpRequest } from "@/types/signup.types";



// type UseSignupOptions = {
//   onOtpSent?: (email: string) => void;
//   onSignupSuccess?: (user: any) => void;
// };

export const useSignup = () => {
 return useMutation({
     mutationFn: (payload: SignupSchema) => signupService.SignupStart(payload),
   });
}

export const useverifySignup = () => {
 return useMutation({
     mutationFn: (payload: VerifyOtpRequest) => signupService.SignupVerify(payload),
   });
}

// const verifyMutation = useMutation({
//   mutationFn: signupService.SignupVerify,
// });

//   return {
//   sendOtp: signupMutation.mutateAsync,
//   verifyOtp: verifyMutation.mutateAsync,

//   signupError: signupMutation.error,
//   verifyError: verifyMutation.error,

//   isSendingOtp: signupMutation.isPending,
//   isVerifyingOtp: verifyMutation.isPending,
// };
