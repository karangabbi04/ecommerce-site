import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";


type CheckoutInput = {
  userId?: string;
  guestId?: string;
};

const GST_RATE = Number(process.env.GST_RATE) || 18;
const CHECKOUT_EXPIRY_MINUTES = Number(process.env.CHECKOUT_EXPIRY_MINUTES) || 25;

export const createcheckoutsession = async (input:CheckoutInput) => {



    const cart = await prisma.cart.findUnique({
        where: input.userId ? { userId: input.userId } : { guestId: input.guestId! },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

   

    let subtotal = 0;

    const lineItems = cart.items.map((item) => {
        const product = item.product;
        if (item.quantity > product.stock) {
        throw new ApiError(
            400,
            `${product.name} is out of stock`
        );
        }

       const  itemTotal = Number(product.price) * item.quantity;

        subtotal += itemTotal;

        return {
            productId: product.id,
            quantity: item.quantity,
            unitPrice: Number(product.price),
        };
    });

    const shipping = subtotal > 1000 ? 0 : 100;

    const tax = Number((subtotal * GST_RATE/100).toFixed(2));

    const total = subtotal + shipping + tax;
       



    const session = await prisma.$transaction(async (tx) => {
        const checkoutSession = await tx.checkoutSession.create({
            data: {
                userId:
                input.userId ?? null,

                guestId:
                input.guestId ?? null,
                subtotal,
                shipping,
                tax,
                total,
                expiresAt: new Date(Date.now() + CHECKOUT_EXPIRY_MINUTES * 60 * 1000),
            },
        });
        await tx.checkoutItem.createMany({
             data: 
             cart.items.map((item) => ({
                 checkoutSessionId: checkoutSession.id,
                  productId: item.product.id,
                   productName: item.product.name, 
                   quantity: item.quantity, 
                   unitPrice: item.product.price, 
                })),
         });

          const completeSession = await tx.checkoutSession.findUnique({
            where: { id: checkoutSession.id },
            include: { items: true },
        });

        return completeSession!;

    });
    return session; 

    


};




export const fetchCheckoutSession = async (checkoutId:string) =>{



    const result = await prisma.checkoutSession.findUnique({

          where: {
              id: checkoutId,
            },
            include:{
              address:true,
            }
    })

    return result


}
