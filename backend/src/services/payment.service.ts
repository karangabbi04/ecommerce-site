import { ApiError } from "../utils/apiError.js";
import { razorpay } from "../config/razorpay.js";
import { prisma } from "../lib/prisma.js";
import { verifyRazorpaySignature } from "../utils/verify-RazorpaySignature.js";
razorpay

export interface VerifyPaymentDto {
  orderId: string;

  razorpayOrderId: string;

  razorpayPaymentId: string;

  razorpaySignature: string;
}

export const  paymentService = async (dto:VerifyPaymentDto)=> {
    
     const {

   orderId,

   razorpayOrderId,

   razorpayPaymentId,

   razorpaySignature

 } = dto;

         const payment = await prisma.payment.findFirst({

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

    
        if(!payment){
            throw new ApiError(400,"payment not found ")
        }

        // if (
        // payment.status ===
        // PaymentRecordStatus.SUCCESS
        // ) {

        // return {
        // success: true
        // };

        // }

        const isValidSignature = verifyRazorpaySignature({

        razorpayOrderId,

        razorpayPaymentId,

        razorpaySignature

        });

        if (!isValidSignature) {

            await prisma.payment.update({

            where: {
                id: payment.id
            },

            data: {
                status: "FAILED"
            }

            });

            throw new ApiError(400,
            "Invalid Signature"
            );
            }


            return prisma.$transaction(
            async (tx) => {

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

                paymentStatus:
                    "PAID",

                status:
                    "CONFIRMED"

                }

                });

                for (
                const item
                of payment.order.items
                ) {

                await tx.product.update({

                where: {
                    id:
                    item.productId
                },

                data: {

                    stock: {

                    decrement:
                        item.quantity

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

          return { success: true,orderId };

    
 })



}