"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutRepository = exports.CheckoutRepository = void 0;
const prisma_1 = require("../../src/lib/prisma");
class CheckoutRepository {
    static findPendingCheckout(userId, guestId) {
        throw new Error("Method not implemented.");
    }
    static FindCart(userId, guestId) {
        throw new Error("Method not implemented.");
    }
    static findCart(userId, guestId) {
        throw new Error("Method not implemented.");
    }
    async findCart(userId, guestId) {
        return prisma_1.prisma.cart.findUnique({
            where: userId ? { userId } : { guestId: guestId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                stock: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async findPendingCheckout(userId, guestId) {
        return prisma_1.prisma.checkoutSession.findFirst({
            where: {
                ...(userId ? { userId } : { guestId }),
                status: "ACTIVE",
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                items: true,
                address: true,
            },
        });
    }
    async createCheckoutSession(tx, data) {
        return tx.checkoutSession.create({
            data: {
                userId: data.userId ?? null,
                guestId: data.guestId ?? null,
                subtotal: data.subtotal,
                shipping: data.shipping,
                tax: data.tax,
                total: data.total,
                expiresAt: data.expiresAt,
            },
        });
    }
    async createCheckoutItems(tx, data) {
        return tx.checkoutItem.createMany({
            data,
        });
    }
    async findCheckoutById(db, id) {
        return db.checkoutSession.findUnique({
            where: { id },
            include: {
                items: true,
                address: true,
            },
        });
    }
    async updateAddress(checkoutId, addressId) {
        return prisma_1.prisma.checkoutSession.update({
            where: {
                id: checkoutId,
            },
            data: {
                addressId,
            },
        });
    }
}
exports.CheckoutRepository = CheckoutRepository;
exports.checkoutRepository = new CheckoutRepository();
