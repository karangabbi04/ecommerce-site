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