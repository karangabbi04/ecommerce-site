import { prisma } from "../lib/prisma.js";

import { ApiError } from "../utils/apiError.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
    generateAccessToken,
    generateRefreshToken
} from "../utils/token.js";

import { userRepository } from "../repositories/user.repository.js";

import { redisService } from "../services/redis.service.js";
import { TempAuthUser } from "../types/user.types.js";
import {
    RegisterUserDto,
    LoginUserDto,
    SignupCache
} from "../types/user.types.js";
import { otpService } from "./otp.service.js";
import { OtpPurpose } from "@prisma/client";
import { otpRepository } from "../repositories/otp.repository.js";
import { number } from "zod";


const SIGNUP_CACHE_PREFIX = "signup";
const SIGNUP_CACHE_TTL = 60 * 5;


export const registerStart = async (data: RegisterUserDto) => {

    const email=data.email.trim().toLowerCase();

        const existingUser=
            await userRepository.findByEmail(email);

            if(existingUser){

            throw new ApiError(
            400,
            "User already exists"
            );

            }

            const hashedPassword= await hashPassword(data.password);

            const key=`${SIGNUP_CACHE_PREFIX}:${email}`;

                await redisService.set(

                key,

                {

                name:data.name,

                email,

                password:hashedPassword

                },

                SIGNUP_CACHE_TTL

                );

                await otpService.sendOTP({email, purpose:OtpPurpose.SIGNUP});

                return;


}

export const  verifyRegistrationOTP = async (email:string,otp:string) => {


     await otpService.verifyOTP({email,otp,purpose:OtpPurpose.SIGNUP});



    const key=`${SIGNUP_CACHE_PREFIX}:${email}`;

const signupData=await redisService.get<SignupCache>(key);

    if(!signupData){

            throw new ApiError(400,"Signup session expired");
            }

            const user= await prisma.$transaction( async(tx)=>{

                    const createdUser= await userRepository.create(tx,{
                            
                        name:signupData.name,
                        email:signupData.email,
                        password:signupData.password
                        }
                    
                    );

                    await otpRepository.deleteOTPByEmail(tx,email,OtpPurpose.SIGNUP);



                    return createdUser;

            });


            if(!user){

                throw new ApiError(400,"user not created at time time ")
            }
                    await redisService.remove(key);


                        const accessToken = generateAccessToken({
                            userId: user.id,
                            email: user.email,
                            role:user.role,
                        });

                        const refreshToken = generateRefreshToken({
                            userId: user.id,
                            email: user.email,
                            role:user.role,

                        });

                    return {user,
                        accessToken,refreshToken

                    };

} 

export const  loginService = async (email:string,password:string) => {

    const user = await userRepository.findByEmail(email) 

   if (!user || !user.password) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
    throw new ApiError(400, "Invalid   password");
  }

  await redisService.set(
    `auth:user:${user.email}`,
    {
             id: user.id,
            name: user.name,
            email: user.email,
            phone:user.phone,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
    },
    300
);

  await otpService.sendOTP({email, purpose:OtpPurpose.LOGIN});

            return 


}

export const  verifyLogin = async (email:string,otp:string) => {

    await otpService.verifyOTP({email,otp,purpose:OtpPurpose.LOGIN});


        const user =
        await redisService.get<TempAuthUser>(
            `auth:user:${email}`
        );

    if(!user){
    throw new ApiError(400, "login session expird or cached ");

    }   

           const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone:user.phone,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            };

    await otpRepository.deleteOTPByEmail(prisma,email,OtpPurpose.LOGIN);

    
        const accessToken = generateAccessToken({
                            userId: user.id,
                            email: user.email,
                            role:user.role,
                        });

                        const refreshToken = generateRefreshToken({
                            userId: user.id,
                            email: user.email,
                            role:user.role,

                        });

                    return {userData,
                        accessToken,refreshToken




}
}


