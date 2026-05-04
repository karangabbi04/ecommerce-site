import { asyncHandler } from "../utils/asyncHandler";
import e, { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { generateOTP, hashOTP, getOTPExpiryTime } from "../utils/otp";
import { sendSignupOTPEmail } from "../lib/email";
import { ApiError } from "../utils/ApiError";
import {prisma} from "../lib/prisma"; 
import { z } from "zod";
import { send } from "node:process";

const requestSignupOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
});

 export const requestSignupOTP= asyncHandler(async (req: Request, res: Response) => {

    const { email } = req.body;

    const norrmalizedEmail = email.toLowerCase().trim();
    
    const existingUser = await prisma.user.findUnique({
        where: {
            email: norrmalizedEmail,
        },
    });


    if (existingUser?.emailVerified) {

        return res.status(400)
        .json(new ApiResponse(400, null, "Email is already registered and verified"));
     }
    

     const recentOTP = await prisma.emailOTP.findFirst({
        where: {
            email: norrmalizedEmail,
            purpose: "SIGNUP",
            createdAt: {
                gt: new Date(Date.now() - 10 * 60 * 1000), // check for OTPs created in the last 10 minutes
            },
        },
     });

     if (recentOTP) {

        return res.status(429)
        .json(new ApiResponse(429, null, "OTP already sent recently. Please wait before requesting a new one"));
     }

      await prisma.emailOTP.deleteMany({
      where: {
        email: norrmalizedEmail,
        purpose: "SIGNUP",
      },
    });

    //generate and hash OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
        const expiresMinutes = Number((process.env.OTP_EXPIRES_IN ));
        const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

    await prisma.emailOTP.create({
        data: {
            email: norrmalizedEmail,
            otpHash: hashedOTP,
            purpose: "SIGNUP",
            expiresAt: expiresAt,
        },
    });

        await sendSignupOTPEmail({
            to: norrmalizedEmail,
             otp
            });

        return res.status(200)
        .json(new ApiResponse(200, null, "OTP sent to email "));
});