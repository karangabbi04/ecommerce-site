import { Response } from "express";
import { prisma } from "../lib/prisma";

import { ApiError } from "../utils/ApiError";
import { getOrCreateCart } from "../utils/getOrCreateCart";

import { CART_ERRORS } from "../constants/cart.constants";
import { cartRepository } from "../repositories/cart .repository";
import { AddToCartDto } from "../types/cart.typs";
import { mapCart, mapToClientCartResponse } from "../mapper/cart.mapper";

class CartService {
  async getCart(params: {
    userId?: string;
    guestId?: string;
    res: Response;
  }) {
    const { userId, guestId, res } = params;

    const cart = await getOrCreateCart({
      userId,
      guestId,
      res,
    });

    const cartWithItems = await cartRepository.getCartWithItems(
      prisma,
      cart.id
    );

    if (!cartWithItems) {
      throw new ApiError(404, CART_ERRORS.CART_NOT_FOUND);
    }

    return mapToClientCartResponse(cartWithItems);
  }

  async addToCart(params: {
    dto: AddToCartDto;
    userId?: string;
    guestId?: string;
    res: Response;
  }) {
    const { dto, userId, guestId, res } = params;

    const { productId, quantity } = dto;

    // Guest/User cart create ya fetch
    const cart = await getOrCreateCart({
      userId,
      guestId,
      res,
    });

    const updatedCart = await prisma.$transaction(async (tx) => {
      // Product
      const product = await cartRepository.findProduct(
        tx,
        productId
      );

      if (!product) {
        throw new ApiError(
          404,
          CART_ERRORS.PRODUCT_NOT_FOUND
        );
      }

      // Product Status
      if (product.status !== "ACTIVE") {
        throw new ApiError(
          400,
          CART_ERRORS.PRODUCT_UNAVAILABLE
        );
      }

      // Out of stock
      if (product.stock <= 0) {
        throw new ApiError(
          400,
          CART_ERRORS.OUT_OF_STOCK
        );
      }

      // Existing cart item
      const existingItem =
        await cartRepository.findCartItem(
          tx,
          cart.id,
          productId
        );

      const nextQuantity = existingItem
        ? existingItem.quantity + quantity
        : quantity;

      // Stock validation
      if (nextQuantity > product.stock) {
        throw new ApiError(
          400,
          CART_ERRORS.STOCK_EXCEEDED
        );
      }

      // Upsert item
      await cartRepository.upsertCartItem(
        tx,
        cart.id,
        productId,
        nextQuantity
      );

      // Updated cart
      return cartRepository.getCartWithItems(
        tx,
        cart.id
      );
    });

    if (!updatedCart) {
      throw new ApiError(
        500,
        "Failed to fetch updated cart."
      );
    }

    return mapCart(updatedCart);
  }

  async removeCartItem(params: {
    itemId: string;
    userId?: string;
    guestId?: string;
    res: Response;
  }) {
    const { itemId, userId, guestId, res } = params;

    let cart = null;

  if (userId) {
    cart = await cartRepository.findCartByUserId(userId);
  } else if (guestId) {
    cart = await cartRepository.findCartByGuestId(guestId);
  }

  if (!cart) {
    throw new ApiError(404, CART_ERRORS.CART_NOT_FOUND);
  }


    const updatedCart = await prisma.$transaction(async (tx) => {
      const cartItem = await cartRepository.findCartItemById(tx, itemId);
      if (!cartItem) {
        throw new ApiError(404, CART_ERRORS.CART_ITEM_NOT_FOUND);
      }

      if (cartItem.cartId !== cart.id) {
        throw new ApiError(403, CART_ERRORS.UNAUTHORIZED_CART_ITEM);
      }

      await cartRepository.removeCartItem(tx, itemId);

      return cartRepository.getCartWithItems(tx, cart.id);
    });

    if (!updatedCart) {
      throw new ApiError(500, "Failed to fetch updated cart.");
    }

    return mapToClientCartResponse(updatedCart);
  }

  

  async updateCartItemQuantity(params: {
  productId: string;
  quantity: number;
  userId?: string;
  guestId?: string;
}) {
  const { productId, quantity, userId, guestId } = params;

  let cart = null;

  if (userId) {
    cart = await cartRepository.findCartByUserId(userId);
  } else if (guestId) {
    cart = await cartRepository.findCartByGuestId(guestId);
  }

  if (!cart) {
    throw new ApiError(404, CART_ERRORS.CART_NOT_FOUND);
  }

  const updatedCart = await prisma.$transaction(async (tx) => {
    const product = await cartRepository.findProduct(tx, productId);

    if (!product) {
      throw new ApiError(404, CART_ERRORS.PRODUCT_NOT_FOUND);
    }

    if (product.status !== "ACTIVE") {
      throw new ApiError(400, CART_ERRORS.PRODUCT_UNAVAILABLE);
    }

    if (quantity > product.stock) {
      throw new ApiError(400, CART_ERRORS.STOCK_EXCEEDED);
    }

    const cartItem = await cartRepository.findCartItem(
      tx,
      cart.id,
      productId
    );

    if (!cartItem) {
      throw new ApiError(404, "Cart item not found");
    }

    await cartRepository.updateCartItemQuantity(
      tx,
      cartItem.id,
      quantity
    );

    return cartRepository.getCartWithItems(tx, cart.id);
  });

  if (!updatedCart) {
    throw new ApiError(500, "Unable to update cart");
  }

  return mapCart(updatedCart);
}
}

export const cartService = new CartService();