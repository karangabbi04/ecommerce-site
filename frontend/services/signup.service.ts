import { api } from "@/lib/api";
import { signupSchema,SignupSchema,} from "@/validations/signup.validation";
import { VerifyOtpRequest } from "@/types/signup.types";



export const signupService = {

    async SignupStart( payload:SignupSchema){
         try {
      console.log("signup called", payload);

      const response = await api.post(`auth/signup`, payload);

      console.log("signup  response", response.data);

      return response.data.data;
    } catch (error: any) {
      console.log("signup  error", error?.response?.data || error);
      throw new Error(error?.response?.data?.message || "Signup failed");
    }

    },

    async SignupVerify( payload:VerifyOtpRequest){
         try {
      console.log("verifysignup called", payload);

      const response = await api.post(`auth/verifyotp`, payload);

      console.log("verifysignup  response", response.data);

      return response.data.data;
    } catch (error: any) {
      console.log("verifysignup  error", error?.response?.data || error);
      throw new Error(error?.response?.data?.message || "verifysignup failed");
    }

    },


  // async sendOTP(payload: OtpPayload): Promise<SignupResponse> {
  //   try {
  //     console.log("sendOTP called", payload);

  //     const response = await api.post(`/otp/request-signup-otp`, payload);

  //     console.log("sendOTP response", response.data);

  //     return response.data.data;
  //   } catch (error: any) {
  //     console.log("sendOTP error", error?.response?.data || error);
  //     throw new Error(error?.response?.data?.message || "Signup failed");
  //   }
  // },

  // async verifyOTP(payload: OtpPayload) {
  //   try {
  //     console.log("verifyOTP called", payload);

  //     const response = await api.post(`/otp/verify-signup-otp`, payload);

  //     console.log("verifyOTP response", response.data);

  //     return response.data.data;
  //   } catch (error: any) {
  //     console.log("verifyOTP error", error?.response?.data || error);
  //     throw new Error(error?.response?.data?.message || "OTP verification failed");
  //   }
  // },

  // async createAccount(payload:createAccoutPayload) {
  //   try {
  //     console.log("createAccount called", payload);

  //     const response = await api.post(`/auth/signup`, payload);

  //     console.log("createAccount response", response.data);

  //     return response.data.data;
  //   } catch (error: any) {
  //     console.log("createAccount error", error?.response?.data || error);
  //     throw new Error(error?.response?.data?.message || "Account creation failed");
  //   }
  // },

  // async LogIn(payload: LoginPayload) {
  //   try {
  //     console.log("LogIn called", payload);

  //     const response = await api.post(`/auth/login`, payload);

  //     console.log("LogIn response", response.data);

  //     return response.data.data;
  //   } catch (error: any) {
  //     console.log("LogIn error", error?.response?.data || error);
  //     throw new Error(error?.response?.data?.message || "Login failed");
  //   }
  // },
};