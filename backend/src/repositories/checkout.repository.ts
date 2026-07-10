
import { Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "../../src/lib/prisma";

export class CheckoutRepository {
  static findPendingCheckout(userId: string | undefined, guestId: string | undefined) {
      throw new Error("Method not implemented.");
  }
  static FindCart(userId: string | undefined, guestId: string | undefined) {
      throw new Error("Method not implemented.");
  }
  static findCart(userId: string | undefined, guestId: string | undefined) {
      throw new Error("Method not implemented.");
  }
  async findCart(userId?: string, guestId?: string) {
    return prisma.cart.findUnique({
      where: userId ? { userId } : { guestId: guestId! },
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

  async findPendingCheckout(userId?: string, guestId?: string) {
    return prisma.checkoutSession.findFirst({
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

  async createCheckoutSession(tx: any, data: {
    userId?: string;
    guestId?: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    expiresAt: Date;
  }) {
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

  async createCheckoutItems(tx: any, data: any[]) {
    return tx.checkoutItem.createMany({
      data,
    });
  }

  async findCheckoutById( db:PrismaClient | Prisma.TransactionClient,id: string) {
    return db.checkoutSession.findUnique({
      where: { id },
      include: {
        items: true,
        address: true,
      },
    });
  }
}

export const checkoutRepository = new CheckoutRepository();