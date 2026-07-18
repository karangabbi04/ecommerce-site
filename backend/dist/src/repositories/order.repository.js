"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRepository = void 0;
const prisma_1 = require("../lib/prisma");
class OrderRepository {
    async findCheckoutSession(checkoutSessionId) {
        return prisma_1.prisma.checkoutSession.findUnique({
            where: {
                id: checkoutSessionId,
            },
            include: {
                items: true,
                address: true,
            },
        });
    }
    async findProducts(productIds) {
        return prisma_1.prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        });
    }
    async incrementOrderCounter(db) {
        return db.orderCounter.update({
            where: {
                id: 1,
            },
            data: {
                value: {
                    increment: 1,
                },
            },
        });
    }
    async createOrder(db, data) {
        return db.order.create({
            data,
        });
    }
    async createOrderItems(db, data) {
        return db.orderItem.createMany({
            data,
        });
    }
    async createPayment(db, data) {
        return db.payment.create({
            data,
        });
    }
    async updateCheckoutStatus(db, checkoutSessionId) {
        return db.checkoutSession.update({
            where: {
                id: checkoutSessionId,
            },
            data: {
            //   status,
            },
        });
    }
}
exports.orderRepository = new OrderRepository();
