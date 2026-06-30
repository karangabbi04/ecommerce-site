import { useMutation, useQuery , useQueryClient} from "@tanstack/react-query";
import { cartService , checkoutpayload} from "@/services/cart.service";
import { checkoutService } from "@/services/checkout.service";

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
  });
};

export const useCheckoutQuery = () => {
  return useQuery<CheckoutType>({
    queryKey: ["checkout"],
    enabled:false,
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



export interface CheckoutType {
  id: string;
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  addressId: string | null;
  guestId: string;
  status: string;
}

export const useCheckout = () => {

  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: () => checkoutService.checkout(),

onSuccess: (data) => {
      queryClient.setQueryData(["checkout"], data);
    },

  });
};