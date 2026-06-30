import { api } from "@/lib/api";


export const checkoutService ={

    async checkout (){
        console.log("checkout api is called")
        const res = await api.post(`/checkout/create-session`)
    
        if(!res){

            console.log ("checkout api not working ");
        }
        

        return res.data.data ;
    },

    async fetchCheckout (checkoutId:string){
        console.log("checkout api is called")
        const res = await api.get(`/checkout/${checkoutId}`)
    
        if(!res){

            console.log ("checkout api not working ");
        }
        
        console.log(res?.data,"sdjfklsf")

        return res.data.data ;
    }
}