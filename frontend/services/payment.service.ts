import {api} from "@/lib/api";

export const verifyPayment = async (
  payload: any
) => {

  const response = await api.post(
    "/payments/verify",
    payload
  );

  return response.data;
};