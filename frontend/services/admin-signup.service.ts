import { api } from "@/lib/api";

export const AdminsignupService = {

    async login(email: string, password: string) {
         try {
      console.log("login  called",);

      const response = await api.post(`admin/login`, { email, password });

      console.log("signup  response", response.data);

      return response.data.data;
    } catch (error: any) {
      console.log("signup  error", error?.response?.data || error);
      throw new Error(error?.response?.data?.message || "Signup failed");
    }

    },

    async loginverify(email: string, otp: string) {
         try {
      console.log("verifylogin called",);

      const response = await api.post(`auth/verifyotp`, { email, otp });

      console.log("verifylogin  response", response.data);

      return response.data.data;
    } catch (error: any) {
      console.log("verifylogin  error", error?.response?.data || error);
      throw new Error(error?.response?.data?.message || "verifylogin failed");
    }

    }
}
