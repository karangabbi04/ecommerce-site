"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRepository = void 0;
const prisma_1 = require("../../src/lib/prisma");
const cart_selects_1 = require("../select/cart.selects");
class CartRepository {
    async findCartById(cartId) {
        return prisma_1.prisma.cart.findUnique({
            where: {
                id: cartId,
            },
            select: cart_selects_1.cartSelect,
        });
    }
    async findCartByUserId(userId) {
        return prisma_1.prisma.cart.findUnique({
            where: {
                userId,
            },
            select: cart_selects_1.cartSelect,
        });
    }
    async findCartByGuestId(guestId) {
        return prisma_1.prisma.cart.findUnique({
            where: {
                guestId,
            },
            select: cart_selects_1.cartSelect,
        });
    }
    async getCartWithItems(db, cartId) {
        return db.cart.findUnique({
            where: {
                id: cartId,
            },
            select: cart_selects_1.cartSelect,
        });
    }
    async findProduct(db, productId) {
        return db.product.findUnique({
            where: {
                id: productId,
            },
            select: {
                id: true,
                name: true,
                stock: true,
                price: true,
                status: true,
            },
        });
    }
    async findCartItem(tx, cartId, productId) {
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
    async findCartItemById(db, cartItemId) {
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
    async upsertCartItem(tx, cartId, productId, quantity) {
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
    async updateCartItemQuantity(tx, cartItemId, quantity) {
        return tx.cartItem.update({
            where: {
                id: cartItemId,
            },
            data: {
                quantity,
            },
        });
    }
    async removeCartItem(tx, cartItemId) {
        return tx.cartItem.delete({
            where: {
                id: cartItemId,
            },
        });
    }
    async clearCart(tx, cartId) {
        return tx.cartItem.deleteMany({
            where: {
                cartId,
            },
        });
    }
    async getCartItems(db, cartId) {
        return db.cartItem.findMany({
            where: {
                cartId,
            },
            include: {
                product: true,
            },
        });
    }
    async cartExists(cartId) {
        return prisma_1.prisma.cart.count({
            where: {
                id: cartId,
            },
        });
    }
    async getCartItemCount(cartId) {
        return prisma_1.prisma.cartItem.count({
            where: {
                cartId,
            },
        });
    }
}
exports.cartRepository = new CartRepository();
