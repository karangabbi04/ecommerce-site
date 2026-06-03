import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService,addToCartPayload } from "@/services/cart.service";

export const useAddToCart =() =>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:(payload:addToCartPayload)=>{
            return cartService.addToCart(payload)
        },
         onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (error) => {
      console.log("Add to cart error:", error);
    },
    })
}


export const useUpdateCartItemQuantity =() =>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:({itemId,quantity}:{itemId:string,quantity:number})=>{
            return cartService.updateCartItemQuantity(itemId,quantity)
        },
         onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (error) => {
      console.log("Update cart item quantity error:", error);
    },
    })
}

export const useRemoveCartItem =() =>{

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:(itemId:string)=>{
            return cartService.removeCartItem(itemId)
        },
         onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (error) => {
      console.log("Remove cart item error:", error);
    },
    })
}