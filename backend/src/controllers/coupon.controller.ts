
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { CouponService } from "../services/coupon.service";
import { createCoupontype,couponschema } from "../validations/coupon.validation.js";
import { ApiError } from "../utils/apiError";
import { checkoutRepository } from "../repositories/checkout.repository";
import { Request, Response } from "express";


export const createcoupon = asyncHandler(async (req:Request,res:Response)=>{

    const data = couponschema.safeParse(req.body);
    console.log(data)

    if(!data.success){
        throw new ApiError(400,"somthing want wrong to create coupnn")
    }

    const coupon = await CouponService.createCoupon(data.data);

    res.status(201)
        .json(new ApiResponse(201,coupon,"coupn create successfully "))

})

export const applyCoupon = asyncHandler(async (req:Request,res:Response)=>{

      const { checkoutId } = req.params;
    const { couponCode } = req.body;

    if (typeof checkoutId !== "string") {
      throw new ApiError(400, "Invalid checkout id");
    }

    const result = await CouponService.applycoupon({
      checkoutId,
      code: couponCode,
    });

    if ("errorMessage" in result) {
       res
        .status(200)
        .json(new ApiResponse(200, null, result.errorMessage));
    }

     res
      .status(200)
      .json(new ApiResponse(200, result, "coupon apply successfully"));
})


export const removeCoupon  = asyncHandler(async (req:Request,res:Response)=>{

      const { checkoutId } = req.params;


    if (typeof checkoutId !== "string") {
      throw new ApiError(400, "Invalid checkout id");
    }

    const result = await CouponService.removeCoupon( checkoutId,);

        res.status(200).json( new ApiResponse(200,result,"coupon remove  successfully "))
})