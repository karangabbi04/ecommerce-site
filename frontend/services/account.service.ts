import { api } from "@/lib/api";

export interface AccountProfile {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  createdAt: string;
}

export interface AccountOrder {
  id: string;
  orderNumber: string;
  currentStatus: string;
  paymentStatus: string;
  total: number | string;
  createdAt: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number | string;
    totalPrice: number | string;
  }[];
}

export const accountService = {
  async getProfile(): Promise<AccountProfile> {
    const response = await api.get("/auth/me");
    return response.data.data.user;
  },

  async getOrders(): Promise<AccountOrder[]> {
    const response = await api.get("/order/my-orders");
    return response.data.data;
  },
};
