


import { Op } from "sequelize";
import { ApiError } from "../utils/apiError.js";
import { generateOrderNumber } from "../utils/generateOrderNumber.js";
import { razorpay } from "../config/razorpay.js";
import { orderRepository } from "../repositories/order.repository.js";
import { prisma } from "../lib/prisma.js";
import { CouponService } from "./coupon.service.js";
import { CouponRepository } from "../repositories/coupon.repository.js";
import { calculateCheckoutPricing } from "./price.service.js";
import { OrderStatus } from "@prisma/client";
import { UpdateOrderStatusRequest } from "../types/order.types.js";
import { orderTrack } from "../controllers/OrderTracking.controller.js";
import { TrackingRepsitory } from "../repositories/orderTracking.repository.js";


export interface CreateOrderDto {
  checkoutSessionId: string;
  userId?: string;
  guestId?: string;
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.PACKED, OrderStatus.CANCELLED],
  PACKED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [OrderStatus.OUT_FOR_DELIVERY],
  OUT_FOR_DELIVERY: [OrderStatus.DELIVERED],
  DELIVERED: [OrderStatus.REFUNDED],
  CANCELLED: [],
  REFUNDED: [],
};

export const createOrderService = async (
  dto: CreateOrderDto
) => {

  const {
    checkoutSessionId,
  } = dto;

  const checkoutSession =
    await orderRepository.findCheckoutSession(
      checkoutSessionId
    );

  if (!checkoutSession) {
    throw new ApiError(
      404,
      "Checkout session not found"
    );
  }

   const address = checkoutSession.address;
  if (!address) {
    throw new ApiError(
      400,
      "Address not found for checkout session"
    );
  }

  if (!checkoutSession.items.length) {
    throw new ApiError(
      400,
      "Cart is empty"
    );
  }

  if (checkoutSession.expiresAt < new Date()) {
    throw new ApiError(
      400,
      "Checkout session expired"
    );
  }



  const products =
    await orderRepository.findProducts(
      checkoutSession.items.map(
        item => item.productId
      )
    );

  for (const item of checkoutSession.items) {

    const product = products.find(
      p => p.id === item.productId
    );

    if (!product) {
      throw new ApiError(
        400,
        "Product not found"
      );
    }

    if (product.stock < item.quantity) {
      throw new ApiError(
        400,
        `${product.name} is out of stock`
      );
    }
  }

  const coupon = checkoutSession.couponCode
    ? await CouponRepository.findCoupon(
        prisma,
        checkoutSession.couponCode,
      )
    : null;

    if (checkoutSession.couponCode && !coupon) {
      throw new ApiError(400, "Applied coupon is no longer valid. Remove it and try again.");
    }

  const pricing =
  calculateCheckoutPricing({
    items: checkoutSession.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    })),

    coupon: coupon
      ? {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          maxDiscount: coupon.maxDiscount
            ? Number(coupon.maxDiscount)
            : null,
        }
      : null,
  });


  const addressSnapshot = {
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    city: address.city,
    state: address.state,
    country: address.country,
    postalCode: address.postalCode,
    latitude: address.latitude,
    longitude: address.longitude,
  };

      const createOrder = await prisma.$transaction(async (tx) => {

      const counter =
        await tx.orderCounter.update({
          where: { id: 1 },
          data: {
            value: {
              increment: 1,
            },
          },
        });

      const orderNumber =
        generateOrderNumber(counter.value);

      const order =
        await orderRepository.createOrder(tx,{
          
            orderNumber,

            guestId:checkoutSession.guestId ?? undefined,
            
            userId:checkoutSession.userId ?? undefined,

            customerName:
              address.fullName,

            customerPhone:
              address.phone,

          addressId:address.id,

            addressSnapshot,

            customerEmail: address?.email ?? undefined,

          couponId: coupon?.id ?? null,
          couponCode: coupon?.code ?? null,

          discount:pricing.discountAmount,
            subtotal:
              pricing.subtotal,

            tax:
              pricing.tax,

            shipping:
              pricing.shipping,

            total:
              pricing.total,

              currentStatus:OrderStatus.PENDING
      
        });

        await tx.orderTimeline.create({
        data: {
          orderId: order.id,
          status: OrderStatus.PENDING,
          note: "Order placed successfully.",
          updatedBy: "SYSTEM",
        },
      });

        if (coupon) {
          await tx.couponUsage.create({
            data: {
              couponId: coupon.id,
              orderId: order.id,
              userId: checkoutSession.userId,
            },
          });

          await CouponRepository.incrementUsedCount(tx, coupon.id);
        }

      await tx.orderItem.createMany({
        data:checkoutSession.items.map(item => ({
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice:
            item.unitPrice.mul(item.quantity),
        })),
      });

      const razorpayOrder =
        await razorpay.orders.create({
          amount: Math.round(
            Number(pricing.total) * 100
          ),
          currency: "INR",
          receipt: order.id,
        });

      await tx.payment.create({
        data: {
          orderId: order.id,
          gateway: "RAZORPAY",
          amount: pricing.total,
          razorpayOrderId:
            razorpayOrder.id,
          status: "PENDING",
        },
      });

      await tx.checkoutSession.update({
        where: {
          id: checkoutSession.id,
        },
        data: {
          status: "PAYMENT_PENDING",
        },
      });

      return {
        
        orderId: order.id,
        razorpayOrderId:
          razorpayOrder.id,
        amount:
          Math.round(
            Number(pricing.total) * 100
          ),
        key:
          process.env.RAZORPAY_KEY_ID,
      };
      
    });

  return createOrder;

};



