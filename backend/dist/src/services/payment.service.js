"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const ApiError_1 = require("../utils/ApiError");
const razorpay_1 = require("../config/razorpay");
const prisma_1 = require("../lib/prisma");
const verify_RazorpaySignature_1 = require("../utils/verify-RazorpaySignature");
razorpay_1.razorpay;
const paymentService = async (dto) => {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = dto;
    const payment = await prisma_1.prisma.payment.findFirst({
        where: {
            orderId
        },
        include: {
            order: {
                include: {
                    items: true
                }
            }
        }
    });
    if (!payment) {
        throw new ApiError_1.ApiError(400, "payment not found ");
    }
    // if (
    // payment.status ===
    // PaymentRecordStatus.SUCCESS
    // ) {
    // return {
    // success: true
    // };
    // }
    const isValidSignature = (0, verify_RazorpaySignature_1.verifyRazorpaySignature)({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
    });
    if (!isValidSignature) {
        await prisma_1.prisma.payment.update({
            where: {
                id: payment.id
            },
            data: {
                status: "FAILED"
            }
        });
        throw new ApiError_1.ApiError(400, "Invalid Signature");
    }
    return prisma_1.prisma.$transaction(async (tx) => {
        await tx.payment.update({
            where: {
                id: payment.id
            },
            data: {
                status: "SUCCESS",
                razorpayPaymentId,
                razorpaySignature
            }
        });
        await tx.order.update({
            where: {
                id: orderId
            },
            data: {
                paymentStatus: "PAID",
                status: "CONFIRMED"
            }
        });
        for (const item of payment.order.items) {
            await tx.product.update({
                where: {
                    id: item.productId
                },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });
        }
        // await tx.checkoutSession.update({
        //     where: {
        //     id:
        //     payment.order.checkoutSessionId
        //     },
        //     data: {
        //     status: "PAID"
        //     }
        //     });
        return { success: true, orderId };
    });
};
exports.paymentService = paymentService;
