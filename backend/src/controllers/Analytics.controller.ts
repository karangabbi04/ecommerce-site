import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { adminService } from "../services/Analytics.service";
import {  analyticsService } from "../services/Analytics.service";



 class AdminController{

   adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

    const admin = await adminService.adminlogin(email,password)

   res.status(200).
  json(new ApiResponse(200, admin, "admin logged in start "));


});


  adminVerify = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const {admin,refreshToken,accessToken} = await adminService.adminLoginVerify(email, otp);

   res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",

  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json(new ApiResponse(200, admin, "OTP verified successfully login sucess full "));

})


  orderInfo = asyncHandler(async (req: Request, res: Response) => {


     const orders = await adminService.orderDetail()

      
      res.status(200).json(new ApiResponse(200, orders, "fetch all order succesfully  "));

  })


    revenueDetail = asyncHandler(async (req: Request, res: Response) => {

      const query = req.query;
        
     const revenue = await analyticsService.revenue(query)

     if(!revenue) {
      throw new ApiError(400,"somthing want wrong to fetch revanue detail")
     }

      
      res.status(200).json(new ApiResponse(200, revenue, "fetch all revanue  succesfully  "));

  })

 }

 export const adminController = new AdminController()