export const updateOrderStatus = async (orderId:string,data:UpdateOrderStatusRequest)=>{

  const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { currentStatus: true },
    });

    if (!currentOrder) {
      throw new ApiError(404, "Order not found");
    }


     const allowedNextStatuses = VALID_TRANSITIONS[currentOrder.currentStatus];
    if (!allowedNextStatuses.includes(data.status)) {
      throw new ApiError(400,
        `cannot  status transition from ${currentOrder.currentStatus} to ${data.status}`
      );

      
    }

    // Transaction me update karo
    await prisma.$transaction(async (tx) => {
      // 1. Main order ka status update karo
      await tx.order.update({
        where: { id: orderId },
        data: { currentStatus: data.status },
      });

      // 2. Timeline me naya entry add karo
      await tx.orderTimeline.create({
        data: {
          orderId: orderId,
          status: data.status,
          note: data.note || `Status updated to ${data.status}`,
          updatedBy: data.updatedBy || "SYSTEM",
        },
      });
    });

    return TrackingRepsitory.orderTrackById(orderId);

}


export const  getFilteredOrders = async (queryParams: any) => {

  const { status, dateType, startDate, endDate, page = 1, limit = 10 } = queryParams;

  const whereClause: any = {};

  if (status) {
    whereClause.currentStatus = status;
  }

     // Filter by Date Logic (PostgreSQL Timestamp handling)
    if (dateType === 'today') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        // Postgres me range ke liye Op.between best hai
        whereClause.createdAt = {
            [Op.between]: [startOfDay, endOfDay]
        };
    } 
    else if (dateType === 'yesterday') {
        const startOfYesterday = new Date();
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);

        const endOfYesterday = new Date();
        endOfYesterday.setDate(endOfYesterday.getDate() - 1);
        endOfYesterday.setHours(23, 59, 59, 999);

        whereClause.createdAt = {
            [Op.between]: [startOfYesterday, endOfYesterday]
        };
    } 
    else if (startDate && endDate) {
        // Specific Date Range
        whereClause.createdAt = {
            [Op.between]: [
                new Date(startDate), 
                new Date(endDate + "T23:59:59.999Z")
            ]
        };
    }

    // 2. Calculate pagination offset (skip ki jagah offset use hota hai SQL me)
    const offset = (page - 1) * limit


    // 3. Call repository
    const orders = await orderRepository.findOrderQuery(whereClause, offset, limit);
    const totalOrders = await orderRepository.countOrders(whereClause);

    return {
        orders,
        pagination: {
            total: totalOrders,
            page,
            limit,
            totalPages: Math.ceil(totalOrders / limit)
        }
    };
}



export const getOrderDetailsByRazorpayId = async (razorpayOrderId: string) => {

  const orderDetails = await orderRepository.findOrderByRazorpayId(razorpayOrderId);

  if (!orderDetails) {
    throw new ApiError(404, "Order not found for the given Razorpay Order ID");
  }

  return orderDetails;
}