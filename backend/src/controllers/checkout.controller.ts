import { Request,Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import { createcheckoutsession } from "../services/checkout.service";
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