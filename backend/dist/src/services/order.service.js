"use strict";
// import { check } from "zod";
// import { prisma } from "../lib/prisma";
// import { ApiError } from "../utils/ApiError";
// import { generateOrderNumber } from "../utils/generateOrderNumber";
// import Razorpay from "razorpay";
// import { razorpay } from "../config/razorpay";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderService = void 0;
//  export interface CreateOrderDto {
//   checkoutSessionId: string;
//   userId?: string;
//   guestId?: string;
// }
// export const createOrderService = async(dto:CreateOrderDto)=>{
// const {
//     checkoutSessionId,
//     userId,
//     guestId
//   } = dto;
// ///checkout session fetch 
// console.log(checkoutSessionId)
//     const checkoutSession =
// await prisma.checkoutSession.findFirst({
//          where: {
//             id: checkoutSessionId,
//             // status: "ACTIVE"
//             },
//             include: {
//                 items: true,
//                 address: true
//             }
// });
//         if (!checkoutSession) {
//             throw new ApiError(
//               404,"Checkout session not found")}
//         if (!checkoutSession.address) {
//             throw new ApiError(
//              400, "Address required" )}
//         if (checkoutSession.items.length === 0) {
//             throw new ApiError(
//              400,"Cart empty")}
//         if (checkoutSession.expiresAt < new Date()) {
//             throw new ApiError(
//             400, "Checkout session expired",)}
// /////product validation 
//         const products =
//         await prisma.product.findMany({
//         where: {
//             id: {
//             in: checkoutSession.items.map(
//                 i => i.productId
//                 )
//             }
//         }
//         });
//         for (const item of checkoutSession.items) {
//             const product = products.find(
//                 p => p.id === item.productId
//             );
//             if (!product) {
//                 throw new ApiError(
//                 400,"Product not found"
//                 );
//             }
//             if (product.stock < item.quantity) {
//                 throw new Error(
//                 `${product.name} out of stock`
//                 );
//             }
//             }
// ////////// address snapshot create
//             const addressSnapshot = {
//         fullName:
//             checkoutSession.address.fullName,
//         phone:
//             checkoutSession.address.phone,
//         addressLine1:
//             checkoutSession.address.addressLine1,
//         city:
//             checkoutSession.address.city,
//         state:
//             checkoutSession.address.state,
//         country:
//             checkoutSession.address.country,
//         postalCode:
//             checkoutSession.address.postalCode,
//         latitude:
//             checkoutSession.address.latitude,
//         longitude:
//             checkoutSession.address.longitude
//         };
//       const result =   await prisma.$transaction(
//         async (tx) => {
// /// create couter or order number
//             const counter =
//         await tx.orderCounter.update({
//             where:{
//                 id:1
//             },
//             data:{
//                 value:{
//                 increment:1
//                 }
//             }
//             });
//             const orderNumber =
//             generateOrderNumber(
//             counter.value
//             );
// // create order 
//                 const order =
//         await tx.order.create({
//             data: {
//             orderNumber:orderNumber,
//             customerName:
//             checkoutSession?.address?.fullName ?? " ",
//             customerPhone:
//             checkoutSession?.address?.phone ?? " ",
//             addressId:
//             checkoutSession.address?.id ?? " ",
//             addressSnapshot,
//             subtotal:
//             checkoutSession.subtotal,
//             tax:
//             checkoutSession.tax,
//             shipping:
//             checkoutSession.shipping,
//             total:
//             checkoutSession.total
//         }
//         });
//     //create order item 
//         await tx.orderItem.createMany({
//                  data:
//                 checkoutSession.items.map(item => ({
//                 orderId: order.id,
//                 productId:
//                     item.productId,
//                 productName:
//                     item.productName,
//                 quantity:
//                     item.quantity,
//                 unitPrice:
//                     item.unitPrice,
//                 totalPrice:
//                     item.unitPrice.mul(
//                     item.quantity
//                     )
//                 }))
//             });
// // create razorpay order 
//         const razorpayOrder =
//         await razorpay.orders.create({
//             amount:
//                 Math.round(
//                 Number(checkoutSession.total) * 100
//                 ),
//             currency: "INR",
//             receipt: order.id
//             });
// /// create paymnet with pending status 
//         await tx.payment.create({
//             data: {
//                 orderId: order.id,
//                 gateway: "RAZORPAY",
//                 amount: checkoutSession.total,
//                 razorpayOrderId:
//                 razorpayOrder.id,
//                 status: "PENDING"
//             }
//             });
// ///update checkout session with payment pending 
//         await tx.checkoutSession.update({
//             where: {
//                 id: checkoutSession.id
//             },
//             data: {
//                 status:
//                 "PAYMENT_PENDING"
//             }
//             });
//             return {
//                 orderId: order.id,
//                 amount:
//                     Number(checkoutSession.total) * 100,
//                 razorpayOrderId:
//                     razorpayOrder.id,
//                 key:
//                     process.env.RAZORPAY_KEY_ID
//                 };
//   },   
// )
// return result
// }
const ApiError_1 = require("../utils/ApiError");
const generateOrderNumber_1 = require("../utils/generateOrderNumber");
const razorpay_1 = require("../config/razorpay");
const order_repository_1 = require("../repositories/order.repository");
const prisma_1 = require("../lib/prisma");
const createOrderService = async (dto) => {
    const { checkoutSessionId, } = dto;
    const checkoutSession = await order_repository_1.orderRepository.findCheckoutSession(checkoutSessionId);
    if (!checkoutSession) {
        throw new ApiError_1.ApiError(404, "Checkout session not found");
    }
    const address = checkoutSession.address;
    if (!address) {
        throw new ApiError_1.ApiError(400, "Address not found for checkout session");
    }
    if (!checkoutSession.items.length) {
        throw new ApiError_1.ApiError(400, "Cart is empty");
    }
    if (checkoutSession.expiresAt < new Date()) {
        throw new ApiError_1.ApiError(400, "Checkout session expired");
    }
    const products = await order_repository_1.orderRepository.findProducts(checkoutSession.items.map(item => item.productId));
    for (const item of checkoutSession.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) {
            throw new ApiError_1.ApiError(400, "Product not found");
        }
        if (product.stock < item.quantity) {
            throw new ApiError_1.ApiError(400, `${product.name} is out of stock`);
        }
    }
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
    const createOrder = await prisma_1.prisma.$transaction(async (tx) => {
        const counter = await tx.orderCounter.update({
            where: { id: 1 },
            data: {
                value: {
                    increment: 1,
                },
            },
        });
        const orderNumber = (0, generateOrderNumber_1.generateOrderNumber)(counter.value);
        const order = await tx.order.create({
            data: {
                orderNumber,
                customerName: address.fullName,
                customerPhone: address.phone,
                addressId: address.id,
                addressSnapshot,
                subtotal: checkoutSession.subtotal,
                tax: checkoutSession.tax,
                shipping: checkoutSession.shipping,
                total: checkoutSession.total,
            },
        });
        await tx.orderItem.createMany({
            data: checkoutSession.items.map(item => ({
                orderId: order.id,
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.unitPrice.mul(item.quantity),
            })),
        });
        const razorpayOrder = await razorpay_1.razorpay.orders.create({
            amount: Math.round(Number(checkoutSession.total) * 100),
            currency: "INR",
            receipt: order.id,
        });
        await tx.payment.create({
            data: {
                orderId: order.id,
                gateway: "RAZORPAY",
                amount: checkoutSession.total,
                razorpayOrderId: razorpayOrder.id,
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
            razorpayOrderId: razorpayOrder.id,
            amount: Math.round(Number(checkoutSession.total) * 100),
            key: process.env.RAZORPAY_KEY_ID,
        };
    });
};
exports.createOrderService = createOrderService;
