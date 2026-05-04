import { asyncHandler } from "../utils/asyncHandler";
import e, { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { generateOTP, hashOTP, getOTPExpiryTime } from "../utils/otp";
import { sendSignupOTPEmail } from "../lib/email";
import { ApiError } from "../utils/ApiError";
import {prisma} from "../lib/prisma"; 
import { z } from "zod";
import { compare } from "bcryptjs";

const verifySignupOTPSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),

});

const verifySignupOTP = asyncHandler(async (req: Request, res: Response) => {

    const { email, otp } = req.body;

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

     const existingOTP = await prisma.emailOTP.findFirst({
        where: {
            email: norrmalizedEmail,
            purpose: "SIGNUP",
        },
        orderBy: {
            createdAt: "desc",
        },
     });

     if (!existingOTP) {

        return res.status(400)
        .json(new ApiResponse(400, null, "No OTP found for this email. Please request a new one"));
     }

     if (existingOTP.expiresAt < new Date()) {

        await prisma.emailOTP.delete({
        where: {
          id: existingOTP.id,
        },
      });

        return res.status(400)
        .json(new ApiResponse(400, null, "OTP has expired. Please request a new one"));
     }

     if(existingOTP.attempts >= existingOTP.maxAttempts) {

        await prisma.emailOTP.delete({
            where: {
              id: existingOTP.id,
            },
          });

        return res.status(400)
        .json(new ApiResponse(400, null, "Maximum OTP verification attempts exceeded. Please request a new OTP"));

     }

     const isOTPValid =  compare(otp, existingOTP.otpHash);

     if (!isOTPValid) {

        await prisma.emailOTP.update({
            where: {
                id: existingOTP.id,
            },
            data: {
                attempts: existingOTP.attempts + 1,
            },
        });

        return res.status(400)
        .json(new ApiResponse(400, null, "Invalid OTP. Please try again"));
     }

     const user =  await prisma.$transaction(async (tx) => {

        const createdUser = await tx.user.upsert({
            where: {
                email: norrmalizedEmail,
            },
            update: {
                emailVerified: true,
                name: existingUser?.name,
            },
            create:{
                email: norrmalizedEmail,
                emailVerified: true,
                name: existingUser?.name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                emailVerified: true,
                createdAt: true,
            },
        });

        await tx.emailOTP.deleteMany({
            where: {
                email: norrmalizedEmail,
                purpose: "SIGNUP",
            },
        });

        return createdUser;
     });

     return res.status(200)
     .json(new ApiResponse(200, user, "Email verified successfully"));
         

  }); 

  export { verifySignupOTP,  };