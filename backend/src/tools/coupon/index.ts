import { ToolDefinition } from "../interface";
import {CouponDefinations} from "./coupon.defination.js";
import { couponExecutor } from "./coupon.executors";

export const couponTools: ToolDefinition[] = CouponDefinations.map((defination) => ({
    name: defination.name,
    description: defination.description,
    parameters: defination.parameters,
    executor: couponExecutor[defination.name],
}))