import {api} from "@/lib/api";

export const createOrder = async (
  checkoutSessionId: string
) => {

  const response = await api.post(
    "/orders/create",
    {
      checkoutSessionId
    }
  );

  return response.data;
};