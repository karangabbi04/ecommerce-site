import {api} from "@/lib/api";

export const verifyPayment = async (
  payload: any
) => {

  const response = await api.post(
    "/payment/verify",
    payload
  );

  return response.data;
};