import { api } from "@/lib/api";

export const tracker = async (orderNumber: string) => {
  const response = await api.post(`/tracking/track-order`,{
    orderNumber,
  });

   if(!response){
    console.log("somthing errror to find order ")
  }

  console.log(response)
  return response.data.data;
};