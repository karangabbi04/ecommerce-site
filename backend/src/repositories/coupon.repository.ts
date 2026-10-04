import { Prisma,PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { createCoupontype } from "../validations/coupon.validation.js";


class couponRepository {

    async createCoupon(db:PrismaClient|Prisma.TransactionClient,data:createCoupontype){
        return db.coupon.create({
            data:{
              code:data.code,
              description:data.description,
              discountType:data.discountType,
              discountValue:data.discountValue,
              maxDiscount:data.maxDiscount,
              startsAt:data.startsAt,
              expiresAt:data.expiresAt,
              isActive:data.isActive
            }
        })
    }

    async findCoupon(db:PrismaClient|Prisma.TransactionClient,code:string){
        return db.coupon.findFirst({
            where:{
                code
            }
        })
    } 

    async incrementUsedCount(
        db: PrismaClient | Prisma.TransactionClient,
        couponId: string
    ) {
        return db.coupon.update({
            where: {
                id: couponId,
            },
            data: {
                usedCount: {
                    increment: 1,
                },
            },
        });
    }

    


}

export const CouponRepository = new couponRepository()