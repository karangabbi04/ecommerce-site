import { api } from "@/lib/api";
import { off } from "process";


export type addToCartPayload = {

    productId : string,
    quantity : number

};

export type checkoutpayload = {
    userId? : string,
    guestId? : string
};


export const cartService ={

    async addToCart(paylaod : addToCartPayload){
        console.log("jit api")

        const response = await api.post(`/cart/items`,paylaod);

        if(!response){

            console.log ("add to cart api not working ");
        }
        console.log("ad to cart respoc",response)

        return response.data ;

    },

    async getCart(){
        console.log("cart get api is called")
        const response = await api.get(`/cart/get-cart`)
    
        if(!response){

            console.log ("add to cart api not working ");
        }
        console.log("ad to cart respoc",response)

        return response.data.data ;
    },

    async updateCartItemQuantity(itemId : string,quantity : number){
        console.log("update cart item quantity api is called")
        const response = await api.patch(`/cart/items/${itemId}`,{quantity})
    
        if(!response){

            console.log ("update cart item quantity api not working ");
        }
        console.log("update cart item quantity respoc",response)

        return response.data.data ;

    },
    async removeCartItem(itemId : string){
        console.log("remove cart item api is called")
        const response = await api.delete(`/cart/items/${itemId}`)
    
        if(!response){

            console.log ("remove cart item api not working ");
        }
        console.log("remove cart item respoc",response)

        return response.data.data ;
    },



    


};