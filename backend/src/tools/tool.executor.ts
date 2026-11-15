import { CouponService } from "../services/coupon.service";
import { productService } from "../services/product.service.js";
import { couponschema } from "../validations/coupon.validation";
import {getAllowedToolNames,getExecutorByName} from "../tools/tool-registry.js";
import { createProductFromAIToolSchema } from "../validations/product-validation.js";

import type { ToolResult, User } from "./interface.js";

export class ToolExecutor {
  static async execute(functionName: string, args: any, user: User): Promise<ToolResult> {
    console.log(`\n🔧 Executing: ${functionName}`);
    console.log("📥 Args:", args);

    try {
      // 1. Permission Check
      const allowed = getAllowedToolNames(user.role);
      const isAllowed = allowed.some((tool) => tool.name === functionName);
      if (!isAllowed) {
        throw new Error(`Permission Denied: ${user.role} cannot execute ${functionName}`);
      }
      const validatedArgs = this.validateWithzod(functionName, args);


 const executor = getExecutorByName(functionName);
      if (!executor) {
        throw new Error(`No executor found for: ${functionName}`);
      }

      return await executor(validatedArgs, user);



    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  static validateParams(functionName: string, args: any): any {
    return this.validateWithzod(functionName, args);
  }

  static validateWithzod(functionName: string, args: any): any {
    console.log("validating function", functionName, args);

    if (functionName === "create_product") {
      const validated = createProductFromAIToolSchema.parse(args);
      console.log("✅ Product tool validation passed");
      return validated;
    }

    const schemaMap: Record<string, typeof couponschema> = {
      create_coupon: couponschema,
      // Add more mappings as needed
    };

    const schema = schemaMap[functionName];

    if (schema) {
      const normalizedArgs = functionName === "create_coupon"
        ? {
            ...args,
            code: String(args.code ?? "").trim().toUpperCase(),
          description: String(args.description ?? `${String(args.code ?? "").trim().toUpperCase()} coupon`),
          minOrderAmount: args.minOrderAmount === undefined ? undefined : Number(args.minOrderAmount),
          maxDiscount: args.maxDiscount === undefined ? undefined : Number(args.maxDiscount),
          usageLimit: args.usageLimit === undefined ? undefined : Number(args.usageLimit),
            startsAt: args.startsAt ? new Date(args.startsAt) : new Date(),
            expiresAt: args.expiresAt ? new Date(args.expiresAt) : undefined,
            isActive: args.isActive ?? true,
          }
        : args;
      const validated = schema.parse(normalizedArgs);
      console.log("✅ Zod validation passed");
      return validated;
    }

    return this.basicValidation(functionName, args);
  }



  static basicValidation(functionName: string, args: any) {
    const validators: Record<string, (args: any) => void> = {
      get_coupon_details: (args: { code: any }) => {
        if (!args.code) throw new Error("Coupon code is required");
      },
      delete_coupon: (args: { code: any }) => {
        if (!args.code) throw new Error("Coupon code is required");
      },
      get_sales_summary: (args: { period: string }) => {
        if (!args.period) throw new Error("Period is required");
        const validPeriods = ["today", "week", "month", "year", "all_time"];
        if (!validPeriods.includes(args.period)) {
          throw new Error(`Period must be one of: ${validPeriods.join(", ")}`);
        }
      },
    };

    if (validators[functionName]) {
      validators[functionName](args);
    }

    return args;
  }


}