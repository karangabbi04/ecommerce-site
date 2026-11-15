import type { ToolDefinition } from "../interface.js";


export const CouponDefinations: ToolDefinition[] = [
  
  // TOOL 1: Create Coupon
  {
    name: "create_coupon",
    description: "Create a new discount coupon in the database. Use this tool when the user wants to CREATE, MAKE, ADD, or GENERATE a coupon with specific discount, usage limit, or expiry date. DO NOT use this tool if user is asking for coupon DESCRIPTION or MARKETING TEXT.",
    parameters: {
      type: "OBJECT",
      properties: {
        code: {
          type: "STRING",
          description: "Coupon code. If the admin did not provide one, ask for a code instead of inventing one."
        },
        description: {
          type: "STRING",
          description: "Short description of the coupon, at least 3 characters."
        },
        discountType: {
          type: "STRING",
          enum: ["PERCENTAGE", "FIXED"],
          description: "Whether the discount is a percentage or fixed currency amount."
        },
        discountValue: {
          type: "NUMBER",
          description: "Discount amount. For PERCENTAGE use a number from 1 to 100."
        },
        minOrderAmount: {
          type: "NUMBER",
          description: "Optional minimum order amount required to use the coupon."
        },
        maxDiscount: {
          type: "NUMBER",
          description: "Optional maximum discount amount for percentage coupons."
        },
        usageLimit: {
          type: "INTEGER",
          description: "Optional maximum number of times this coupon can be used."
        },
        startsAt: {
          type: "STRING",
          format: "date-time",
          description: "Start date/time in ISO 8601 format."
        },
        expiresAt: {
          type: "STRING",
          format: "date-time",
          description: "Expiry date/time in ISO 8601 format. Required; ask if not provided."
        },
        isActive: {
          type: "BOOLEAN",
          description: "Whether the coupon is active."
        }
      },
      required: ["code", "discountType", "discountValue", "expiresAt"]
    }
  },

  // TOOL 2: Get Coupon Details
  {
    name: "get_coupon_details",
    description: "Get details of a specific coupon by its code.",
    parameters: {
      type: "OBJECT",
      properties: {
        code: {
          type: "STRING",
          description: "Coupon code to look up. Example: 'SUMMER30'"
        }
      },
      required: ["code"]
    }
  },

  // TOOL 3: Get Sales Summary
  {
    name: "get_sales_summary",
    description: "Get sales statistics for a time period.",
    parameters: {
      type: "OBJECT",
      properties: {
        period: {
          type: "STRING",
          enum: ["today", "week", "month", "year"],
          description: "Time period for sales data"
        }
      },
      required: ["period"]
    }
  }
];

