import { Response,Request } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { trackingservice } from "../services/orderTracking.service";


export const orderTrack = asyncHandler(async (req:Request,res:Response)=>{

    const {orderNumber} = req.body;


    const order = await trackingservice(orderNumber)


    if ("errorMessage" in order) {
       res
        .status(200)
        .json(new ApiResponse(200, null, order.errorMessage));
    }

     res
      .status(200)
      .json(new ApiResponse(200, order, "order find successfully "));



})