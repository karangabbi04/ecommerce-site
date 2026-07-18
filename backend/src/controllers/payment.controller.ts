import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { paymentService } from "../services/payment.service.js";




export const verifyPayment = asyncHandler( async (req:Request, res:Response)=>{


     const result =
            await paymentService(
            req.body
            );

             res.status(201).json(
      new ApiResponse(201, result, "Address created successfully")
    );

})