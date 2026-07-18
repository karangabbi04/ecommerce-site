import { asyncHandler } from "../utils/asyncHandler.js";
import e, { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { generateOTP, hashOTP, getOTPExpiryTime } from "../utils/otp.js";
import { sendOTPEmail } from "../lib/email.js";
import { ApiError } from "../utils/apiError.js";
import {prisma} from "../lib/prisma.js"; 
import { z } from "zod";
import { send } from "node:process";
import { otpService } from "../services/otp.service.js";
import { OtpPurpose } from "@prisma/client";

const requestSignupOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const verifySignupOTPSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),

});

 export const requestSignupOTP= asyncHandler(async (req: Request, res: Response) => {

        const data = requestSignupOTPSchema.parse(req.body);

await otpService.sendOTP({

    email: data.email,

    purpose: OtpPurpose.SIGNUP

});

 res.status(200).json(

    new ApiResponse(
        200,
        null,
        "OTP sent successfully."
    )

);
});


// export const verifySignupOTP = asyncHandler(async (req: Request, res: Response) => {

//         const data = verifySignupOTPSchema.parse(req.body);

// await otpService.verifyOTP({
//     email: data.email,
//     otp: data.otp,
//     purpose: OtpPurpose.SIGNUP,
// });

//  res.status(200).json(
//     new ApiResponse(
//         200,
//         null,
//         "OTP verified successfully."
//     )
// );



// })