import { OrderStatus } from "@prisma/client";
import type { ToolDefinition } from "../interface.js";

export const OrderDefinitions: ToolDefinition[] = [
 
  {
    name: "update_order_status",
    description:
      "Move an order to a valid next status. The service enforces permitted status transitions. Use only on an explicit admin request and do not invent order IDs.",
    parameters: {
      type: "OBJECT",
      properties: {
        orderId: { type: "STRING", format: "uuid", description: "Order UUID." },
        status: {
          type: "STRING",
          enum: Object.values(OrderStatus),
          description: "Requested next order status; must be a valid transition.",
        },
        note: { type: "STRING", description: "Optional note recorded in the order timeline." },
      },
      required: ["orderId", "status"],
    },
  },
  {
    name: "get_filtered_orders",
    description:
      "List and filter store orders by current status, date range, or date preset. Results are paginated.",
    parameters: {
      type: "OBJECT",
      properties: {
        status: {
          type: "STRING",
          enum: Object.values(OrderStatus),
          description: "Optional current order status filter.",
        },
        dateType: {
          type: "STRING",
          enum: ["today", "yesterday"],
          description: "Optional date preset. Use startDate/endDate for a custom range.",
        },
        startDate: {
          type: "STRING",
          format: "date",
          description: "Optional inclusive start date in YYYY-MM-DD format; pair with endDate.",
        },
        endDate: {
          type: "STRING",
          format: "date",
          description: "Optional inclusive end date in YYYY-MM-DD format; pair with startDate.",
        },
        page: { type: "INTEGER", description: "Page number, starts at 1; defaults to 1." },
        limit: { type: "INTEGER", description: "Page size from 1 to 50; defaults to 10." },
      },
      required: [],
    },
  },
  {
    name: "get_user_orders",
    description:
      "List orders belonging to a specific registered user. Admin-only. Never guess a user ID.",
    parameters: {
      type: "OBJECT",
      properties: {
        userId: { type: "STRING", format: "uuid", description: "Registered user's UUID." },
      },
      required: ["userId"],
    },
  },
  {
    name: "get_order_by_razorpay_id",
    description:
      "Look up an order and payment details by its Razorpay order ID. Do not invent the Razorpay ID.",
    parameters: {
      type: "OBJECT",
      properties: {
        razorpayOrderId: {
          type: "STRING",
          description: "Razorpay order identifier, for example order_xxxxx.",
        },
      },
      required: ["razorpayOrderId"],
    },
  },
];
