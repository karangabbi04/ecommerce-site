
import { z } from "zod";

import {CouponDiscountType} from "@prisma/client";
export {CouponDiscountType};

export const couponschema = z.object({

  code : z
          .string("enter coupon code "),

  description: z
                .string()
                .min(3, "Description must be at least 10 characters"),

    discountType: z.enum(CouponDiscountType),

    discountValue : z
                .number(),

    maxDiscount: z
                .number()
                .optional(),
    
     usageLimit: z
                .number()
                .optional(),

     startsAt: z.coerce
                .date(),

    expiresAt: z.coerce
                .date(),
   
    isActive: z
                .boolean()

});

export type createCoupontype = z.infer<typeof couponschema>;