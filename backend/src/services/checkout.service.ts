import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";


type CheckoutInput = {
  userId?: string;
  guestId?: string;
};

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

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: cart.items.map((item) => item.productId),
            },
        },
    });

    let subtotal = 0;

    const lineItems = cart.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
            throw new ApiError(404, `Product with ID ${item.productId} not found`);
        }

        subtotal += Number(product.price) * item.quantity;

        return {
            productId: product.id,
            quantity: item.quantity,
            unitPrice: Number(product.price),
        };
    });

    const shipping = 100;
    const tax = Number((subtotal * 0.18).toFixed(2));
    const total = subtotal + shipping + tax;
        console.log("Creating checkout session with input:");

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
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
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

        return checkoutSession;

    });
    return session; 

    


};