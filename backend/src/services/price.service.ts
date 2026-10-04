
import {
  GST_RATE,
  CHECKOUT_EXPIRY_MINUTES,
} from "../constants/checkout.constants.js";
import { Decimal } from "@prisma/client/runtime/library";

import {
  calculateShipping,
  calculateTax,
  calculateTotal,
//   getCheckoutExpiry,
} from "../utils/checkout.utils.js";

export type PricingItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type PricingCoupon = {
  id: string;
  code: string;

  discountType: "PERCENTAGE" | "FIXED";

  discountValue: Decimal;

  maxDiscount: number | null;
};

type CalculatePricingInput = {
  items: PricingItem[];
  coupon?: PricingCoupon | null;
};

export const calculateCheckoutPricing = ({
  items,
  coupon = null,
}: CalculatePricingInput) => {
  // 1. Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total.plus(new Decimal(item.unitPrice).mul(item.quantity)),
    new Decimal(0)
  );

  // 2. Calculate coupon discount
  let discountAmount = new Decimal(0);

  if (coupon) {
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = subtotal.mul(coupon.discountValue).div(100);
    }

    if (coupon.discountType === "FIXED") {
      discountAmount = coupon.discountValue;
    }

    // Never allow discount > subtotal
    if (discountAmount.gt(subtotal)) {
      discountAmount = subtotal;
    }

    // Apply maximum discount
    if (coupon.maxDiscount !== null) {
      const maxDiscount = new Decimal(coupon.maxDiscount);

      if (discountAmount.gt(maxDiscount)) {
        discountAmount = maxDiscount;
      }
    }
  }

  // 3. Amount after coupon
  const discountedSubtotal = subtotal.minus(discountAmount);

  // 4. Shipping
  const shipping = new Decimal(
    calculateShipping(discountedSubtotal.toNumber())
  );

  // 5. Tax
  const tax = new Decimal(
    calculateTax(discountedSubtotal.toNumber(), GST_RATE)
  );

  // 6. Final total
  const total = discountedSubtotal.plus(shipping).plus(tax);

  return {
    subtotal,
    discountAmount,
    discountedSubtotal,
    shipping,
    tax,
    total,
  };
};