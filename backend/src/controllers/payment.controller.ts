import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import { paymentService } from "../services/payment.service";




export const verifyPayment = asyncHandler( async (req:Request, res:Response)=>{


     const result =
            await paymentService(
            req.body
            );

             res.status(201).json(
      new ApiResponse(201, result, "Address created successfully")
    );

})