import {api} from "@/lib/api";

 export type ApplyCouponVariables = {
  checkoutSessionId: string;
  code: string;
};

export const couponApply = async ({checkoutSessionId,code}:ApplyCouponVariables
) => {

  const response = await api.post(
    `/coupon/${checkoutSessionId}/coupon`,
    {
      couponCode: code
    }
  );

  if(!response){
    console.log("somthing errror to apply coupon ")
  }


  return response.data;
};

export const couponRemove = async (checkoutSessionId: string) => {
  const response = await api.delete(`/coupon/${checkoutSessionId}/coupon`);

   if(!response){
    console.log("somthing errror to apply coupon ")
  }

  console.log(response)
  return response.data;
};