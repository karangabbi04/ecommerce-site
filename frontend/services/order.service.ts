import {api} from "@/lib/api";

export const createOrder = async (
  checkoutSessionId: string
) => {

  const response = await api.post(
    `/order/${checkoutSessionId}`,
    {
      checkoutSessionId
    }
  );

  return response.data;
};

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  total: string | number;
  status: string;
  currentStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export const getAllOrders = async (): Promise<AdminOrder[]> => {
  const response = await api.get("/admin/orders/all");

  if (!response.data || !Array.isArray(response.data.data)) {
    throw new Error("Invalid response from server");
  }
  return response.data.data;
};


export const getFilteredOrders = async (
  searchPrams: Record<string, string | number | undefined>
) => {
  const params = { ...searchPrams };

  if (typeof params.status === "string") {
    const normalizedStatus = params.status.toUpperCase();
    if (normalizedStatus === "ALL") {
      delete params.status;
    } else {
      params.status = normalizedStatus;
    }
  }

  params.page = Number(params.page ?? 1);
  params.limit = Number(params.limit ?? 10);

  const response = await api.get("/admin/order-query", {
    params,
  });

  if (!response.data || !response.data.data) {
    throw new Error("Invalid response from server");
  }

  return response.data.data;
};

export const getOrderByRazorId = async (RazorId: string) => {

  const response = await api.get(`/order/${RazorId}`);

  if (!response.data || !response.data.data) {
    throw new Error("Invalid response from server");
  }
  console.log("Order data fetched:", response.data.data);

  return response.data.data;
}


export const getOdersForAdminWithCount = async () => {

  const response = await api.get("/admin/orders-count");

    if(!response.data || !response.data.data){
      throw new Error("Invalid response from server");
    }

    return response.data.data;
}