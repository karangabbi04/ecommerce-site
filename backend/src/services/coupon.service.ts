
import { ApiError } from "../utils/apiError.js";
import {prisma} from "../lib/prisma.js";
import { CouponRepository } from "../repositories/coupon.repository.js";
import { createCoupontype } from "../validations/coupon.validation.js";
import { checkoutRepository } from "../repositories/checkout.repository.js";
import { check } from "zod";
import { calculateCheckoutPricing } from "./price.service.js";
import { response } from "express";


class couponService {

    async createCoupon(data:createCoupontype){

        const coupon = await CouponRepository.createCoupon(prisma,data)

        if(!coupon){
            throw new ApiError(500,"some error occured to create coupon ")
        }

        return coupon

    }

      async getCouponDetails(code: string,) {
       

        const normalizedCode = code.trim().toUpperCase();
        if (!normalizedCode) {
          throw new ApiError(400, "Coupon code is required");
        }

        const coupon = await CouponRepository.findCoupon(prisma, normalizedCode);
        if (!coupon) {
          throw new ApiError(404, "Coupon not found");
        }

        const now = new Date();
        const remainingMilliseconds = Math.max(0, coupon.expiresAt.getTime() - now.getTime());
        const remainingSeconds = Math.floor(remainingMilliseconds / 1000);
        const days = Math.floor(remainingSeconds / 86400);
        const hours = Math.floor((remainingSeconds % 86400) / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        const isExpired = remainingMilliseconds === 0;
        const isScheduled = now < coupon.startsAt;
        const isAvailable = coupon.isActive && !isExpired && !isScheduled;

        return {
          id: coupon.id,
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrderAmount: coupon.minOrderAmount,
          maxDiscount: coupon.maxDiscount,
          isActive: coupon.isActive,
          status: isExpired ? "EXPIRED" : isScheduled ? "SCHEDULED" : coupon.isActive ? "ACTIVE" : "INACTIVE",
          isAvailable,
          startsAt: coupon.startsAt,
          expiresAt: coupon.expiresAt,
          timeUntilExpiry: { days, hours, minutes, seconds },
          usage: {
            usedCount: coupon.usedCount,
            usageLimit: coupon.usageLimit,
            remainingUses: coupon.usageLimit === null
              ? null
              : Math.max(0, coupon.usageLimit - coupon.usedCount),
          },
        };
      }

    async applycoupon({code, checkoutId}: { code: string; checkoutId: string }) {

        const coupon= await CouponRepository.findCoupon(prisma,code)

        const checkout = await checkoutRepository.findCheckoutById(prisma,checkoutId)

        if (!coupon) {
          return { errorMessage: "Coupon code does not match" };
        }
        if (!coupon.isActive) {
          return { errorMessage: "This coupon is inactive" };
        }
        const now = new Date();

        if (now < coupon.startsAt) {
          return { errorMessage: "Coupon is not active yet" };
        }

        if (now > coupon.expiresAt) {
          return { errorMessage: "Coupon has expired" };
        }
        if(!checkout){
            throw new ApiError(400,"expire checkout time or invalid checkoutid")
        }

        const pricing =
  calculateCheckoutPricing({
    items: checkout.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    })),

    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: (coupon.discountValue),
      maxDiscount: coupon.maxDiscount
        ? Number(coupon.maxDiscount)
        : null,
    },
  });


   const checkoutwithcoupon = await checkoutRepository.updatecheckout(
  checkout.id,
  {
    couponId: coupon.id,
    couponCode: coupon.code,

    subtotal: pricing.subtotal,
    discountAmount: pricing.discountAmount,

    shipping: pricing.shipping,
    tax: pricing.tax,
    total: pricing.total,
  }
);
        
        return checkoutwithcoupon
    }


    async removeCoupon(checkoutId:string){

        const checkout = await checkoutRepository.findCheckoutById( prisma,checkoutId );

        if (!checkout) {
            throw new ApiError(
                404,
                "Checkout session not found."
            );
        }

          const pricing = calculateCheckoutPricing({
          items: checkout.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
          })),
          coupon: null,
        });


        const updatedCheckout = await checkoutRepository.updatecheckout(checkoutId,{


          couponId:null,
          couponCode: null,

          subtotal: pricing.subtotal,
          discountAmount: pricing.discountAmount,

          shipping: pricing.shipping,
          tax: pricing.tax,
          total: pricing.total,
        
        })
       

          return {
            checkoutId: updatedCheckout.id,
            coupon: null,
            pricing,
          };
    }


}

export  const CouponService = new couponService()