import { useMutation, useQuery , useQueryClient} from "@tanstack/react-query";
import { cartService , checkoutpayload} from "@/services/cart.service";

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation<any, any, { itemId: string; quantity: number }>({
    mutationFn: ({ itemId, quantity }) =>
      cartService.updateCartItemQuantity(itemId, quantity),

    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
    },
  });
};


export const useCheckout = () => {
  return useMutation({
    mutationFn: (checkoutData : checkoutpayload) => cartService.checkout(checkoutData),



  });
};