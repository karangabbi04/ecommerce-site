import { PaymentStatus } from "@prisma/client";
import { TrackingRepsitory } from "../repositories/orderTracking.repository";


export async  function trackingservice(orderId:string) {
  
    const response = await TrackingRepsitory.orderTrack(orderId)
    
    if(!response){
          return { errorMessage: "could not find order or orderID is incorrect " };
        
    }

    const orderItem= await TrackingRepsitory.orderItem(response.id)

    if(!orderItem){
        return{errorMessage:"could not find order item "}
    }



    return {response,orderItem}



}