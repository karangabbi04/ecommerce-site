
import { check } from "zod";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { generateOrderNumber } from "../utils/generateOrderNumber";
import Razorpay from "razorpay";
import { razorpay } from "../config/razorpay";




 export interface CreateOrderDto {
  checkoutSessionId: string;
  userId?: string;
  guestId?: string;
}


export const createOrderService = async(dto:CreateOrderDto)=>{

const {
    checkoutSessionId,
    userId,
    guestId
  } = dto;

///checkout session fetch 

    const checkoutSession =
await prisma.checkoutSession.findFirst({
         where: {
            id: checkoutSessionId,

            ...(userId
            ? { userId }
            : { guestId }),

            status: "ACTIVE"
            },

            include: {
                items: true,
                address: true
            }
});


        if (!checkoutSession) {
            throw new ApiError(
              404,"Checkout session not found")}

        if (!checkoutSession.address) {
            throw new ApiError(
             400, "Address required" )}
        
        if (checkoutSession.items.length === 0) {
            throw new ApiError(
             400,"Cart empty")}

        if (checkoutSession.expiresAt < new Date()) {
            throw new ApiError(
            400, "Checkout session expired",)}


/////product validation 

        const products =
        await prisma.product.findMany({
        where: {
            id: {
            in: checkoutSession.items.map(
                i => i.productId
                )
            }
        }
        });


        for (const item of checkoutSession.items) {

            const product = products.find(
                p => p.id === item.productId
            );

            if (!product) {
                throw new ApiError(
                400,"Product not found"
                );
            }

            if (product.stock < item.quantity) {
                throw new Error(
                `${product.name} out of stock`
                );
            }
            }


////////// address snapshot create


            const addressSnapshot = {
        fullName:
            checkoutSession.address.fullName,

        phone:
            checkoutSession.address.phone,

        addressLine1:
            checkoutSession.address.addressLine1,

        city:
            checkoutSession.address.city,

        state:
            checkoutSession.address.state,

        country:
            checkoutSession.address.country,

        postalCode:
            checkoutSession.address.postalCode,

        latitude:
            checkoutSession.address.latitude,

        longitude:
            checkoutSession.address.longitude
        };


      const result =   await prisma.$transaction(
        async (tx) => {

/// create couter or order number
            const counter =
        await tx.orderCounter.update({
            where:{
                id:1
            },

            data:{
                value:{
                increment:1
                }
            }
            });


            const orderNumber =
            generateOrderNumber(
            counter.value
            );


// create order 
                const order =
        await tx.order.create({
            data: {

            orderNumber:orderNumber,
            
            customerName:
            checkoutSession?.address?.fullName ?? " ",

            customerPhone:
            checkoutSession?.address?.phone ?? " ",

            addressId:
            checkoutSession.address?.id ?? " ",

            addressSnapshot,

            subtotal:
            checkoutSession.subtotal,

            tax:
            checkoutSession.tax,

            shipping:
            checkoutSession.shipping,

            total:
            checkoutSession.total
        }
        });


    //create order item 

        await tx.orderItem.createMany({
                 data:
                checkoutSession.items.map(item => ({
                orderId: order.id,

                productId:
                    item.productId,

                productName:
                    item.productName,

                quantity:
                    item.quantity,

                unitPrice:
                    item.unitPrice,

                totalPrice:
                    item.unitPrice.mul(
                    item.quantity
                    )
                }))
            });


// create razorpay order 


        const razorpayOrder =
        await razorpay.orders.create({

            amount:
                Math.round(
                Number(checkoutSession.total) * 100
                ),

            currency: "INR",

            receipt: order.id
            });


/// create paymnet with pending status 

        await tx.payment.create({
            data: {
                orderId: order.id,

                gateway: "RAZORPAY",

                amount: checkoutSession.total,

                razorpayOrderId:
                razorpayOrder.id,

                status: "PENDING"
            }
            });


///update checkout session with payment pending 

        
        await tx.checkoutSession.update({
            where: {
                id: checkoutSession.id
            },

            data: {
                status:
                "PAYMENT_PENDING"
            }
            });
        


            return {
                orderId: order.id,

                amount:
                    Number(checkoutSession.total) * 100,

                razorpayOrderId:
                    razorpayOrder.id,

                key:
                    process.env.RAZORPAY_KEY_ID
                };

  },   
)
return result
}