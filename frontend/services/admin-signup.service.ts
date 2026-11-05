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

      const response = await api.post(`admin/verify`, { email, otp });

      console.log("verifylogin  response", response.data);

      return response.data.data;
    } catch (error: any) {
      console.log("verifylogin  error", error?.response?.data || error);
      throw new Error(error?.response?.data?.message || "verifylogin failed");
    }

    },

    async checkAdminAccess(token: string) {
        try {
            const response = await api.get(`admin/check-access`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error: any) {
            console.log("checkAdminAccess error", error?.response?.data || error);
            throw new Error(error?.response?.data?.message || "Check admin access failed");
        }
    },


}
