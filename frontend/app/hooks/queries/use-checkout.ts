import { useMutation, useQuery , useQueryClient} from "@tanstack/react-query";
import { checkoutService } from "@/services/checkout.service";




export const useCheckout = (checkoutId:string)=>{

      return useQuery({
         queryKey: ["checkout-session", checkoutId],
     
         queryFn: () => checkoutService.fetchCheckout(checkoutId),
     
     
         staleTime: 5 * 60 * 1000,
       });
}