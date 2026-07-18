import { Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "../../src/lib/prisma.js";

import { cartSelect } from "../select/cart.selects.js";

class CartRepository {
  async findCartById(cartId: string) {
    return prisma.cart.findUnique({
      where: {
        id: cartId,
      },
      select: cartSelect,
    });
  }

  async findCartByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: {
        userId,
      },
      select: cartSelect,
    });
  }

  async findCartByGuestId(guestId: string) {
    return prisma.cart.findUnique({
      where: {
        guestId,
      },
      select: cartSelect,
    });
  }

  async getCartWithItems(db: Prisma.TransactionClient | PrismaClient,cartId: string) {
    return db.cart.findUnique({
      where: {
        id: cartId,
      },
      select: cartSelect,
    });
  }

async findProduct(
  db: Prisma.TransactionClient | PrismaClient,
  productId: string
) {
    return db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        status:true,
      },
    });
  }

  async findCartItem(
    tx: Prisma.TransactionClient,
    cartId: string,
    productId: string
  ) {
    return tx.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });
  }

  async findCartItemById(
    db: Prisma.TransactionClient | PrismaClient,
    cartItemId: string
  ) {
    return db.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
      select: {
        id: true,
        cartId: true,
      },
    });
  }

  async upsertCartItem(
    tx: Prisma.TransactionClient,
    cartId: string,
    productId: string,
    quantity: number
  ) {
    return tx.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },

      update: {
        quantity,
      },

      create: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  async updateCartItemQuantity(
    tx: Prisma.TransactionClient,
    cartItemId: string,
    quantity: number
  ) {
    return tx.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
    });
  }

  async removeCartItem(
    tx: Prisma.TransactionClient,
    cartItemId: string
  ) {
    return tx.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
  }

  async clearCart(
    tx: Prisma.TransactionClient,
    cartId: string
  ) {
    return tx.cartItem.deleteMany({
      where: {
        cartId,
      },
    });
  }
  async getCartItems(db:PrismaClient | Prisma.TransactionClient,cartId: string) {
  return db.cartItem.findMany({
    where: {
      cartId,
    },

    include: {
      product: true,
    },
  });
 }
 async cartExists(cartId: string) {
  return prisma.cart.count({
    where: {
      id: cartId,
    },
  });
}
async getCartItemCount(cartId: string) {
  return prisma.cartItem.count({
    where: {
      cartId,
    },
  });
}
}

export const cartRepository = new CartRepository();