import { api } from "@/lib/api";

export type OtpPayload = {
  email: string;
};




  export const  sendOTP = async (payload: OtpPayload)=>{
    try {
      console.log("sendOTP called", payload);

      const response = await api.post(`/otp/request-signup-otp`, payload);

      console.log("sendOTP response", response.data);

      return response.data.data;
    } catch (error: any) {
      console.log("sendOTP error", error?.response?.data || error);
      throw new Error(error?.response?.data?.message || "Signup failed");
    }
  }
