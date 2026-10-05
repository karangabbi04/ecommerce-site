import { number, string } from "zod"
import { PaymentStatus,OrderStatus,Prisma } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"


export interface ordercreateInput {

  orderNumber:string,

  guestId?:string,
  userId?:string,

  customerName:string
  customerEmail?:string
  customerPhone :string

  addressId:string
  addressSnapshot?: Prisma.InputJsonValue
  status?:OrderStatus
  currentStatus?:OrderStatus

  paymentStatus?:PaymentStatus

  subtotal:Decimal
  tax:Decimal             
  shipping:Decimal    
  couponId?:string | null
  couponCode?:string | null
  discount?:Decimal

  total:Decimal


}


// Request body jab naya order banta hai
export interface CreateOrderRequest {
  userId: string;
  totalAmount: number;
  items: any[]; // Tumhare cart items ka type yaha daalo
}

// Request body jab status update hota hai
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  note?: string;
  updatedBy?: string; // Admin ya System ka ID
}

// API Response format
export interface OrderTimelineResponse {
  id: string;
  status: OrderStatus;
  note: string | null;
  createdAt: Date;
}

export interface OrderResponse {
  id: string;
  userId: string;
  totalAmount: number;
  currentStatus: OrderStatus;
  timeline: OrderTimelineResponse[];
  createdAt: Date;
}




export interface OrderQueryParams {
  status?: string;
  date?: string;         // Specific date (YYYY-MM-DD)
  start_date?: string;   // Date range start
  end_date?: string;     // Date range end
  page?: string;
  limit?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: Date;
  // ... other fields
}