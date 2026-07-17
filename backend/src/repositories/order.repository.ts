import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";

class OrderRepository {

  async findCheckoutSession(checkoutSessionId: string) {
    return prisma.checkoutSession.findUnique({
      where: {
        id: checkoutSessionId,
      },
      include: {
        items: true,
        address: true,
      },
    });
  }

  async findProducts(productIds: string[]) {
    return prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
  }

  async incrementOrderCounter(
    db: Prisma.TransactionClient | PrismaClient
  ) {
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

  async createOrder(
    db: Prisma.TransactionClient | PrismaClient,
    data: Prisma.OrderCreateInput
  ) {
    return db.order.create({
      data,
    });
  }

  async createOrderItems(
    db: Prisma.TransactionClient | PrismaClient,
    data: Prisma.OrderItemCreateManyInput[]
  ) {
    return db.orderItem.createMany({
      data,
    });
  }

  async createPayment(
    db: Prisma.TransactionClient | PrismaClient,
    data: Prisma.PaymentCreateInput
  ) {
    return db.payment.create({
      data,
    });
  }

  async updateCheckoutStatus(
    db: Prisma.TransactionClient | PrismaClient,
    checkoutSessionId: string,

  ) {
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

export const orderRepository = new OrderRepository();