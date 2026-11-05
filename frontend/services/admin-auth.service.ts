import { api } from "@/lib/api";

export interface AdminProfile {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
}

export const adminAuthService = {
  async getCurrentAdmin(): Promise<AdminProfile> {
    const response = await api.get("/auth/me");
    return response.data.data.user;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
