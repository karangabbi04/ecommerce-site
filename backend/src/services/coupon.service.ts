
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