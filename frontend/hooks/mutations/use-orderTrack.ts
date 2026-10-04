import { tracker } from "@/services/tracker.service";
import { useMutation } from "@tanstack/react-query";



export const useTrackOrder = () => {
  return useMutation({
    mutationFn: (orderNumber:string) => tracker(orderNumber),
  });
};