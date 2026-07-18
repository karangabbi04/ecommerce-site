"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = void 0;
const prisma_1 = require("../lib/prisma");
const ApiError_1 = require("../utils/ApiError");
const getOrCreateCart_1 = require("../utils/getOrCreateCart");
const cart_constants_1 = require("../constants/cart.constants");
const cart__repository_1 = require("../repositories/cart .repository");
const cart_mapper_1 = require("../mapper/cart.mapper");
class CartService {
    async getCart(params) {
        const { userId, guestId, res } = params;
        const cart = await (0, getOrCreateCart_1.getOrCreateCart)({
            userId,
            guestId,
            res,
        });
        const cartWithItems = await cart__repository_1.cartRepository.getCartWithItems(prisma_1.prisma, cart.id);
        if (!cartWithItems) {
            throw new ApiError_1.ApiError(404, cart_constants_1.CART_ERRORS.CART_NOT_FOUND);
        }
        return (0, cart_mapper_1.mapToClientCartResponse)(cartWithItems);
    }
    async addToCart(params) {
        const { dto, userId, guestId, res } = params;
        const { productId, quantity } = dto;
        // Guest/User cart create ya fetch
        const cart = await (0, getOrCreateCart_1.getOrCreateCart)({
            userId,
            guestId,
            res,
        });
        const updatedCart = await prisma_1.prisma.$transaction(async (tx) => {
            // Product
            const product = await cart__repository_1.cartRepository.findProduct(tx, productId);
            if (!product) {
                throw new ApiError_1.ApiError(404, cart_constants_1.CART_ERRORS.PRODUCT_NOT_FOUND);
            }
            // Product Status
            if (product.status !== "ACTIVE") {
                throw new ApiError_1.ApiError(400, cart_constants_1.CART_ERRORS.PRODUCT_UNAVAILABLE);
            }
            // Out of stock
            if (product.stock <= 0) {
                throw new ApiError_1.ApiError(400, cart_constants_1.CART_ERRORS.OUT_OF_STOCK);
            }
            // Existing cart item
            const existingItem = await cart__repository_1.cartRepository.findCartItem(tx, cart.id, productId);
            const nextQuantity = existingItem
                ? existingItem.quantity + quantity
                : quantity;
            // Stock validation
            if (nextQuantity > product.stock) {
                throw new ApiError_1.ApiError(400, cart_constants_1.CART_ERRORS.STOCK_EXCEEDED);
            }
            // Upsert item
            await cart__repository_1.cartRepository.upsertCartItem(tx, cart.id, productId, nextQuantity);
            // Updated cart
            return cart__repository_1.cartRepository.getCartWithItems(tx, cart.id);
        });
        if (!updatedCart) {
            throw new ApiError_1.ApiError(500, "Failed to fetch updated cart.");
        }
        return (0, cart_mapper_1.mapCart)(updatedCart);
    }
    async removeCartItem(params) {
        const { itemId, userId, guestId, res } = params;
        let cart = null;
        if (userId) {
            cart = await cart__repository_1.cartRepository.findCartByUserId(userId);
        }
        else if (guestId) {
            cart = await cart__repository_1.cartRepository.findCartByGuestId(guestId);
        }
        if (!cart) {
            throw new ApiError_1.ApiError(404, cart_constants_1.CART_ERRORS.CART_NOT_FOUND);
        }
        const updatedCart = await prisma_1.prisma.$transaction(async (tx) => {
            const cartItem = await cart__repository_1.cartRepository.findCartItemById(tx, itemId);
            if (!cartItem) {
                throw new ApiError_1.ApiError(404, cart_constants_1.CART_ERRORS.CART_ITEM_NOT_FOUND);
            }
            if (cartItem.cartId !== cart.id) {
                throw new ApiError_1.ApiError(403, cart_constants_1.CART_ERRORS.UNAUTHORIZED_CART_ITEM);
            }
            await cart__repository_1.cartRepository.removeCartItem(tx, itemId);
            return cart__repository_1.cartRepository.getCartWithItems(tx, cart.id);
        });
        if (!updatedCart) {
            throw new ApiError_1.ApiError(500, "Failed to fetch updated cart.");
        }
        return (0, cart_mapper_1.mapToClientCartResponse)(updatedCart);
    }
    async updateCartItemQuantity(params) {
        const { productId, quantity, userId, guestId } = params;
        let cart = null;
        if (userId) {
            cart = await cart__repository_1.cartRepository.findCartByUserId(userId);
        }
        else if (guestId) {
            cart = await cart__repository_1.cartRepository.findCartByGuestId(guestId);
        }
        if (!cart) {
            throw new ApiError_1.ApiError(404, cart_constants_1.CART_ERRORS.CART_NOT_FOUND);
        }
        const updatedCart = await prisma_1.prisma.$transaction(async (tx) => {
            const product = await cart__repository_1.cartRepository.findProduct(tx, productId);
            if (!product) {
                throw new ApiError_1.ApiError(404, cart_constants_1.CART_ERRORS.PRODUCT_NOT_FOUND);
            }
            if (product.status !== "ACTIVE") {
                throw new ApiError_1.ApiError(400, cart_constants_1.CART_ERRORS.PRODUCT_UNAVAILABLE);
            }
            if (quantity > product.stock) {
                throw new ApiError_1.ApiError(400, cart_constants_1.CART_ERRORS.STOCK_EXCEEDED);
            }
            const cartItem = await cart__repository_1.cartRepository.findCartItem(tx, cart.id, productId);
            if (!cartItem) {
                throw new ApiError_1.ApiError(404, "Cart item not found");
            }
            await cart__repository_1.cartRepository.updateCartItemQuantity(tx, cartItem.id, quantity);
            return cart__repository_1.cartRepository.getCartWithItems(tx, cart.id);
        });
        if (!updatedCart) {
            throw new ApiError_1.ApiError(500, "Unable to update cart");
        }
        return (0, cart_mapper_1.mapCart)(updatedCart);
    }
}
exports.cartService = new CartService();
