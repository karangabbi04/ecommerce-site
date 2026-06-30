import { Request,Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import { createcheckoutsession, fetchCheckoutSession} from "../services/checkout.service";
import { asyncHandler } from "../utils/asyncHandler";

export const checkoutController = asyncHandler(async (req: Request, res: Response) => {

    const userId = req.user?.id;
    const guestId = req.cookies.guest_cart_id;
   

    if (!userId && !guestId) {
        throw new ApiError(401, "Unauthorized");
    }


    const session = await createcheckoutsession({userId,guestId});

   return  res.status(200).json(new ApiResponse( 200,session,"Checkout session created"));
});


export const fetchCheckoutsession = asyncHandler(async (req: Request, res: Response) => {

     const checkoutId = req.params.checoutId

     console.log(checkoutId)


     if (typeof checkoutId !== "string") {
        throw new ApiError(400,"checkoutID not provided ")

}


     if(!checkoutId){
        throw new ApiError(400,"checkoutID not provided ")
     }

        const result = await fetchCheckoutSession(checkoutId)

   return res.status(200).json(new ApiResponse( 200,result,"Checkout session created"));


})



