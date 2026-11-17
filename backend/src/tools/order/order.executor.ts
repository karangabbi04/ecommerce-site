import { OrderStatus } from "@prisma/client";
import { z } from "zod";

import {
  createOrderService,
  getFilteredOrders,
  getOrderDetailsByRazorpayId,
  getOrdersForUser,
  updateOrderStatus,
} from "../../services/order.service.js";
import type { ToolResult, User } from "../interface.js";



const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(OrderStatus),
  note: z.string().trim().max(500).optional(),
});

const filteredOrdersSchema = z.object({
  status: z.enum(OrderStatus).optional(),
  dateType: z.enum(["today", "yesterday"]).optional(),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
}).refine(
  (query) => Boolean(query.startDate) === Boolean(query.endDate),
  { message: "startDate and endDate must be provided together" },
).refine(
  (query) => !query.startDate || !query.endDate || query.startDate <= query.endDate,
  { message: "startDate must be on or before endDate" },
);

const userOrdersSchema = z.object({ userId: z.string().uuid() });
const orderIdSchema = z.object({ orderId: z.string().uuid() });
const razorpayIdSchema = z.object({
  razorpayOrderId: z.string().trim().min(1).max(100),
});

export const orderExecutor: Record<
  string,
  (args: Record<string, unknown>, user: User) => Promise<ToolResult>
> = {
 
  update_order_status: async (args, user) => {
    const input = updateOrderStatusSchema.parse(args);
    const order = await updateOrderStatus(input.orderId, {
      status: input.status,
      note: input.note,
      updatedBy: user.id,
    });

    return {
      success: true,
      message: `Order status updated to ${input.status}.`,
      data: order,
    };
  },

  get_filtered_orders: async (args) => {
    const query = filteredOrdersSchema.parse(args);
    const result = await getFilteredOrders(query);
    return { success: true, data: result };
  },

  get_user_orders: async (args) => {
    const { userId } = userOrdersSchema.parse(args);
    const orders = await getOrdersForUser(userId);
    return { success: true, data: orders };
  },

  get_order_by_razorpay_id: async (args) => {
    const { razorpayOrderId } = razorpayIdSchema.parse(args);
    const order = await getOrderDetailsByRazorpayId(razorpayOrderId);
    return { success: true, data: order };
  },
};
