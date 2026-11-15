import { CouponService } from "../../services/coupon.service";
import { ToolResult, User } from "../interface";

export const couponExecutor: Record<string, (args: any, user: User) => Promise<ToolResult>> = {
  create_coupon: async (args: any, user: User) => {
    const coupon = await CouponService.createCoupon(args);

    return {
      success: true,
      message: `Coupon '${coupon.code}' created successfully`,
      data: {
        id: coupon.id,
        code: coupon.code,
        discountValue: coupon.discountValue,
        usageLimit: coupon.usageLimit,
        expiresAt: coupon.expiresAt,
      },
    };
  },

  get_coupon_details: async (args: any, user: User) => {
    const coupon = await CouponService.getCouponDetails(args.code);
    if (!coupon) {
      return { success: false, error: "Coupon not found" };
    }
    return { success: true, data: coupon };
  },
};