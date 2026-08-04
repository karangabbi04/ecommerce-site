import { email } from "zod";
import { adminRepository, analyticsRepository } from "../repositories/Analytics.repository";
import { ApiError } from "../utils/apiError";
import { comparePassword } from "../utils/password";
import { otpService } from "./otp.service";
import { OtpPurpose, } from "@prisma/client";
import { redisService } from "./redis.service";
import { TempAuthUser } from "../types/user.types";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { otpRepository } from "../repositories/otp.repository";
import { prisma } from "../lib/prisma";
import { Role } from "../constants/admin.constants";
import { AnalyticsRepository } from "../repositories/Analytics.repository";


export interface admin {

 id:string;

 email:string;

 password:string;

 role:Role;

}


class AdminService{



     adminlogin = async (email:string,password:string) =>{

    const normalizeEmail= email.trim().toLowerCase();


       const admin = await adminRepository.adminLoginbyEmail(normalizeEmail)

      if (!admin || !admin.password ) {
    throw new ApiError(400, "ACCESS DENIED");
  }
  if (admin.role !== "ADMIN") {
    throw new ApiError(400, "ACCESS DENIED");

  }

    const isPasswordValid = await comparePassword(password, admin.password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid   password");
      }

      await redisService.set(
          `auth:user:${admin.email}`,
          {
                   id: admin.id,
                  name: admin.name,
                  email: admin.email,
                  phone: admin.phone,
                  emailVerified: admin.emailVerified,
                  createdAt: admin.createdAt,
          },
          300
      );
    
      await otpService.sendOTP({email, purpose:OtpPurpose.LOGIN});
    
       return 

} 


  adminLoginVerify = async(email:string,otp:string)=>{

    await otpService.verifyOTP({email,otp,purpose:OtpPurpose.LOGIN});
   
    const admin =
            await redisService.get<TempAuthUser>(
                `auth:user:${email}`
            );

            if(!admin){
    throw new ApiError(400, "login session expird or cached ");

    }  
        await otpRepository.deleteOTPByEmail(prisma,email,OtpPurpose.LOGIN);


    

             const accessToken = generateAccessToken({
                     userId: admin.id,
                      email: admin.email,
                      role:admin.role
                  });
            
             const refreshToken = generateRefreshToken({
                    userId: admin.id,
                      email: admin.email,
                      role: admin.role
                });
            
                return {admin,
                 accessToken,refreshToken }
}


   orderDetail = async ()=>{

       const order = await adminRepository.findTotalOrder()

       if(!order){
         throw new ApiError(400,"somthing want wrong to fetch orders detail")
       }    

       // findTotalOrder returns an array grouped by status; map to a more usable shape
       const orderData = order.map(o => ({
         status: o.status,
         count: o._count?.id ?? 0,
       }));

       return orderData

   }



}


export const adminService =  new AdminService()




 class AnalyticsService {

async revenue(query:any){

    const startDate = query.startDate ? new Date(query.startDate) : new Date("2025-01-01");

    const endDate =query.endDate?new Date(query.endDate):new Date();


const revenue = await analyticsRepository.getRevenue({
  groupBy: query.groupBy,
  startDate,
  endDate,
});


return {

        range:{
        startDate,
        endDate
        },
      groupBy:
      query.groupBy,
      data:
      revenue
};


}}

export const analyticsService =  new AnalyticsService()
