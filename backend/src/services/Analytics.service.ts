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


// --- Types ---
type Granularity = 'day' | 'week' | 'month' | 'year';
type Period =
  | 'today'
  | 'thisMonth'
  | 'last3Months'
  | 'last6Months'
  | 'thisYear'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_3_months'
  | 'last_12_months'
  | 'this_year'
  | 'custom';

interface AnalyticsResponse {
  labels: string[];
  revenue: number[];
  orders: number[];
}


// 1. Date ko increment karne ke liye 
function addInterval(date: Date, granularity: Granularity): Date {
  const newDate = new Date(date);
  if (granularity === 'day') newDate.setUTCDate(newDate.getUTCDate() + 1);
  else if (granularity === 'week') newDate.setUTCDate(newDate.getUTCDate() + 7);
  else if (granularity === 'month') newDate.setUTCMonth(newDate.getUTCMonth() + 1);
  else if (granularity === 'year') newDate.setUTCFullYear(newDate.getUTCFullYear() + 1);
  return newDate;
}

// 2. Date ko Map key me convert karne ke liye (DB data match karne ke liye)
function getMapKey(date: Date, granularity: Granularity): string {
  if (granularity === 'day') return date.toISOString().slice(0, 10); // YYYY-MM-DD
  if (granularity === 'week') {
    const monday = new Date(date);
    const day = monday.getUTCDay() || 7;
    monday.setUTCDate(monday.getUTCDate() - day + 1);
    return monday.toISOString().slice(0, 10);
  }
  if (granularity === 'month') return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`; // YYYY-MM
  return `${date.getUTCFullYear()}`; // YYYY
}

// 3. Frontend chart ke liye Date ko readable label me convert karne ke liye
function getFormattedLabel(date: Date, granularity: Granularity): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (granularity === 'day' || granularity === 'week') return `${date.getUTCDate()} ${months[date.getUTCMonth()]}`; // e.g., 25 Oct
  if (granularity === 'month') return `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`; // e.g., Oct 2023
  return `${date.getUTCFullYear()}`; // e.g., 2023
}

function getDateRange(period: Period, startDate?: string, endDate?: string) {
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
  let start: Date;

  if (period === 'custom') {
    if (!startDate || !endDate) {
      throw new ApiError(400, 'Both startDate and endDate are required for a custom range.');
    }

    start = new Date(`${startDate}T00:00:00.000Z`);
    const customEnd = new Date(`${endDate}T00:00:00.000Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(customEnd.getTime()) || start > customEnd) {
      throw new ApiError(400, 'The custom date range is invalid.');
    }
    customEnd.setUTCHours(23, 59, 59, 999);
    return { start, end: customEnd };
  }

  start = new Date(end);
  start.setUTCHours(0, 0, 0, 0);

  switch (period) {
    case 'today':
      break;
    case 'thisMonth':
      start.setUTCDate(1);
      break;
    case 'last3Months':
    case 'last_3_months':
      start.setUTCMonth(start.getUTCMonth() - 3);
      break;
    case 'last6Months':
      start.setUTCMonth(start.getUTCMonth() - 6);
      break;
    case 'last_12_months':
      start.setUTCMonth(start.getUTCMonth() - 12);
      break;
    case 'thisYear':
    case 'this_year':
      start = new Date(Date.UTC(end.getUTCFullYear(), 0, 1));
      break;
    case 'last_30_days':
      start.setUTCDate(start.getUTCDate() - 29);
      break;
    case 'last_7_days':
    default:
      start.setUTCDate(start.getUTCDate() - 6);
      break;
  }

  return { start, end };
}

function getGranularity(start: Date, end: Date): Granularity {
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / 86_400_000);
  if (diffDays <= 90) return 'day';
  if (diffDays <= 730) return 'month';
  return 'year';
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

//fint total number of order by status and total order count

   orderDetail = async ()=>{

       const order = await adminRepository.findTotalOrder()

       if(!order){
         throw new ApiError(400,"somthing want wrong to fetch orders detail")
       }    

       // findTotalOrder returns an array grouped by status; map to a more usable shape
       const orderData = order.map(o => ({
         status: o.currentStatus,
         count: o._count?.id ?? 0,
       }));

       return orderData

   }


  //fint all order for admin
   
       allOrders = async () => {
         const order = await adminRepository.findAll();

          if (!order) {
            throw new ApiError(400, "something went wrong to fetch orders");
          }

          return order;
        };
}


export const adminService =  new AdminService()




 class AnalyticsService {

  async revenue(query: {
    period?: Period;
    startDate?: string;
    endDate?: string;
    groupBy?: Granularity;
  }) {
    const period: Period = query.period ?? (
      query.startDate || query.endDate ? 'custom' : 'last_7_days'
    );
    const { start, end } = getDateRange(period, query.startDate, query.endDate);
    const granularity = query.groupBy ?? getGranularity(start, end);

    const rawData = await analyticsRepository.getRevenue({
      groupBy: granularity,
      startDate: start,
      endDate: end,
    }) as Array<{ period: Date | string; revenue: number | string | null; orders: number }>;

    const dataByPeriod = new Map<string, { revenue: number; orders: number }>();
    for (const row of rawData) {
      dataByPeriod.set(getMapKey(new Date(row.period), granularity), {
        revenue: Number(row.revenue) || 0,
        orders: Number(row.orders) || 0,
      });
    }

    const labels: string[] = [];
    const revenue: number[] = [];
    const orders: number[] = [];
    const chartData: Array<{ period: string; month: string; revenue: number; orders: number }> = [];

    for (let date = new Date(start); date <= end; date = addInterval(date, granularity)) {
      const label = getFormattedLabel(date, granularity);
      const values = dataByPeriod.get(getMapKey(date, granularity)) ?? { revenue: 0, orders: 0 };

      labels.push(label);
      revenue.push(values.revenue);
      orders.push(values.orders);
      chartData.push({ period: label, month: label, ...values });
    }

    return {
      range: { startDate: start, endDate: end },
      groupBy: granularity,
      labels,
      revenue,
      orders,
      data: chartData,
    };
  }
}

export const analyticsService =  new AnalyticsService()
